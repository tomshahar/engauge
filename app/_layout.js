import { Stack } from 'expo-router/stack';
import { LoadingProvider } from '../src/hooks/useLoading';
import { DataProvider } from '../src/hooks/useData'

export default function Layout() {
  return (
    <DataProvider>
      <LoadingProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="index" options={{}} />
          <Stack.Screen name="Group" options={{}} />
          <Stack.Screen name = "(tabs)" />
        </Stack>
      </LoadingProvider>
    </DataProvider>

  )
}