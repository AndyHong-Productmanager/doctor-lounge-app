import { View, Text, StyleSheet } from 'react-native';
export default function SpacesScreen() {
  return <View style={s.c}><Text style={s.t}>스페이스</Text></View>;
}
const s = StyleSheet.create({ c: { flex: 1, justifyContent: 'center', alignItems: 'center' }, t: { fontSize: 18, color: '#666' } });
