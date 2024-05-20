import { supabase } from '../lib/supabase'
import { useLoading } from './'
import { useData } from '../hooks'
import { router } from 'expo-router'
import { Alert } from 'react-native'


export default function useGroupApi() {
  const { setLoading } = useLoading()

  async function updateGroup(session, data) {
    try {
      setLoading(true) 
      if (!session?.user) throw new Error('No user on the session!')
      const updates = {
        ...data, 
        user_id: session?.user.id,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('groups').upsert(updates)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function insertGroup(session, data) {
    try {
      setLoading(true)
      const updates = {
        ...data, 
        user_id: session?.user.id,
        created_at: new Date(),
      }
      const { error } = await supabase.from('groups').insert(updates)

      if (error) throw error

    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)

    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getGroups(callback) {
    try {
      setLoading(true)

      const { error, data } = await supabase.from('groups').select()

      if (error) throw error

      if (data) {
        callback(data)
      }

    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function createInvitation(groupId, invitedUserId) {

    try {
      setLoading(true)
      const {  error } = await supabase
      .from('invitations')
      .insert([
          { group_id: groupId, invited_user_id: invitedUserId, status: 'pending' }
      ]);

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //new status must be either accepted or rejected.
  //on accepted, supabase automatically adds user to group
  async function updateInvitationStatus(invitationId, newStatus) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invitations')
        .update({ status: newStatus })
        .eq('id', invitationId)

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function revokeInvitation(invitationId) {

    try {
      setLoading(true)
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId)

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function insertJoinRequest(userId, groupId) {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('join_requests')
        .insert({user_id: userId, group_id: groupId, status: 'pending'})

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }

  }

  async function updateJoinRequestStatus(requestId, newStatus) {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('join_requests')
        .update({ status: newStatus })
        .eq('id', requestId)

    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  //THIS ONE
  async function getRequestsOfGroup(groupId, callback) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('join_requests')
        .select()
        .match({group_id: groupId, status: 'pending'})

      if (data) callback(data)
    if (error) throw error
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }


  return { updateGroup, insertGroup, getGroups, createInvitation, updateInvitationStatus, revokeInvitation, insertJoinRequest, updateJoinRequestStatus, getRequestsOfGroup }  
}



