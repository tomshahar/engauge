export { default as useLoading } from './useLoading'
export { default as useData } from './useData'
export { default as useUserApi } from './useUserApi'
export { default as useAuthApi } from './useAuthApi'
export { default as useGroupApi } from './useGroupApi'
export { default as useEventApi } from './useEventApi'


// async function sampleApiCall(data) {
//   try {
//     setLoading(true)
//     const { error } = await supabase.from('table').select()
//     if (error) throw error
//   } catch (error) {
//     if (error instanceof Error) Alert.alert(error.message)
//   } finally {
//     setLoading(false)
//   }
// }

