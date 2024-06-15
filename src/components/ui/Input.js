import { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import { Palette } from '../../constants/palette';
export function Input(props) {
  const [focus, setFocus] = useState(false)
  return (
    <View>          
      {props.label ? <Text style = {{color: focus ? Palette.primary : 'black', fontSize: 12, fontWeight: 'bold', marginBottom: 4}}>{props.label?.toUpperCase()}</Text> : null}
      <TextInput
        {...props}
        onFocus = {() => {
          setFocus(true)
        }}
        onBlur = {() => {
          setFocus(false)
        }}

        style = {[{
          fontSize: 16,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          backgroundColor: '#EAEAEA',
          borderRadius: 4,
          height: props.multiline ? 128 : 'auto',
          maxWidth: props.maxWidth,
          borderWidth: 2,
          borderColor: '#EAEAEA',
        }, !focus ? null : { borderColor: Palette.primary}]}
      >{props.children}</TextInput>
    </View>
  )
}