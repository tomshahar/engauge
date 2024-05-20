import { View, StyleSheet, Text } from 'react-native'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

import { useLoading } from '../../hooks/'
import { useEffect, useState } from 'react'
import { useData } from '../../hooks'



export default function ProfileScreen(props) {
  const { loading } = useLoading()
  const { user, updateGetProfile, signOut } = useData()

  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');

  useEffect(() => {
    setFirstNameInput(user?.first_name)
    setLastNameInput(user?.last_name)

  }, [user])

  return (
    <View style = {styles.container}>
      <View style = {styles.updateSection}>
        <Text>{user?.first_name + " " + user?.last_name}</Text>
        <View style = {{marginBottom: 8,}}>
          <Input
            disabled = {loading}
            label="First name"
            onChangeText={(text) => setFirstNameInput(text)}
            value={firstNameInput}
            placeholder="First name"
            autoCapitalize={'none'}
          />
        </View>
        <View>
          <Input
            disabled = {loading}
            label="Last name"
            onChangeText={(text) => setLastNameInput(text)}
            value={lastNameInput}
            placeholder="Last name"
            autoCapitalize={'none'}
          />
        </View>

      </View>
      <View style = {styles.actions}>
        <View style = {{marginRight: 6}}>
          <Button onPress = {() => {updateGetProfile({first_name: firstNameInput, last_name: lastNameInput})}}>Save</Button>
        </View>
        <Button onPress = {signOut}>Sign out</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  }
})