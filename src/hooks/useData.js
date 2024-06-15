import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUserApi, useGroupApi, useEventApi, useLoading } from '../hooks'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar'


const DataContext = createContext({
  user: null,
  session: null,
  setUser: () => {},
  setSession: () => {}
});

//functions in here all need to update app state directly or indirectly. many of these are wrapper functions around other api hooks
//this hook wraps the context hook
export const DataProvider = ({ children }) => {

  const { getComments, insertEvent, getEvents, getRsvpRequests, insertComment, getRsvpCounts, getLikes } = useEventApi()
  const { getProfile, updateProfile, getProfiles } = useUserApi()
  const { updateGroup, insertGroup, getGroups } = useGroupApi()
  const { loading, setLoading } = useLoading()

  //state
  //session and  profile
  const [ user, setUser ] = useState(null)
  const [ session, setSession ] = useState(null)

  //all public groups and events
  const [ groups, setGroups ] = useState(null)
  const [ events, setEvents ] = useState(null)
  const [ profiles, setProfiles ] = useState(null)
  const [ rsvpRequests, setRsvpRequests ] = useState(null)
  const [ rsvpCounts, setRsvpCounts ] = useState(null)
  const [ comments, setComments ] = useState(null)
  const [ likes, setLikes ] = useState(null)
  

  const [ thumbnails, setThumbnails ] = useState()

  /*
  initialization process:
  1. get session
  2. get user profile
  3. get groups and events
  4. download group and event thumbnails
  5. get all rsvp requests
  */

  //get the current session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  //get the current user profile
  useEffect(() => {
    if (session && session?.user) {
      getProfile(session, setUser)
    }
  }, [session])

  //get all groups and events
  useEffect(() => {
    async function initialize() {
      setLoading(true)
      await Promise.all([
        getGroups(setGroups),
        getEvents(setEvents),
        getRsvpRequests(setRsvpRequests),
        getComments(setComments),
        getProfiles(setProfiles),
        getRsvpCounts(setRsvpCounts),
        getLikes(setLikes)
      ])
      setLoading(false)
    }
    if (session && session?.user) initialize()

    //subscribe to changes, update state when there are changes
    const eventsSubscription = supabase
      .channel('table_db_changes') 
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
      }, (payload) => {
        console.log('payload recieved')
        console.log(payload.new)
        if (payload.eventType == 'INSERT') {
          setEvents(prevEvents => [payload.new, ...prevEvents])
        } else if (payload.eventType == 'UPDATE') {
          setEvents(prevEvents => [payload.new, ...prevEvents.filter(event => event.id != payload.old.id)])
        } 
      })
      .subscribe();

    const groupsSubscription = supabase
      .channel('table_db_changes') 
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'groups',
      }, (payload) => {
        if (payload.eventType == 'INSERT') {
          setGroups(prevGroups => [payload.new, ...prevGroups])
        } else if (payload.eventType == 'UPDATE') {
          setGroups(prevGroups => [payload.new, ...prevGroups.filter(group => group.id != payload.old.id)])
        } 
      })
      .subscribe();

  }, [user])

  //get all profiles
  //download user avatar
  useEffect(() => {
    if (!user?.avatar_url) return

  }, [user])

  //download images
  useEffect(() => {
    if (!(session && session?.user)) return
    if (!(groups && events && profiles)) return

    //stores all thumbnails with key thumbnail_url corresponding to group or event row in thumbnails  
    async function preloadThumbnails() {

      //downloadImage returns a promise. we need to await the return of all of the promises, 
      //but dont wanna do it individually cause that would take too long, so we put them together in a list
      const promises = []
      const images = {}

      //create an individual callback function for each image
      function createCallback(url) {
        return function (dataUrl) {
          images[url] = dataUrl
        }
      }

      //create promises for all group and event thumbnails using downloadImage
      for (let group of groups) {
        if (group.thumbnail_url) promises.push(downloadImage(group.thumbnail_url, createCallback(group.thumbnail_url)))
      }

      for (let event of events) {
        if (event.thumbnail_url) promises.push(downloadImage(event.thumbnail_url, createCallback(event.thumbnail_url)))
      }

      for (let profile of profiles) {
        if (profile.avatar_url) promises.push(downloadImage(profile.avatar_url, createCallback(profile.avatar_url)))
      }


      //await all the promises
      await Promise.all(promises)
      setThumbnails(images)

    }
    preloadThumbnails()

  }, [groups, events, profiles])

  //functions to return a single object by id
  function groupById(groupId) {
    return groups.find(group => group.id == groupId)
  }
  function profileById(userId) {
    return profiles.find(profile => profile.id == userId)
  }
  function eventById(eventId) {
    return events.find(event => event.id == eventId)
  }

  //functions to filter data, so each component only does what it needs to
  function groupsOfUser(userId = user.id) {
    return groups.filter(group => group.members.includes(userId))
  }
  function rsvpRequestsOfUser(userId = user.id, status = 'pending') {
    return rsvpRequests.filter(request => 
      request.user_id == userId && request.status == status
    )
  }
  function eventsOfUser(userId = user.id) {
    return events.filter(event => 
      rsvpRequestsOfUser(userId, 'accepted').map(request => request.event_id).includes(event.id)
    )
  }
  function eventsOfGroup(groupId) {
    return events.filter(event => event.group_id == groupId)
  }
  function rsvpRequestsOfGroup(groupId) {
    return rsvpRequests.filter(request => request.group_id == groupId)
  }

  function commentsOfEvent(eventId) {
    return comments.filter(comment => comment.event_id == eventId)
  }
  function repliesOfComment(commentId) {
    return comments.filter(comment => comment.replied_comment_id == commentId)
  }

  function petitionsOfUser(userId = user.id) {
    return events.filter(event => groupById(event.group_id).members.includes(userId)).filter(event => event.petition)
  }

  function countsOfEvent(eventId) {
    const counts = rsvpCounts.find(event => event.event_id == eventId)
    
    return {yes: counts?.accepted_rsvps, no: counts?.declined_rsvps, maybe: rsvpRequests.filter(request => request.event_id == eventId).length - counts?.accepted_rsvps - counts?.declined_rsvps}
  }

  //WHAT FOLLOWS ARE INSERT AND RELOAD WRAPPER FUNCTIONS
  //update the profile and reload
  async function updateGetProfile(updates) {
    
    try {
      const imageUrl = await uploadAvatar(updates.image_uri)
      updates.avatar_url = imageUrl
      delete updates.image_uri  
      updateProfile(session, updates)
    } finally {
      getProfile(session, setUser)
    }
  }
  async function insertCommentAndUpdate(comment) {
    try {
      await insertComment(comment)
    } finally {
      await getComments(setComments)
    }
  }



  


  /*
  -
  -
  -
  PUT THESE IN ANOTHER FILE
  -
  -
  -
  */
  async function uploadGroupThumbnail (uri) {
    try {
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
  

      const { data, error } = await supabase.storage
        .from('group_thumbnails') // Replace with your bucket name
        .upload(path, arrayBuffer, {
          contentType: contentType,
        });
      

      if (error) throw error;
      
      return data.fullPath
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
      throw error;
    }
  }

  async function uploadAvatar (uri) {
    try {
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
  

      const { data, error } = await supabase.storage
        .from('avatars') // Replace with your bucket name
        .upload(path, arrayBuffer, {
          contentType: contentType,
        });
      

      if (error) throw error;
      
      return data.fullPath
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
      throw error;
    }
  }



  async function createGroup(data) {
    const imageUrl = await uploadGroupThumbnail(data.image_uri)
    data.thumbnail_url = imageUrl
    delete data.image_uri

    function newGroupCallback(newGroup) {
      setGroups(prevGroups => [newGroup, ...prevGroups])
    }
    await insertGroup(session, data, newGroupCallback)
  }

  async function createEvent(data) {
    const imageUrl = await uploadGroupThumbnail(data.image_uri)
    data.thumbnail_url = imageUrl
    delete data.image_uri
    await insertEvent(data)

    //THIS IS A HACK
    setEvents(prevEvents => [data, ...prevEvents])

  }

  async function signOut() {
    supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.replace('/')
  }

  function getGroupFromId(id) {
    return groups.find(g => g.id == id)
  }

  async function pickImage () {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      return result.assets[0].uri;
    }
  
    return null;
  }

  async function downloadImage(fullPath, callback) {
    try {
      const [bucketName, ...relativePathParts] = fullPath.split('/');
      const relativePath = relativePathParts.join('/');
    
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(relativePath)
      
      if (error) throw error

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        callback(fr.result);
      }

    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } 
  }
  
  return (
    <DataContext.Provider 
      value={
        { 
          user, setUser, 
          session, setSession, 
          groups, 
          events,
          rsvpRequests,
          rsvpCounts,
          comments,
          likes,

          eventById,
          groupById,
          profileById,

          groupsOfUser,
          eventsOfUser,
          rsvpRequestsOfUser,
          commentsOfEvent,
          repliesOfComment,
          eventsOfGroup,
          rsvpRequestsOfGroup,
          petitionsOfUser,
          countsOfEvent,

          insertCommentAndUpdate,
          updateGetProfile, 

          thumbnails,

          signOut, 
          createGroup, 
          getGroupFromId, 
          pickImage,
          uploadGroupThumbnail,
          downloadImage,
          createEvent,
          
        }
      }>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext)
export default useData