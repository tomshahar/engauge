import { View, StyleSheet, Text, ScrollView} from "react-native"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useData, useLoading, useEventApi, useUserApi } from "../../hooks"
import { useEffect, useState } from "react"
import RsvpRequest from "../cards/RsvpRequest"
import { Palette } from "../../constants/palette"
import GroupThumbnail from "../cards/GroupThumbnail"
import EventThumbnail from "../cards/EventThumbnail"

export default function DashboardScreen(props) {
  const [ nameInput, setNameInput ] = useState()
  const [ typeInput, setTypeInput ] = useState()
  const [ rsvpRequests, setRsvpRequests] = useState([])
  const [ userGroups, setUserGroups ] = useState([])
  const [ userEvents, setUserEvents ] = useState([])
  const [creatingGroup, setCreatingGroup] = useState(false)

  const { loading } = useLoading()
  const { createGroup, user, getGroupFromId, groups } = useData()
  const { getRsvpRequestsOfUser, getGroupsOfUser, getEventsOfUser } = useUserApi()
  
  useEffect(() => {
    getRsvpRequestsOfUser(user.id, setRsvpRequests)
    getGroupsOfUser(user.id, setUserGroups)
    getEventsOfUser(user.id, setUserEvents)
  }, [user])

  return (<View style = {styles.container}>
    <View>
      <View>
        <Text style = {{fontSize: 24, fontWeight: 'bold'}}>Your Groups</Text>
        <ScrollView horizontal>
          {userGroups?.map((group) => {
            return <View style = {{marginRight: 24, paddingVertical: 8}}><GroupThumbnail group = {group}/></View>
          })}
        </ScrollView>
      </View>
      {creatingGroup ? <View>
        <View style = {{marginBottom: 8,}}>
          <Input
            disabled = {loading}
            label='Name'
            onChangeText={(text) => setNameInput(text)}
            value={nameInput}
            placeholder='Name'
            autoCapitalize={'none'}
          />
        </View>
        <View style = {{marginBottom: 8,}}>
          <Input
            disabled = {loading}
            label='Type'
            onChangeText={(text) => setTypeInput(text)}
            value={typeInput}
            placeholder='Type (eg. residence, club)'
            autoCapitalize={'none'}
          />
        </View>
        <View style = {{flexDirection: 'row'}}>
          <View style = {{marginRight: 6, marginLeft: 'auto'}}>
            <Button
              onPress = {() => {
                setCreatingGroup(false)
              }}
            >Cancel</Button>
          </View>
          <Button
            color = {Palette.primary}
            textStyle = {{color: 'white', fontWeight: 'bold'}}
            onPress = {() => {
              createGroup({name: nameInput, type: typeInput})
              setCreatingGroup(false)
            }}
          >Create Group</Button>

        </View>

      </View> : <View style = {{flexDirection: 'row'}}>
        <Button
          
          onPress = {() => {setCreatingGroup(true)}}
        >Create Group</Button>
      </View>}
      <View>
        <Text style = {{fontSize: 24, fontWeight: 'bold', marginTop: 16,}}>Upcoming Events</Text>
        <ScrollView horizontal>
          {userEvents?.map((event) => {
            return <View style = {{marginRight: 24, paddingVertical: 8}}><EventThumbnail event = {event}/></View>
          })}
        </ScrollView>
      </View>
    </View>

    <Text style = {{marginTop: 16, fontSize: 24, fontWeight: 'bold'}}>RSVP Requests</Text>
    <View style = {{marginTop: 8}}>
      {rsvpRequests?.map((request) => {
        return <RsvpRequest request = {request} />
      })}
    </View>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
  },
})