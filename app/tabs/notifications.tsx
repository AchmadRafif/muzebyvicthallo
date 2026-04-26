import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

export default function NotificationsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Colors.text }}>Notifications</Text>
    </View>
  );
}