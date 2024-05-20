import { TextInput } from 'react-native';
export function Input(props) {
  return (
    <TextInput
      {...props}
      
      style = {{
        fontSize: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#EAEAEA',
        borderRadius: 4,
        height: props.multiline ? 128 : 'auto',
        maxWidth: props.maxWidth
      }}
    >{props.children}</TextInput>
  )
}