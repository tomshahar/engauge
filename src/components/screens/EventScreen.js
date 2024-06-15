import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { useData, useEventApi, useUserApi } from '../../hooks';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Palette } from '../../constants/palette';
import { IconButton } from '../ui/IconButton';
import { Comment } from '../cards/Comment'

import RsvpRequest from '../cards/RsvpRequest'
import Ionicons from '@expo/vector-icons/Ionicons';
import { clickProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


export default function EventScreen() {

  const navigation = useNavigation()
  const { user, events, groups, comments, likes, rsvpCounts, thumbnails, rsvpRequests, commentsOfEvent, insertCommentAndUpdate, countsOfEvent } = useData()
  const { likeEvent, removeLike } = useEventApi()
  const { eventId } = useLocalSearchParams()

  const [ currentEvent, setCurrentEvent ] = useState()
  const [ currentEventComments, setCurrentEventComments ] = useState([])

  const [ image, setImage ] = useState()
  const [ group, setGroup ] = useState(null)
  const [ startDate, setStartDate ] = useState()
  const [ endDate, setEndDate ] = useState()
  const [ rsvpRequest, setRsvpRequest ] = useState()

  const [ commentInput, setCommentInput ] = useState('') 
  const [ repliedCommentId, setRepliedCommentId ] = useState(null)
  const [ repliedUserName, setRepliedUserName ] = useState('')
  const [ going, setGoing ] = useState(0)
  const [ notGoing, setNotGoing] = useState(0)
  const [ maybe, setMaybe] = useState(0)

  const [eventLikes, setEventLikes] = useState(0)
  const [liked, setLiked] = useState(false)


  useEffect(() => {
    setCurrentEvent(events.find(event => event.id == eventId))
  }, [eventId])

  useEffect(() => {
    if (!(comments && eventId)) return
    setCurrentEventComments(commentsOfEvent(eventId))
  }, [eventId, comments])

  useEffect(() => {
    navigation.setOptions({ headerTitle: currentEvent?.name})
    setGroup(groups.find(group => group.id == currentEvent?.group_id))
    setStartDate(currentEvent?.event_date)
    setEndDate(currentEvent?.end_date)
  }, [currentEvent])

  useEffect(() => {
    if (thumbnails && currentEvent?.thumbnail_url) setImage(thumbnails[currentEvent?.thumbnail_url])
  }, [currentEvent, thumbnails])

  useEffect(() => {
    if (currentEvent?.rsvps_requested && rsvpRequests) setRsvpRequest(rsvpRequests?.find(rsvp => rsvp.event_id == eventId && rsvp.user_id == user.id && rsvp.status == 'pending'))
  }, [rsvpRequests, currentEvent])

  useEffect(() => {
    if (!eventId) return 
    setGoing(countsOfEvent(eventId).yes)
    setNotGoing(countsOfEvent(eventId).no)
    setMaybe(countsOfEvent(eventId).maybe)
  }, [eventId])

  useEffect(() => {
    if (!eventId) return
    const eventLikes = likes.filter(like => like.event_id == eventId)
    if ((eventLikes.find(like => like.user_id == user?.id)) != null) {
      setLiked(true)
    }
    setEventLikes(eventLikes.length)
  }, [likes])

  async function handlePostComment(comment) {
    await insertCommentAndUpdate(comment)
    setRepliedCommentId(null)
    setRepliedUserName('')
    setCommentInput('')
  }

  function handleLike() {
    if (liked) {
      setEventLikes(eventLikes - 1)
      setLiked(false)
      removeLike(eventId, user.id)
    } else {
      setEventLikes(eventLikes + 1)
      setLiked(true)
      likeEvent(eventId, user.id)
    }
  }
  const date = new Date(startDate)

  return (
    <View style = {{flex: 1, backgroundColor: 'white'}}>
    <ScrollView style = {{flexGrow: 1}}>
      <View style = {styles.container}>
        <View style = {{borderRadius: 12, overflow: 'hidden'}}>
          {image ? <ImageBackground
            source = {{uri: image}}
            style = {{width: '100%', height: 213, resizeMode: 'cover', borderRadius: 12}}
          >
            <View 
              style = {{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}}
            >
              
              <Text style = {{fontSize: 32, color: 'white', fontWeight: 'bold'}}>{currentEvent?.name}</Text>
              {currentEvent?.petition ? <Text style = {{color: 'white', fontSize: 16}}>Petition</Text> : null}
            </View>
          </ImageBackground> : null}
        </View>
        
        <View style = {{ flexDirection: currentEvent?.petition ? 'column-reverse' : 'column'}}>
          {currentEvent?.petition ? <View style = {{flexDirection: 'row', marginTop: 8, alignItems: 'center'}}>
            <IconButton 
              color = {Palette.primary} iconColor = 'white' name = {liked ? 'heart' : 'heart-outline'} size = {18}
              onPress = {handleLike}
            />
            <Text style = {{fontSize: 16, marginLeft: 6}}>{eventLikes + ' Likes'}</Text>
          </View> : null}
          <Text style = {{fontSize: currentEvent?.petition ? 24 : 16, fontWeight: currentEvent?.petition ? 'bold' : 'normal', marginTop: 16}}>{currentEvent?.description ? currentEvent?.description : 'Come join the Xana-community for a day of fun, music, drinks, and vibes! '}</Text>
          <View>
            <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <Ionicons size = {18} color = {Palette.primary} name = 'location-sharp'/>
              <Text style = {{fontSize: 16, color: 'black', marginLeft: 2}}>{currentEvent?.petition ? `Created by ${group?.name}` : `Hosted by ${group?.name}`}</Text>
            </View>
            { currentEvent?.petition ? null : <View>
            <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
              <Ionicons size = {16} color = {Palette.primary} name = 'calendar-sharp'/>
              <Text style = {{fontSize: 16, color: 'black', marginLeft: 4}}>
                {date?.toLocaleDateString('en-US', {
                  weekday: 'long',
                }) + ', ' + date?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit'
                })}
              </Text>
            </View>
            <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 4,}}>
              <Ionicons size = {18} color = {Palette.primary} name = 'time-sharp'/>
              <Text style = {{fontSize: 16,  color: 'black', marginLeft: 2}}>{date.toLocaleTimeString('en-US', {
                  hour: '2-digit',       
                  minute: '2-digit',     
                  hour12: true          
                }) }
              </Text>
            </View>
            </View>}
        </View>
        </View>
        {currentEvent?.rsvps_requested && <View style = {{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
          <View style = {{alignItems: 'center', marginRight: 8}}>
            <View style = {{backgroundColor: '#FFCDD0', borderRadius: 8, alignItems: 'center', width: 48, height: 48, justifyContent: 'center'}}>
              <Text style = {{fontSize: 32}}>{notGoing}</Text>
            </View>
            <Text style = {{fontSize: 12, marginTop: 2}}>No</Text>
          </View>

          <View style = {{alignItems: 'center' , marginRight: 8}}>
            <View style = {{backgroundColor: '#F7E480', borderRadius: 8, alignItems: 'center', width: 48, height: 48, justifyContent: 'center'}}>
              <Text style = {{fontSize: 32}}>{maybe}</Text>
            </View>
            <Text style = {{fontSize: 12, marginTop: 2}}>Maybe</Text>
          </View>

          <View style = {{alignItems: 'center', marginRight: 8}}>
            <View style = {{backgroundColor: '#CAEFE6', borderRadius: 8, alignItems: 'center', width: 48, height: 48, justifyContent: 'center', }}>
              <Text style = {{fontSize: 32}}>{going}</Text>
            </View>
            <Text style = {{fontSize: 12, marginTop: 2}}>Yes</Text>
          </View>
        </View>}
        {rsvpRequest ? <View style = {{alignItems: 'center', marginTop: 16}}>
          <Text style = {{fontSize: 20, fontWeight: 'bold', color: Palette.primary}}>Are you going?</Text>
          <RsvpRequest noThumbnail request = {rsvpRequest}/>
        </View> : null}
        <View style = {{marginTop: 16}}>
          <Text style = {{fontSize: 20, fontWeight: 'bold', color: Palette.primary}}>{currentEvent?.petition ? 'Responses' : 'Comments' }</Text>
          <View>
            {comments.filter(comment => comment.event_id == eventId).length > 0 ? comments.filter(comment => comment.event_id == eventId).filter((comment) => {
              if (comment.replied_comment_id) return false
              return true
            }).map((comment) => {
              return <Comment comment = {comment} setRepliedCommentId = {setRepliedCommentId} repliedCommentId = {repliedCommentId} repliedUserName = {repliedUserName} setRepliedUserName = {setRepliedUserName}/>
            }) : <Text style = {{marginTop: 4, color: '#949494'}}>Be the first to leave a comment!</Text>}
          </View>
        </View>
      </View>
    </ScrollView>
    <View style = {{flexDirection: 'row', marginRight: 12, alignItems: 'center', marginTop: 8, padding: 12}}>
      <View style = {{flexGrow: 1}}>
        <Input 
          placeholder = {repliedCommentId != null ? 'Replying' : 'Leave a comment'}
          value = {commentInput}
          onChangeText = {setCommentInput}
          maxWidth = {312}
        />
      </View>
      <View style = {{marginLeft: 6, width: 32}}>
        <IconButton 
          name = 'create'
          size = {32}
          color = {Palette.primary}
          iconColor = 'white'
          onPress = {() => {
            handlePostComment({content: commentInput, event_id: currentEvent.id, replied_comment_id: repliedCommentId, user_id: user.id})
          }}
        />
      </View>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
})