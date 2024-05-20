import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUserApi, useGroupApi, useEventApi } from '../hooks'
import { Alert } from 'react-native'
import { router } from 'expo-router'

const DataContext = createContext({
  user: null,
  session: null,
  setUser: () => {},
  setSession: () => {}
});

//functions in here all need to update app state directly or indirectly. many of these are wrapper functions around other api hooks
//this hook wraps the context hook
export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [groups, setGroups] = useState([])

  //for the event page, updates changes to events and comments
  const [currentEvent, setCurrentEvent] = useState(null)
  const [currentEventComments, setCurrentEventComments] = useState([])
  const { getEventComments } = useEventApi()

  function updateComments() {
    getEventComments(currentEvent?.id, setCurrentEventComments)
  }
  useEffect(() => {
    updateComments()
  }, [currentEvent])


  const { getProfile, updateProfile } = useUserApi()
  const { updateGroup, insertGroup, getGroups } = useGroupApi()

  //get the current session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  //load the current user profile, it will be stored in data
  useEffect(() => {
    if (session && session?.user) {
      getProfile(session, setUser)
      fetchGroups()
    }
  }, [session])
  
  async function updateGetProfile(updates) {
    try {
      updateProfile(session, updates)
    } finally {
      getProfile(session, setUser)
    }
  }

  async function createGroup(data) {
    try {
      insertGroup(session, data)
    } finally {
      fetchGroups()
    }
  }

  async function signOut() {
    supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.replace('/')
  }

  async function fetchGroups() {
    getGroups(setGroups)
  }

  function getGroupFromId(id) {
    return groups.find(g => g.id == id)
  }

  return (
    <DataContext.Provider value={{ user, setUser, session, setSession, updateGetProfile, signOut, createGroup, groups, getGroupFromId, currentEvent, setCurrentEvent, currentEventComments, updateComments }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext)
export default useData