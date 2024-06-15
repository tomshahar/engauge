import React, { useState, useEffect } from 'react'
import {  StyleSheet, View, Text, Image } from 'react-native'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useLoading, useData } from '../../hooks'
import { Palette } from '../../constants/palette'
import { router, useNavigation } from 'expo-router'


export default function CreateGroupScreen() {
  const [ nameInput, setNameInput ] = useState()
  const [ typeInput, setTypeInput ] = useState()
  const [ descriptionInput, setDescriptionInput ] = useState()
  const [ imageUri, setImageUri ] = useState(null);

  const { loading } = useLoading()
  const { pickImage, createGroup } = useData()

  async function handlePickImage() {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  }

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Create Group'})
  }, [])

  return (
    <View style = {styles.container}>
      <View>
        <View style = {{marginBottom: 8,}}>
          <Input
            disabled = {loading}
            label='Name'
            onChangeText={(text) => setNameInput(text)}
            value={nameInput}
            placeholder='Name'
            autoCapitalize={'none'}
          />
        </View>
        <View style = {{marginBottom: 8,}}>
          <Input
            disabled = {loading}
            label='Type'
            onChangeText={(text) => setTypeInput(text)}
            value={typeInput}
            placeholder='Type (eg. residence, club)'
            autoCapitalize={'none'}
          />
        </View>
        <View style = {{marginBottom: 8, }}>
          <Input
            value={descriptionInput}
            onChangeText={setDescriptionInput}
            placeholder = "Description"
            multiline 
            numberOfLines = {20}
          ></Input>
        </View>

        <View style = {{alignItems: 'center', paddingBottom: 16, paddingTop: 8}}>
          <Button onPress={handlePickImage} > Pick an image</Button>
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 100, marginTop: 8 }} />}
        </View>

        <View style = {{flexDirection: 'row'}}>
          <View style = {{marginRight: 6, marginLeft: 'auto'}}>
            <Button
              onPress = {() => {
                router.back()
              }}
            >Cancel</Button>
          </View>
          <Button
            color = {Palette.primary}
            textStyle = {{color: 'white', fontWeight: 'bold'}}
            onPress = {() => {
              console.log('button onPress')
              console.log({name: nameInput, type: typeInput, image_uri: imageUri})
              
              createGroup({name: nameInput, type: typeInput, image_uri: imageUri})
              router.navigate({pathname: '(tabs)/dashboard'})

            }}
          >Create Group</Button>

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
    backgroundColor: 'white'
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  }
})