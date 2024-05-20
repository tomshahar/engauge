import { View, SafeAreaView } from 'react-native';
import AuthScreen from '../src/components/screens/AuthScreen'
import { Redirect } from 'expo-router';
import { useData } from '../src/hooks';


export default function Auth() {
  
  const { session } = useData()

  if (session && session.user) {
    return <Redirect href = '/(tabs)/browse' /> 
  }
  return (
    <SafeAreaView style = {{flex: 1}}>
      <AuthScreen></AuthScreen>
    </SafeAreaView>
  );
}
