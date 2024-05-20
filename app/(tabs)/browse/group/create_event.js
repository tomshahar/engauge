import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Palette } from '../../../../src/constants/palette';
import { Input } from '../../../../src/components/ui/Input';
import { Button } from '../../../../src/components/ui/Button';
import Checkbox from 'expo-checkbox';
import { useEventApi } from '../../../../src/hooks';


export default function create_event() {
  const { groupName, groupId } = useLocalSearchParams()
  const navigation = useNavigation()

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState(false);
  const [rsvps, setRsvps] = useState(false);

  const { insertEvent } = useEventApi()


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
      group_id: groupId
    }
    insertEvent(data)
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Create Event'});
  }, [navigation]);


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
        <Text style = {{fontSize: 16}}>Start Time</Text>
        <DateTimePicker
          value={startDate}
          mode={'datetime'}
          is24Hour={true}
          onChange={onChangeStartDate}
          accentColor={Palette.primary}
        />
      </View>
      <View style = {styles.datePickerSection}>
        <Text style = {{fontSize: 16}}>End Time</Text>
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
          placeholder = "Description"
          multiline 
          numberOfLines = {20}
        ></Input>
      </View>

      <View style = {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 16}}>
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
      </View>
      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          onPress = {() => {
            insertEventWrapper()
          }}
        >Create Event</Button>
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