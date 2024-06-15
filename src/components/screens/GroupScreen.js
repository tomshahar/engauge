import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Text, View, StyleSheet, Pressable, ScrollView, ImageBackground, Image } from 'react-native'
import { useData } from '../../../src/hooks'
import { useState, useEffect } from 'react'
import { useUserApi, useEventApi, useGroupApi } from '../../../src/hooks/'
import { Button } from '../ui/Button'
import EventThumbnail from '../cards/EventThumbnail'
import { Palette } from '../../constants/palette'
import { LinearGradient } from 'expo-linear-gradient'

function MemberThumnail(props) {
  const { profileById, thumbnails } = useData()
  const [ member, setMember ] = useState(null)
  const [ image, setImage ] = useState()
  useEffect(() => {
    if (props.id) setMember(profileById(props.id))
  }, [props.id])

  useEffect(() => {
    if (thumbnails && member?.avatar_url) setImage(thumbnails[member?.avatar_url])
  }, [thumbnails, member?.avatar_url])

  return (
    <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
      <View style = {{ borderRadius: 4, overflow: 'hidden', width: 28, height: 28, marginRight: 6, backgroundColor: '#eaeaea'}}>{image && <Image source={{ uri: image }} style={{ width: 28, height: 28, }} />}</View>

      <View style = {{flexDirection: 'column'}}>
        <Text style = {{fontSize: 16, color: 'black'}}>{`${member?.first_name} ${member?.last_name} `}<Text style = {{color: '#949494'}}>{props.isOwner && 'Owner'}</Text></Text>
      </View>
    </View>
    )
}


function JoinRequest(props) {
  const { updateJoinRequestStatus } = useGroupApi()
  return (
    <View>
      <MemberThumnail id = {props.request.user_id}/>
      <Pressable
        onPress = {() => {
          updateJoinRequestStatus(props.request.id, 'approved')
        }}
      ><Text style = {{fontSize: 16, color: Palette.primary}}>Accept</Text></Pressable>
    </View>
  )
}


export default function Group() {

  const [ group, setGroup ] = useState()
  const [ owner, setOwner ] = useState()
  const [ groupEvents, setGroupEvents ] = useState([])
  const [ requests, setRequests ] = useState([])
  const [ image, setImage ] = useState()
  //if current user is owner:
  const [ isOwner, setIsOwner ] = useState(false)

  const { id } = useLocalSearchParams()
  const { getGroupFromId, user, groups, events, thumbnails, eventsOfGroup, rsvpRequestsOfGroup } = useData() 
  const { getProfileFromId } = useUserApi()
  const { getEventsOfGroup } = useEventApi()
  const { insertJoinRequest, getRequestsOfGroup } = useGroupApi()

  const navigation = useNavigation()

  //load the group and events when the id from navigation loads
  useEffect(() => {
    setGroup(groups.find(group => group.id == id))
  }, [id])


  useEffect(() => {
    setGroupEvents(eventsOfGroup(id))
  }, [id, events])
  //set the title, load the profile of the group owner 
  useEffect(() => {
    navigation.setOptions({ headerTitle: group?.name})
    getProfileFromId(group?.user_id, setOwner)
  }, [group])

  //check if the current user is the owner and load the requests
  useEffect(() => {
    if (user?.id == owner?.id) {
      getRequestsOfGroup(group.id, setRequests)
      setIsOwner(true)
    }
  }, [owner])

  //get the image
  useEffect(() => {
    if (group?.thumbnail_url && thumbnails) setImage(thumbnails[group?.thumbnail_url])
  }, [group?.thumbnail_url, thumbnails])


  return (
    <ScrollView style = {styles.container}>
      <View style = {{flex: 1, height: 208,}}>
        <View style = {{flex: 1, borderRadius: 12, overflow: 'hidden'}}>
          <ImageBackground source = {{uri: image}} style = {{flex: 1, resizeMode: 'cover', }}>
            <LinearGradient 
              start = {{x: 0.5, y:0}}
              end = {{x: 0.5, y:1}}
              locations = {[ 0.51,  0.62,  0.92]}
              colors = {['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.7)']}
              style = {{flex: 1}}
            >
              <View style = {{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 16, marginHorizontal: 12,}}>
                <Text style = {{fontSize: 32, fontWeight: 'bold', alignItems: 'center', color: 'white'}}>{group?.name}</Text>
                <Text style = {{fontSize: 16, alignItems: 'center', color: 'white'}}>{group?.type}</Text>

              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </View>
      {!isOwner ? <View style = {{flexDirection: 'row', marginTop: 16}}><Button onPress = {()=> {
        insertJoinRequest(user.id, group.id)
      }}>Request to Join</Button></View> : <View><View style = {{flexDirection: 'row', marginTop: 16,}}>
        <Button
          onPress = {() => {
            router.navigate({pathname: '(tabs)/browse/event/create_event', params: {groupName: group.name, groupId: group.id}})
          }}
        >Create Event</Button>
        <View style = {{marginLeft: 12}}><Button
          onPress = {() => {
            router.navigate({pathname: '(tabs)/browse/event/create_petition', params: {groupName: group.name, groupId: group.id}})
          }}
        >Create Petition</Button></View>
      </View></View>}
      <Text style = {{fontSize: 24, marginTop: 16, fontWeight: 'bold', color: Palette.primary}}>Members</Text>
      {group?.members.map((memberId) => {
        return (<MemberThumnail id = {memberId} isOwner = {memberId == owner?.id}/>)
      })}
      {isOwner ? <View><Text style = {{fontSize: 24, marginTop: 16, fontWeight: 'bold', color: Palette.primary}}>Requests</Text>
      {requests?.map((request) => {
        return (<JoinRequest request = {request}/>)
      })}{requests.length == 0 ? <Text style = {{color: '#949494'}}>No users have requested to join.</Text> : null}</View> : null}
      
      <Text style = {{fontSize: 24, marginTop: 16, fontWeight: 'bold', color: Palette.primary}}>Upcoming Events</Text>
      <ScrollView horizontal style = {{paddingBottom: 64}}>
        {groupEvents?.length > 0 ? groupEvents?.map((event) => {
          return <View style = {{marginRight: 12}}><EventThumbnail event = {event}/></View>
        }) : <Text style = {{color: '#949494'}}>No upcoming events.</Text>}
      </ScrollView>

      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
  },
})