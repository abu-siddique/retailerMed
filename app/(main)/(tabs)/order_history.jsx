import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OrderHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});