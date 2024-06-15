import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { router, Link } from "expo-router";
import { useData } from "../../hooks";
import { useEffect, useState } from "react";
import { Palette } from "../../constants/palette";
import { LinearGradient } from 'expo-linear-gradient';

//info to add to this
//am i in it? number of people. public / private. 
export default function GroupThumbnail(props) {
  const { user, downloadImage, thumbnails } = useData()
  const [ joined, setJoined ] = useState(false)
  const [ image, setImage ] = useState(null)

  useEffect(()=> {
    if (user?.id) if (props.group.members.includes(user?.id)) setJoined(true)
  }, [user])

  useEffect(() => {
    if (props.group?.thumbnail_url && thumbnails) setImage(thumbnails[props.group?.thumbnail_url])
  }, [props.group.thumbnail_url, thumbnails])

  return (
      <Pressable
        onPress = {()=>{ router.navigate({pathname: '(tabs)/browse/group/[id]', params: { id: props.group.id } })}}
        style = {styles.container}
      >
        <ImageBackground source = {{uri: image}} style = {{flex: 1, resizeMode: 'cover', borderRadius: 12,}}>
          <LinearGradient 
            start = {{x: 0.5, y:0}}
            end = {{x: 0.5, y:1}}
            locations = {[ 0.51,  0.82,  0.92]}
            colors = {['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.7)']}
            style = {{flex: 1}}
          >
            <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 16, marginHorizontal: 12,}}>
              <Text style = {{fontSize: 32, fontWeight: 'bold', alignItems: 'center', color: 'white'}}>{props.group.name}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

      </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    borderRadius: 12,
    height: 208,
    overflow: 'hidden',
  },
})