import Checkbox from "expo-checkbox"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useData, useGroupApi } from '../../hooks'
import GroupThumbnail from '../cards/GroupThumbnail'
import { Input } from "../ui/Input"
import { Palette } from "../../constants/palette"

export default function BrowseScreen(props) {
  
  const { groups, user } = useData()
  const [ searchTerms, setSearchTerms ] = useState('')
  const [ filterMembership, setFilterMembership ] = useState(false)

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
      <Input 
        placeholder = 'Search groups'
        value = {searchTerms}
        onChangeText = {setSearchTerms}
      />
      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox 
          value = {filterMembership}
          onValueChange={setFilterMembership}
          color={filterMembership ? Palette.primary : undefined}
          style = {{margin: 8}}
        />
        <Text>Don't show your groups</Text>
      </View>

      <ScrollView contentContainerStyle = {{paddingTop: 16}}>

      {groups?.filter(searchFilter).filter(membershipFilter).map((group, index) => {
        return (
            <GroupThumbnail key = {index} group = {group}></GroupThumbnail>
        )
      })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
  },
})