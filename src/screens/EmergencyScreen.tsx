import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../components/Header';
import ChamadoCard from '../components/ChamadoCard';
import EmptyState from '../components/EmptyState';

import { listarChamados } from '../api/api';
import { Chamado } from '../types';
import { AppStackParamList } from '../navigation/AppStack';

export default function EmergencyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [items, setItems] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const chamados = await listarChamados();
      setItems(chamados.filter((item) => item.tipo === 'ferido' && item.status_chamado === 'aberto'));
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar emergências.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function abrirMapa(item: Chamado) {
    navigation.navigate('Map', {
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.especie,
      description: item.observacoes,
    });
  }

  return (
    <View style={styles.screen}>
      <Header
        danger
        title="Emergências"
        subtitle="Casos urgentes que precisam de atenção imediata"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
      >
        <Text style={styles.section}>Casos Urgentes</Text>

        {loading && !items.length ? (
          <ActivityIndicator color="#DC2F34" />
        ) : items.length ? (
          items.map((item) => (
            <ChamadoCard
              key={item.id_chamado}
              item={item}
              onMap={() => abrirMapa(item)}
            />
          ))
        ) : (
          <EmptyState text="Nenhuma emergência ativa no momento." />
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

  section: {
    color: '#DC2F34',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 4,
  },
});
