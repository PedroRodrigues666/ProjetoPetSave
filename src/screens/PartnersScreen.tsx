import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

import { listarParceiros } from '../api/api';
import { Parceiro } from '../types';
import { AppStackParamList } from '../navigation/AppStack';

export default function PartnersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [items, setItems] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await listarParceiros());
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar parceiros.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function abrirMapa(item: Parceiro) {
    navigation.navigate('Map', {
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.nome,
      description: item.endereco,
    });
  }

  return (
    <View style={styles.screen}>
      <Header
        title="ONGs e Empresas"
        subtitle="Organizações registradas que podem ajudar"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
      >
        {loading && !items.length ? (
          <ActivityIndicator color="#7B5143" />
        ) : items.length ? (
          items.map((item) => (
            <View key={item.id_parceiro} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.nome}</Text>
                <Text style={styles.verified}>Verificado</Text>
              </View>

              <Text style={styles.type}>{item.tipo}</Text>
              <Text style={styles.desc}>
                {item.descricao || 'Parceiro cadastrado no banco de dados.'}
              </Text>

              {!!item.telefone && (
                <Pressable
                  style={styles.infoRow}
                  onPress={() => Linking.openURL(`tel:${item.telefone}`)}
                >
                  <Ionicons name="call-outline" size={15} color="#8C6F64" />
                  <Text style={styles.green}>{item.telefone}</Text>
                </Pressable>
              )}

              {!!item.email && (
                <Pressable
                  style={styles.infoRow}
                  onPress={() => Linking.openURL(`mailto:${item.email}`)}
                >
                  <Ionicons name="mail-outline" size={15} color="#8C6F64" />
                  <Text style={styles.green}>{item.email}</Text>
                </Pressable>
              )}

              {!!item.endereco && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={15} color="#8C6F64" />
                  <Text style={styles.info}>{item.endereco}</Text>
                </View>
              )}

              {item.latitude && item.longitude && (
                <Pressable
                  style={styles.button}
                  onPress={() => abrirMapa(item)}
                >
                  <Ionicons name="open-outline" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Ver no Mapa</Text>
                </Pressable>
              )}
            </View>
          ))
        ) : (
          <EmptyState text="Nenhum parceiro cadastrado ainda. Insira ONGs, clínicas ou protetores no banco." />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6EFE8',
  },

  content: {
    padding: 14,
    paddingBottom: 90,
  },

  card: {
    backgroundColor: '#FFFDFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D9C7BE',
    shadowColor: '#000',
    shadowOpacity: 0.11,
    shadowRadius: 6,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1715',
    flex: 1,
  },

  verified: {
    color: '#2F8F43',
    backgroundColor: '#E7F6E9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '800',
  },

  type: {
    color: '#8C6F64',
    marginTop: 6,
    textTransform: 'capitalize',
  },

  desc: {
    color: '#7B5143',
    marginTop: 14,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    alignItems: 'center',
  },

  green: {
    color: '#2F8F43',
  },

  info: {
    color: '#7B5143',
    flex: 1,
  },

  button: {
    marginTop: 16,
    backgroundColor: '#7B5143',
    borderRadius: 9,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '900',
  },
});
