import { View, Text, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { useData } from "../../hooks";
import { useEffect, useState } from "react";
import { Palette } from "../../constants/palette";

//info to add to this
//am i in it? number of people. public / private. 
export default function GroupThumbnail(props) {
  const { user } = useData()
  const [ joined, setJoined ] = useState(false)

  useEffect(()=> {
    if (user?.id) if (props.group.members.includes(user?.id)) setJoined(true)
  }, [user])

  return (
      <Pressable
        onPress = {()=>{ router.navigate({pathname: '(tabs)/browse/group/[id]', params: { id: props.group.id } })}}
        style = {{marginBottom: 8}}
      >
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          {joined ? <View style = {{width: 6, height: 6, borderRadius: 6, backgroundColor: Palette.primary, marginRight: 3}}></View> : null}
          <Text style = {{fontSize: 16, fontWeight: 'bold', alignItems: 'center'}}>{props.group.name}</Text>
        </View>
        <Text style = {{fontSize: 12}}>{props.group.type}</Text>

      </Pressable>
  )
}