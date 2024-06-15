import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { useData, useUserApi, useEventApi } from "../../hooks";
import { useEffect, useState } from "react";
import { Palette } from "../../constants/palette";

//info to add to this
//am i in it? number of people. public / private. 
export function Comment(props) {


  const { repliesOfComment, comments, thumbnails, profileById } = useData()
  const [ user, setUser ] = useState()
  const [ replyingTo, setReplyingTo ] = useState(false)
  const [ replies, setReplies ] = useState([])
  const [ image, setImage ] = useState()

  useEffect(() => {
    if (props.comment.user_id) setUser(profileById(props.comment.user_id)) 
  }, [props.comment.user_id])

  useEffect(() => {
    if (thumbnails && user?.avatar_url) setImage(thumbnails[user?.avatar_url])
  }, [thumbnails, user?.avatar_url])

  useEffect(() => {
    setReplyingTo(props.repliedCommentId == props.comment.id)
  }, [props.repliedCommentId])

  useEffect(() => {
    setReplies(repliesOfComment(props.comment.id))
  }, [props.comment.id, comments])

  return (
    <View style = {styles.container}>
      <View style = {{flexDirection: 'row', flex: 1, }}>
        <View style = {{ borderRadius: 4, overflow: 'hidden', width: 28, height: 28, marginTop: 4, marginRight: 6, backgroundColor: '#eaeaea'}}>{image && <Image source={{ uri: image }} style={{ width: 28, height: 28, }} />}</View>
        
        <View style = {{flex: 1,}}>
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
          ><Text style = {{fontSize: 12, fontWeight: 'normal', color: 'grey'}}>{replyingTo ? 'Cancel' : 'Reply'}</Text></Pressable>
          
        </View>
      </View>
      <View style = {{paddingLeft: 18,  marginTop: 4}}>
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
    flex: 1,
  },
})