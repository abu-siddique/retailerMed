import { StyleSheet, View } from 'react-native';
import BigLoading from './big_loading';

export default function PageLoading() {
  return (
    <View style={styles.container}>
      <BigLoading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // equivalent to 'fixed'
    height: '100%', // h-full
    width: '100%', // w-full
    top: 0, // inset-0
    left: 0, // inset-0
    right: 0, // inset-0
    bottom: 0, // inset-0
    zIndex: 40, // z-40
    alignItems: 'center', // items-center
    justifyContent: 'center', // justify-center
    backgroundColor: 'rgba(0,0,0,0.5)', // optional: add overlay background
  },
});