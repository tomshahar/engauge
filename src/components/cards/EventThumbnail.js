import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useData } from "../../hooks";
import { useEffect, useState } from "react";

//info to add to this
//am i in it? number of people. public / private. 
export default function EventThumbnail(props) {
  const date = new Date(props.event.event_date)
  const { setCurrentEvent, getGroupFromId } = useData()
  const [ group, setGroup ] = useState()

  useEffect(() => {
    setGroup(getGroupFromId(props.event?.group_id))
  }, [props.event])
  return (
      <Pressable
        onPress = {()=>{
          setCurrentEvent(props.event)
          router.navigate({pathname: '(tabs)/browse/group/event'})
        }}
        style = {styles.container}
      >
        <Text style = {{fontSize: 12}}>{group?.name}</Text>
        <Text style = {{fontSize: 16, fontWeight: 'bold'}}>{props.event.name}</Text>
        <Text style = {{fontSize: 16}}>{date.toLocaleTimeString('en-US', {
            hour: '2-digit',       
            minute: '2-digit',     
            hour12: true          
          }) + ' on ' + date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
          })}
        </Text>
      </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    backgroundColor: 'white'
  },
})