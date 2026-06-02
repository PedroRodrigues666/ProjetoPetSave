import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  text: string;
};

export default function EmptyState({ text }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="paw-outline" size={38} color="#A98A7E" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 34,
    gap: 10,
  },

  text: {
    color: '#7B5143',
    textAlign: 'center',
    lineHeight: 20,
  },
});
