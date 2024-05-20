import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useData } from '../../../src/hooks'
import { useState, useEffect } from 'react'
import { useUserApi, useEventApi, useGroupApi } from '../../../src/hooks/'
import { Button } from '../ui/Button'
import EventThumbnail from '../cards/EventThumbnail'
import { Palette } from '../../constants/palette'


function JoinRequest(props) {
  const [requestedUser, setRequestedUser] = useState(null)
  const { getProfileFromId } = useUserApi()
  const { updateJoinRequestStatus } = useGroupApi()
  useEffect(() => {
    getProfileFromId(props.request.user_id, setRequestedUser)
  }, [props.request])

  return (
    <View>
      <Text style = {{fontSize: 16}}>{requestedUser?.first_name + ' ' + requestedUser?.last_name}</Text>
      <Pressable
        onPress = {() => {
          console.log('test')
          updateJoinRequestStatus(props.request.id, 'approved')
        }}
      ><Text style = {{fontSize: 16, color: Palette.primary}}>Accept</Text></Pressable>
    </View>
  )
}

function MemberThumnail(props) {
  const { getProfileFromId } = useUserApi()
  const [ member, setMember ] = useState(null)
  useEffect(() => {
    getProfileFromId(props.id, setMember)
  }, [props.id])
  return (
    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
      {props.isOwner ? <View style = {{width: 6, height: 6, borderRadius: 6, backgroundColor: Palette.primary, marginRight: 3}}></View> : null}
      <Text style = {{fontSize: 16, color: 'black'}}>{`${member?.first_name} ${member?.last_name}`}</Text>
    </View>
    )
}

export default function Group() {

  const [ group, setGroup ] = useState()
  const [ owner, setOwner ] = useState()
  const [ events, setEvents ] = useState([])
  const [ requests, setRequests ] = useState([])
  //if current user is owner:
  const [ isOwner, setIsOwner ] = useState(false)

  const { id } = useLocalSearchParams()
  const { getGroupFromId, user } = useData() 
  const { getProfileFromId } = useUserApi()
  const { getEventsOfGroup } = useEventApi()
  const { insertJoinRequest, getRequestsOfGroup } = useGroupApi()

  const navigation = useNavigation()

  //load the group and events when the id from navigation loads
  useEffect(() => {
    setGroup(getGroupFromId(id))
    getEventsOfGroup(id, setEvents)
  }, [id])

  //set the title, load the profile of the group owner 
  useEffect(() => {
    navigation.setOptions({ headerTitle: group?.name})
    setOwner(getProfileFromId(group?.user_id, setOwner))
  }, [group])

  //check if the current user is the owner and load the requests
  useEffect(() => {
    if (user?.id == owner?.id) {
      getRequestsOfGroup(group.id, setRequests)
      setIsOwner(true)
    }
  }, [owner])

  return (
    <ScrollView style = {styles.container}>
      <Text style = {{fontSize: 24, fontWeight: 'bold'}}>{group?.name}</Text>
      <Text style = {{fontSize: 16}}>{group?.type}</Text>
      {!isOwner ? <View style = {{flexDirection: 'row', marginTop: 8}}><Button onPress = {()=> {
        insertJoinRequest(user.id, group.id)
      }}>Request to Join</Button></View> : <View style = {{flexDirection: 'row', marginTop: 16,}}>
        <Button
          onPress = {() => {
            router.navigate({pathname: '(tabs)/browse/group/create_event', params: {groupName: group.name, groupId: group.id}})
          }}
        >Create Event</Button>
      </View>}
      <Text style = {{fontSize: 16, marginTop: 16, fontWeight: 'bold'}}>Members</Text>
      {group?.members.map((memberId) => {
        return (<MemberThumnail id = {memberId} isOwner = {memberId == owner.id}/>)
      })}
      {isOwner ? <View><Text style = {{fontSize: 16, marginTop: 16, fontWeight: 'bold'}}>Requests</Text>
      {requests?.map((request) => {
        return (<JoinRequest request = {request}/>)
      })}{requests.length == 0 ? <Text>No users have requested to join!</Text> : null}</View> : null}
      
      <Text style = {{fontSize: 16, marginTop: 16, fontWeight: 'bold'}}>Events</Text>
      
      {events?.map((event) => {
        return <EventThumbnail event = {event}/>
      })}

      
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