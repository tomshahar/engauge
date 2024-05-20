import { supabase } from '../lib/supabase'
import { useLoading } from '.'
import { useState } from 'react'
import { useData } from '../hooks'
import { Alert } from 'react-native'

//updates: first_name, last_name, 
export default function useUserApi() {

  const { setLoading } = useLoading()

  async function updateProfile(session, newProfile) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')
  
      const updates = {
        ...newProfile, 
        id: session?.user.id,
        updated_at: new Date(),
      }
  
      const { error } = await supabase.from('profiles').upsert(updates)
  
      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getProfile(session, callback) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')
  
      const { data, error, status } = await supabase
        .from('profiles')
        .select()
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }
  
      if (data) {
        callback(data)

      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getProfileFromId(id, callback) {
    try {
      setLoading(true)
  
      const { data, error } = await supabase
        .from('profiles')
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

  //THIS ONE
  async function getRsvpRequestsOfUser(id, callback) {
    try {
      setLoading(true)
  
      const { data, error } = await supabase
        .from('rsvp_requests')
        .select()
        .match({user_id: id, status: 'pending'})
      
      if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  //THIS ONE
  async function getGroupsOfUser(id, callback) {
    try {
      setLoading(true)
  
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .filter('members', 'cs', `{${id}}`);
        
      if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getEventsOfUser(id, callback) {
    try {
      setLoading(true)
  
      const { data, error } = await supabase
        .from('accepted_user_events')
        .select('*')
        .eq('user_id', id);
          
      if (data) callback(data)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }



  return { updateProfile, getProfile, getProfileFromId, getRsvpRequestsOfUser, getGroupsOfUser, getEventsOfUser }
}



