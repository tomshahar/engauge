import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState, Text } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Input } from '../ui/Input'
import { useAuthApi, useLoading } from '../../hooks'
import { Button } from '../ui/Button'

//continuously refresh supabase auth
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function AuthScreen() {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  const { loading } = useLoading()
  const { signInWithEmail, signUpWithEmail } = useAuthApi()

  return (
    <View style={styles.container}>
      <Text style = {{fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 'auto'}}>EnGauge</Text>
      <View style = {{marginBottom: 8,}}>
        <Input
          disabled = {loading}
          label="Email"
          onChangeText={(text) => setEmailInput(text)}
          value={emailInput}
          placeholder="Email"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Input
          disabled = {loading}
          label="Password"
          onChangeText={(text) => setPasswordInput(text)}
          value={passwordInput}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style = {styles.buttons}>
        <View style = {{marginRight: 6,}}>
          <Button disabled={loading} onPress={() => {
            signInWithEmail(emailInput, passwordInput)
          }}>Sign in</Button>
        </View>
        <View style={styles.verticallySpaced}>
          <Button  disabled={loading} onPress={() => {
            signUpWithEmail(emailInput, passwordInput)
          }} >Sign up</Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingBottom: 100,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  }
})