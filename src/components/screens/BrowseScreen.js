import Checkbox from "expo-checkbox"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { useData, useGroupApi } from '../../hooks'
import GroupThumbnail from '../cards/GroupThumbnail'
import { Input } from "../ui/Input"
import { Palette } from "../../constants/palette"
import EventThumbnail from "../cards/EventThumbnail"

export default function BrowseScreen(props) {
  
  const { groups, user, events } = useData()
  const [ searchTerms, setSearchTerms ] = useState('')
  const [ filterMembership, setFilterMembership ] = useState(false)
  const [ eventsTab, setEventsTab ] = useState(false)

  function searchFilter(group) {
    if (searchTerms.length > 0) return group.name.includes(searchTerms)
    return true
  }

  function membershipFilter(group) {
    if (filterMembership) return !group.members.includes(user.id)
    return true
  }
  
  return (
    <View style = {styles.container}>
      <View style = {styles.eventsTab}>
        <Pressable
          onPress = {() => setEventsTab(false)}
          style = {{paddingTop: 8, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: Palette.primary, flex: 1, alignItems: 'center'}}
        ><Text style = {{color: eventsTab ? '#949494' : Palette.primary, fontWeight: 'bold', fontSize: 16}}>Groups</Text></Pressable>
        <Pressable
          onPress = {() => setEventsTab(true)}
          style = {{paddingTop: 8, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: Palette.primary, flex: 1, alignItems: 'center'}}
        ><Text style = {{color: !eventsTab ? '#949494' : Palette.primary, fontWeight: 'bold', fontSize: 16}}>Events</Text></Pressable>

      </View>
      
      {/*<View style = {{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox 
          value = {filterMembership}
          onValueChange={setFilterMembership}
          color={filterMembership ? Palette.primary : undefined}
          style = {{margin: 8}}
        />
        <Text>Don't show your groups</Text>
      </View>*/}

      <ScrollView contentContainerStyle = {{paddingTop: 16}}>
        <View style = {{marginBottom: 12}}><Input 
          placeholder = {`Search ${eventsTab ? 'events' : 'groups'}`}
          value = {searchTerms}
          onChangeText = {setSearchTerms}
        /></View>
        {eventsTab ? 
          events?.reverse().filter(searchFilter).filter((event) => {return !event.petition}).map((event, index) => {
            return <EventThumbnail key = {index} event = {event} widescreen/>
          }) : 
          groups?.reverse().filter(searchFilter).filter(membershipFilter).map((group, index) => {
          return (
              <View style = {{paddingVertical: 8}}><GroupThumbnail key = {index} group = {group}></GroupThumbnail></View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: 'white'
  },
  eventsTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    borderBottomColor: Palette.primary
  }
})