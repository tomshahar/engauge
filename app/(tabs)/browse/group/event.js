import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useData, useEventApi } from '../../../../src/hooks';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import { Palette } from '../../../../src/constants/palette';
import { IconButton } from '../../../../src/components/ui/IconButton';
import { Comment } from '../../../../src/components/cards/Comment'
import { supabase } from '../../../../src/lib/supabase';

export default function Event() {

  const navigation = useNavigation()
  const { insertComment, getEventComments } = useEventApi()
  const { currentEvent, getGroupFromId, user, currentEventComments } = useData()

  const [group, setGroup] = useState(null)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [ commentInput, setCommentInput ] = useState('') 
  const [ repliedCommentId, setRepliedCommentId ] = useState(null)
  const [ repliedUserName, setRepliedUserName ] = useState('')

  useEffect(() => {
    navigation.setOptions({ headerTitle: currentEvent?.name})
    setGroup(getGroupFromId(currentEvent.group_id))
    setStartDate(currentEvent.event_date)
    setEndDate(currentEvent.end_date)
  }, [currentEvent]);  


  return (
    <View style = {{flex: 1, backgroundColor: 'white'}}>
    <ScrollView style = {{flexGrow: 1}}>
      <View style = {styles.container}>
        <View >
          <Text style = {{fontSize: 24, fontWeight: 'bold'}}>{currentEvent?.name}</Text>
          <Text style = {{fontSize: 16, fontWeight: 'normal'}}>{(new Date(startDate))?.toLocaleDateString() + ' | ' + group?.name}</Text>

          <Text style = {{fontSize: 16, fontWeight: 'normal', marginTop: 16}}>{currentEvent?.description}</Text>
        </View>
        <View style = {{marginTop: 16}}>
          <Text style = {{fontSize: 24, fontWeight: 'bold'}}>Comments</Text>
          <View>
            {currentEventComments.filter((comment) => {
              if (comment.replied_comment_id) return false
              return true
            }).map((comment) => {
              return <Comment comment = {comment} setRepliedCommentId = {setRepliedCommentId} repliedCommentId = {repliedCommentId} repliedUserName = {repliedUserName} setRepliedUserName = {setRepliedUserName}/>
            })}
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
            insertComment({content: commentInput, event_id: currentEvent.id, replied_comment_id: repliedCommentId, user_id: user.id})
            updateComments()
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