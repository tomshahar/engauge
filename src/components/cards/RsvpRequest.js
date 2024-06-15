import { View, StyleSheet, Text} from "react-native"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useData, useLoading, useEventApi, useUserApi } from "../../hooks"
import { useEffect, useState } from "react"
import { IconButton } from "../ui/IconButton"
import EventThumbnail from "./EventThumbnail"


export default function RsvpRequest(props) {
  const { getGroupFromId } = useData()
  const { getEventById, updateRsvp } = useEventApi()
  const [ event, setEvent ] = useState()
  const [ group, setGroup ] = useState()

  useEffect(() => {
    getEventById(props.request.event_id, setEvent)
  }, [props.request])

  useEffect(() => {
    setGroup(getGroupFromId(event?.group_id))
  }, [event])

  return (<View style = {styles.container}>
    {props.noThumbnail ? null : <View>
      {event ? <EventThumbnail event = {event}/> : null}
    </View>}
    <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
      <IconButton
        onPress = {() => {
          updateRsvp(props.request.id, 'rejected')
        }}
        name = 'close'
        size = {24}
        color = '#FFCDD0'
        iconColor = 'black'

      ></IconButton>
      <View style = {{marginLeft: 6}}>
        <IconButton
          onPress = {() => {
          }}
          name = 'flag-outline'
          size = {24}
          color = '#F7E480'
          iconColor = 'black'
          

        ></IconButton>
      </View>

      <View style = {{marginLeft: 6}}>
        <IconButton
          onPress = {() => {
            updateRsvp(props.request.id, 'accepted')
          }}
          name = 'checkmark'
          size = {24}
          color = '#CAEFE6'
          iconColor = 'black'
          

        ></IconButton>
      </View>
    </View>
  </View>)
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    alignItems: 'center',
  },
})