import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function CreateScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.text }}>Create</Text>
    </View>
  );
}