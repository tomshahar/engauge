import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Palette } from '../../constants/palette';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Checkbox from 'expo-checkbox';
import { useEventApi, useData } from '../../hooks';


export default function create_event(props) {
  const { groupName, groupId } = useLocalSearchParams()
  const navigation = useNavigation()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [rsvps, setRsvps] = useState(false)
  const [imageUri, setImageUri] = useState()

  const { pickImage, createEvent } = useData()

  function onChangeStartDate(event, selectedDate) {
    const currentDate = selectedDate
    setStartDate(currentDate)
    if (startDate > endDate) {
      setEndDate(startDate)
    }
  }
  function onChangeEndDate(event, selectedDate) {
    const currentDate = selectedDate
    setEndDate(currentDate)
  }

  function insertEventWrapper() {
    const data = {
      event_date: new Date(startDate),
      end_date: new Date(endDate),
      name: name,
      description: description,
      privacy: privacy,
      rsvps_requested: rsvps,
      group_id: groupId,
      image_uri: imageUri,
      petition: props.petition ? props.petition : false
    }
    console.log('insert event wrapper')
    console.log(data)
    createEvent(data)
  }

  async function handlePickImage() {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: props.petition ? 'Create Petition' : 'Create Event'});
  }, [navigation])


  return (
    <View style = {styles.container}>
      <Text style = {{fontSize: 16}}>{ 'For: ' + groupName }</Text>
      <View style = {{marginTop: 16}}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder = "Name"
        ></Input>
      </View>


      <View style = {styles.datePickerSection}>
        <Text style = {{fontSize: 16}}>{props.petition ? 'Potential start time': 'Start Time'}</Text>
        <DateTimePicker
          value={startDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onChangeStartDate}
          accentColor={Palette.primary}
        />
      </View>
      <View style = {styles.datePickerSection}>
        <Text style = {{fontSize: 16}}>{props.petition ? 'Potential end time': 'End Time'}</Text>
        <DateTimePicker
          value={endDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onChangeEndDate}
          accentColor={Palette.primary}
        />
      </View>
      <View style = {{marginTop: 16, }}>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder = {props.petition ? 'A petition can help solicit feedback from your members without committing to the event! Eg. What type of food would you like to see?' : 'Description'}
          multiline 
          numberOfLines = {20}
        ></Input>
      </View>

      { !props.petition ? <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 16}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Checkbox
            style={{margin: 8}}
            value={privacy}
            onValueChange={setPrivacy}
            color={privacy ? Palette.primary : undefined}
          />
          <Text style={{fontSize: 16}}>Private event</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Checkbox
            style={{margin: 8}}
            value={rsvps}
            onValueChange={setRsvps}
            color={rsvps ? Palette.primary : undefined}
          />
          <Text style={{fontSize: 16}}>Rsvps requested</Text>
        </View>
      </View> : null}
      <View style = {{alignItems: 'center', paddingTop: 16}}>
        <Button onPress={handlePickImage} > Pick an image</Button>
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 100, marginTop: 8 }} />}
      </View>

      <View style = {{flexDirection: 'row', justifyContent: 'center', paddingTop: 8}}>
        <Button
          onPress = {() => {
            insertEventWrapper()
            router.navigate({pathname: '(tabs)/browse/group/[id]', params: { id: groupId } })
          }}
        >{ props.petition ? 'Create Petition' : 'Create Event'}</Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white'
  },
  datePickerSection: {
    flexDirection: 'row', marginTop: 16, alignItems: 'center', 
    justifyContent: 'space-between'
  },
  
})