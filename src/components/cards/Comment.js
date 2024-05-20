import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useData, useUserApi, useEventApi } from "../../hooks";
import { useEffect, useState } from "react";
import { Palette } from "../../constants/palette";

//info to add to this
//am i in it? number of people. public / private. 
export function Comment(props) {

  const { getProfileFromId } = useUserApi()
  const { getRepliesOfComment } = useEventApi()
  const [ user, setUser ] = useState()
  const [ replyingTo, setReplyingTo ] = useState(false)
  const [ replies, setReplies ] = useState([])

  useEffect(() => {
    getProfileFromId(props.comment.user_id, setUser)
  }, [props.comment.user_id])

  useEffect(() => {
    setReplyingTo(props.repliedCommentId == props.comment.id)
  }, [props.repliedCommentId])

  useEffect(() => {
    getRepliesOfComment(props.comment.id, setReplies)
  }, [props.comment.id])

  return (
    <View style = {styles.container}>
      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
        {replyingTo ? <View style = {{width: 6, height: 6, borderRadius: 6, backgroundColor: Palette.primary, marginRight: 3}}></View> : null}
        <Text style = {{fontSize: 12}}>{user?.first_name + ' ' + user?.last_name}</Text>
      </View>
      <Text style = {{fontSize: 16}}>{props.comment.content}</Text>
      <Pressable
        onPress = {() => {
          if (!replyingTo) props.setRepliedCommentId(props.comment.id)
          if (replyingTo) props.setRepliedCommentId(null)
        }}
      ><Text style = {{fontSize: 12, fontWeight: 'bold', color: 'grey'}}>{replyingTo ? 'Cancel' : 'Reply'}</Text></Pressable>
      <View style = {{paddingLeft: 6, marginLeft: 6, borderLeftColor: '#c0c0bf', borderLeftWidth: 1, marginTop: 4}}>
        {replies.map((comment) => {
          return <Comment comment = {comment} setRepliedCommentId = {props.setRepliedCommentId} repliedCommentId = {props.repliedCommentId} />
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    marginVertical: 2,
  },
})