import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function SearchScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.text }}>Search</Text>
    </View>
  );
}