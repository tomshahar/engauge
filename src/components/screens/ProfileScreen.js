import { View, StyleSheet, Text, Image, ScrollView } from 'react-native'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

import { useLoading } from '../../hooks/'
import { useEffect, useState } from 'react'
import { useData } from '../../hooks'
import { Palette } from '../../constants/palette'



export default function ProfileScreen(props) {
  const { loading } = useLoading()
  const { user, updateGetProfile, signOut, pickImage, thumbnails } = useData()

  const [firstNameInput, setFirstNameInput] = useState('')
  const [lastNameInput, setLastNameInput] = useState('')
  const [imageUri, setImageUri] = useState(null)
  const [classInput, setClassInput] = useState('')
  const [image, setImage] = useState()

  useEffect(() => {
    setFirstNameInput(user?.first_name)
    setLastNameInput(user?.last_name)
    setClassInput(user?.year)
  }, [user])

  useEffect(() => {
    if (thumbnails && user?.avatar_url) setImage(thumbnails[user?.avatar_url])
  }, [thumbnails, user?.avatar_url])

  async function handlePickImage() {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  }


  return (
    <ScrollView style = {styles.container}>
      <View style = {styles.updateSection}>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          {(imageUri || image) && <View style = {{width: 75, height: 75, borderRadius: 8, overflow: 'hidden'}}><Image source={{ uri: imageUri || image }} style={{ width: 75, height: 75, marginBottom: 8 }} /></View>}
          <View style = {{marginLeft: 6, marginBottom: 8,}}>
            <Text style = {{fontSize: 24, fontWeight: 'bold', color: Palette.primary, marginTop: 8}}><Text style = {{fontSize: 16, color: 'black'}}>{'Welcome back, \n'}</Text>{user?.first_name + " " + user?.last_name}</Text>
            {user?.year ? <Text style = {{fontSize: 16}}>{'Class of ' + user?.year}</Text> : null}
          </View>


        </View>

        
        <View style = {{flexDirection: 'column', alignItems: 'flex-start', paddingTop: 16}}>
          <Button  onPress={handlePickImage}>Change profile picture</Button>
        </View>

        <View style = {{marginTop: 16}}>
          <Input
            disabled = {loading}
            label="First name"
            onChangeText={(text) => setFirstNameInput(text)}
            value={firstNameInput}
            placeholder="First name"
            autoCapitalize={'none'}
            
          />
        </View>
        <View style = {{marginTop: 8,}}>
          <Input
            disabled = {loading}
            label="Last name"
            onChangeText={(text) => setLastNameInput(text)}
            value={lastNameInput}
            placeholder="Last name"
            autoCapitalize={'none'}
          />
        </View>
        <View style = {{marginTop: 8,}}>
          <Input
            disabled = {loading}
            label="Class year"
            onChangeText={(text) => setClassInput(text)}
            value={classInput}
            placeholder="eg. 2026"
            autoCapitalize={'none'}
          />
        </View>

      </View>
      <View style = {styles.actions}>
        <View style = {{marginRight: 6}}>
          <Button onPress = {() => {updateGetProfile({first_name: firstNameInput, last_name: lastNameInput, year: classInput, image_uri: imageUri})}}>Save</Button>
        </View>
        <Button onPress = {signOut}>Sign out</Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
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