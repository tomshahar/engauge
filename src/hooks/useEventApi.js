import { supabase } from '../lib/supabase'
import { useLoading } from './'
import { useData } from '../hooks'
import { router } from 'expo-router'
import { Alert } from 'react-native'

export default function useEventApi() {
  const { setLoading } = useLoading()


  // data needs group_id which must match user_id column and auth.uid()
  //{ name, description, event_date, privacy, group_id }
  async function insertEvent(data) {
    try {
      setLoading(true)


      const { error } = await supabase
        .from('events')
        .insert(data)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //can send new event_date, description, name, etc
  async function updateEvent(eventId, updates) {

    try {
      setLoading(true)
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(eventId) {

    try {
      setLoading(true)
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(eventId) {

    try {
      setLoading(true)
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //comment is an object with event_id, replied_comment_id (if reply), and content
  async function insertComment(comment) {
    console.log('test2')
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
      
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }

  }

  async function deleteComment(commentId) {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }

  }
  
  //THIS ONE
  //callback is a callback function to execute on the data (a state set function normally)
  async function getEvents(callback) {

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select()

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getEventsOfGroup(id, callback) {

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select()
        .eq('group_id', id)

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getEventById(id, callback) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select()
        .eq('id', id)
        .single()

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateRsvp(id, newStatus) {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('rsvp_requests')
        .update({status: newStatus})
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getEventComments(eventId, callback) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('event_comments')
        .select()
        .eq('event_id', eventId)

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getRepliesOfComment(commentId, callback) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('event_comments')
        .select()
        .eq('replied_comment_id', commentId)

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    } 
  }

  //THIS ONE
  async function getRsvpCount(eventId, callback) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('event_rsvp_counts')
        .select()
        .eq('event_id', eventId)

        if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { insertEvent, updateEvent, deleteEvent, deleteComment, insertComment, updateRsvp, getEvents, getEventComments, getRsvpCount, getEventsOfGroup, getEventById, getRepliesOfComment }  
}



