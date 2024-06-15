import { View, Text, Pressable, StyleSheet, ImageBackground, registerCallableModule } from "react-native";
import { router } from "expo-router";
import { useData } from "../../hooks";
import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

//info to add to this
//am i in it? number of people. public / private. 
export default function EventThumbnail(props) {
  const date = new Date(props.event.event_date)

  const { groups, thumbnails } = useData()
  const [ group, setGroup ] = useState()
  const [ image, setImage ] = useState(null)

  
  useEffect(() => {
    setGroup(groups.find(group => group.id == props.event?.group_id))
  }, [props.event])

  useEffect(() => {
    if (thumbnails && props.event?.thumbnail_url) setImage(thumbnails[props.event.thumbnail_url])
  }, [thumbnails, props.event.thumbnail_url])

  return (
    <Pressable
      onPress = {()=>{
        router.navigate({pathname: `(tabs)/browse/event/${props.event.id}`})
      }}
      style = {[
        styles.container, 
        props.event.petition ? {borderColor: 'blue', width: 279, height: 167} : {borderColor: 'transparent', width: 186,},
        props.widescreen ? {height: 208, width: '100%'} : props.event.petition ? null : {borderColor: 'transparent', width: 186,},
      ]}
    >
      <ImageBackground source = {{uri: image}} style = {{flex: 1, resizeMode: 'cover', width: '100%', borderRadius: 12,}}>
        <View 
          style = {{flex: 1, 
            paddingHorizontal: 12, 
            backgroundColor: props.event.petition ? 'rgba(0,0,0,0.7)' :'rgba(0,0,0,0.4)' , 
            alignItems: props.event.petition || props.widescreen ? 'flex-start' : 'center',
          }}
        >
          <View style = {{alignItems: props.widescreen || props.event.petition ? 'flex-start' : 'center'}}>
            <Text style = {{fontSize: props.widescreen ? 16 : 12, marginTop: 12, color: 'white', }}>{(props.widescreen ? 'Hosted by ' : '') + group?.name}</Text>
            <Text style = {{fontSize: props.widescreen ? 32 : 20, fontWeight: 'bold', color: 'white', }}>{props.event.name}</Text>
          </View>
          {!props.event.petition ? <View style = {{marginTop: 'auto', alignItems: props.widescreen ? 'flex-start' : 'center',}}><Text style = {{fontSize: 16,  color: 'white'}}>
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
            }) + ', ' + date.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit'
            })}
          </Text>
          <Text style = {{fontSize: 16, marginBottom: 16, color: 'white'}}>{date.toLocaleTimeString('en-US', {
              hour: '2-digit',       
              minute: '2-digit',     
              hour12: true          
            }) }
          </Text></View> : <View>
            <Text style = {{color: 'white', marginHorizontal: props.event.petition ? 0 : 12, marginTop: 8}}>{props.event.description}</Text>
          </View>}
        </View>
      </ImageBackground>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    backgroundColor: '#eaeaea',
    height: 253,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
})