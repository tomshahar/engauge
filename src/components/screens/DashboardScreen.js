import { View, StyleSheet, Text, ScrollView} from "react-native"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useData, useLoading, useEventApi, useUserApi } from "../../hooks"
import { useEffect, useState } from "react"
import RsvpRequest from "../cards/RsvpRequest"
import { Palette } from "../../constants/palette"
import GroupThumbnail from "../cards/GroupThumbnail"
import EventThumbnail from "../cards/EventThumbnail"
import { router } from "expo-router"
import Ionicons from '@expo/vector-icons/Ionicons';


export default function DashboardScreen(props) {
  const [ userEvents, setUserEvents ] = useState([])
  const [ userGroups, setUserGroups ] = useState([])
  const [ userRsvpRequests, setUserRsvpRequests ] = useState([])
  const [ userPetitions, setUserPetitions ] = useState([])

  //functions that return arrays
  const { user, events, groups, rsvpRequests, eventsOfUser, groupsOfUser, rsvpRequestsOfUser, petitionsOfUser } = useData()
  
  //load data and listen for updates
  useEffect(() => {
    setUserEvents(eventsOfUser(user.id))
    setUserPetitions(petitionsOfUser(user.id))
  }, [events])

  useEffect(() => {
    setUserGroups(groupsOfUser(user.id))
  }, [groups])

  useEffect(() => {
    setUserRsvpRequests(rsvpRequestsOfUser(user.id))
  }, [rsvpRequests])

  console.log(events)
  return (<ScrollView style = {styles.container}>
    <View>
      <View>
        <Text style = {{fontSize: 20, fontWeight: 'bold', marginTop: 16, color: Palette.primary}}>Upcoming Events</Text>
        <Text style = {{fontSize: 14, marginTop: 2, color: '#949494'}}>You're going!</Text>
        <ScrollView horizontal>
          {userEvents?.reverse().length > 0 ? userEvents?.map((event) => {
            return <View style = {{marginRight: 12, paddingVertical: 8}}><EventThumbnail event = {event}/></View>
          }) : <View style = {{alignItems: 'center', flexDirection: 'row', marginVertical: 8}}>
            <Text>You haven't responded</Text>
            <View style = {{backgroundColor: '#CAEFE6', height: 18, width: 18, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, borderRadius: 4}}><Ionicons size = {16} name = 'checkmark' /></View> 
            <Text>to any upcoming events.</Text>
          </View>}
        </ScrollView>
      </View>
    </View>

    <Text style = {{marginTop: 32, fontSize: 20, fontWeight: 'bold', color: Palette.primary}}>RSVP Requests</Text>
    <Text style = {{fontSize: 14, marginTop: 2, color: '#949494'}}>Can you make it?</Text>
    <ScrollView horizontal style = {{}}>
      {userRsvpRequests?.reverse().length > 0 ? userRsvpRequests?.map((request) => {
        return <View style = {{marginRight: 12}}><RsvpRequest request = {request} /></View>
      }) : <Text style = {{marginVertical: 8}}>None of your groups have outsdanding RSVP requests.</Text>}
    </ScrollView>
    <Text style = {{marginTop: 32, fontSize: 20, fontWeight: 'bold', color: Palette.primary}}>Petitions</Text>
    <Text style = {{fontSize: 14, marginTop: 2, color: '#949494'}}>What do you think?</Text>
    <ScrollView horizontal style = {{}}>
      {userPetitions?.length > 0 ? userPetitions?.map((petition) => {
        return <View style = {{marginRight: 12}}><EventThumbnail event = {petition} /></View>
      })  : <Text style = {{marginVertical: 8}}>None of your groups have created any petitions.</Text>}
    </ScrollView>

      <View>
        <View style = {{flexDirection: 'row', marginTop: 32, alignItems: 'center', justifyContent: 'space-between'}}>

          <Text style = {{fontSize: 20, fontWeight: 'bold', color: Palette.primary}}>Your Groups</Text>
          <Button
            onPress = {() => {router.navigate({pathname: '(tabs)/browse/group/create_group'})}}
          >Create Group</Button>
        </View>
        <ScrollView>
          {userGroups?.length > 0 ? userGroups?.reverse().map((group) => {
            return <View style = {{paddingVertical: 8}}><GroupThumbnail group = {group}/></View>
          }) : <Text style = {{marginVertical: 8}}>You haven't joined any groups yet.</Text>}
        </ScrollView>
      </View>
  </ScrollView>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
  },
})