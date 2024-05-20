import { Pressable, Text, View } from 'react-native';
import { Palette } from '../../constants/palette';
import Ionicons from '@expo/vector-icons/Ionicons';

export function IconButton(props) {
  return (
    <Pressable
      {...props}
      style = {{
        backgroundColor: props.color ? props.color : '#EAEAEA',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignItems: 'center',
        flexDirection: 'row',
        minWidth: props.size + 16
      }}
    >
      <View style = {{width: props.size, height: props.size}}>
        <Ionicons name={props.name} size={props.size} color= {props.iconColor ? props.iconColor : 'black'}/>
      </View>
      <Text 
        style = {props.textStyle ? props.textStyle : {fontSize: 16, color: 'black'}}
        
      >{props.children}</Text>
    </Pressable>
  )
}