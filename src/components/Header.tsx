import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  danger?: boolean;
};

export default function Header({ title, subtitle, danger = false }: Props) {
  return (
    <View style={[styles.header, danger && styles.danger]}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7B5143',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  danger: {
    backgroundColor: '#DC2F34',
  },

  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});
