import { Pressable, Text } from 'react-native';
import { Palette } from '../../constants/palette';
export function Button(props) {
  return (
    <Pressable
      {...props}
      style = {({pressed}) => [{
        backgroundColor: props.color ? props.color : '#EAEAEA',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
      }, pressed ? {backgroundColor: Palette.primary, color: 'white'} : null]}
    >
      {({pressed}) => (<Text 
        style = {props.textStyle ? props.textStyle : {fontSize: 16, color: !pressed ? 'black' : 'white'}}
        
      >{props.children}</Text>)}
    </Pressable>
  )
}