import { Pressable, Text } from 'react-native';
import { Palette } from '../../constants/palette';
export function Button(props) {
  return (
    <Pressable
      {...props}
      style = {{
        backgroundColor: props.color ? props.color : '#EAEAEA',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
      }}
    >
      <Text 
        style = {props.textStyle ? props.textStyle : {fontSize: 16, color: 'black'}}
        
      >{props.children}</Text>
    </Pressable>
  )
}