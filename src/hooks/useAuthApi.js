import { supabase } from '../lib/supabase'
import { useLoading } from './'
import { Alert } from 'react-native'

export default function useAuthApi() {
  const { setLoading } = useLoading()

  async function signInWithEmail(email, password) {
    console.log('got here')

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      console.log(error)

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  async function signUpWithEmail(email, password) {

    try {
      setLoading(true)

      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })  
  
      if (error) throw error;
  
      if (!session) Alert.alert('Please check your inbox for email verification!')
  
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return { signInWithEmail, signUpWithEmail }  
}



