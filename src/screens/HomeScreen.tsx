import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CompositeNavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import ChamadoCard from '../components/ChamadoCard';

import { listarChamados } from '../api/api';
import { Chamado, TipoChamado } from '../types';
import { AppStackParamList } from '../navigation/AppStack';
import { TabParamList } from '../navigation/Tabs';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

type FilterType = 'todos' | TipoChamado;

const filterOptions: FilterType[] = ['todos', 'perdido', 'ferido'];
const filterLabels: Record<FilterType, string> = {
  todos: 'Todos',
  perdido: 'Perdidos',
  ferido: 'Feridos',
};

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const [items, setItems] = useState<Chamado[]>([]);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const chamados = await listarChamados();
      setItems(chamados);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar os chamados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => item.status_chamado === 'aberto')
        .filter((item) => filter === 'todos' || item.tipo === filter)
        .filter((item) =>
          `${item.especie} ${item.observacoes}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
    [filter, items, search]
  );

  function abrirMapa(item: Chamado) {
    navigation.navigate('Map', {
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.especie,
      description: item.observacoes,
    });
  }

  function irParaNovoReporte() {
    navigation.navigate('Report');
  }

  return (
    <View style={styles.screen}>
      <Header
        title="Animais na Região"
        subtitle="Reportes ativos próximos de você"
      />

      <View style={styles.searchArea}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#7B5143" />

          <TextInput
            placeholder="Buscar animais..."
            placeholderTextColor="#8C6F64"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.filters}>
        {filterOptions.map((item) => {
          const isActive = filter === item;

          return (
            <Pressable
              key={item}
              style={[styles.filter, isActive && styles.filterActive]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {filterLabels[item]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={carregar} />
        }
      >
        {loading && !items.length ? (
          <ActivityIndicator color="#7B5143" style={styles.loader} />
        ) : filteredItems.length ? (
          filteredItems.map((item) => (
            <ChamadoCard
              key={item.id_chamado}
              item={item}
              onMap={() => abrirMapa(item)}
            />
          ))
        ) : (
          <EmptyState text="Nenhum animal ativo foi encontrado. Faça o primeiro reporte." />
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={irParaNovoReporte}>
        <Ionicons name="add" size={34} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6EFE8',
  },

  searchArea: {
    backgroundColor: '#F6EFE8',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },

  searchBox: {
    backgroundColor: '#E7D8D1',
    borderRadius: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: '#1E1715',
    fontSize: 15,
  },

  filters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDCEC6',
  },

  filter: {
    backgroundColor: '#FFFDFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9,
  },

  filterActive: {
    backgroundColor: '#7B5143',
  },

  filterText: {
    color: '#7B5143',
    fontWeight: '800',
  },

  filterTextActive: {
    color: '#fff',
  },

  list: {
    flex: 1,
  },

  listContent: {
    padding: 14,
    paddingBottom: 100,
  },

  loader: {
    marginTop: 30,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 86,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2F8F43',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});