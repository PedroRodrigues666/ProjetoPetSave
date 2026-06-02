import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
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
import ChamadoCard from '../components/ChamadoCard';
import EmptyState from '../components/EmptyState';

import { listarChamados, marcarResolvido } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Chamado } from '../types';
import { AppStackParamList } from '../navigation/AppStack';
import {
  listarChamadosOffline,
  OfflineChamado,
} from '../storage/offlineChamados';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [items, setItems] = useState<Chamado[]>([]);
  const [offlineItems, setOfflineItems] = useState<OfflineChamado[]>([]);
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const chamados = await listarChamados();
      const meusChamados = chamados.filter(
        (item) => item.id_usuario === user.id_usuario
      );

      const chamadosOffline = await listarChamadosOffline();
      const meusChamadosOffline = chamadosOffline.filter(
        (item) => item.id_usuario === user.id_usuario
      );

      setItems(meusChamados);
      setOfflineItems(meusChamadosOffline);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível carregar seus reportes.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function resolver(id: number) {
    if (!user) return;

    try {
      await marcarResolvido(id, user.id_usuario);
      await carregar();
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível marcar como resolvido.'
      );
    }
  }

  function abrirMapa(item: Chamado) {
    navigation.navigate('Map', {
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.especie,
      description: item.observacoes,
    });
  }

  const resolvidos = useMemo(
    () => items.filter((item) => item.status_chamado === 'resolvido').length,
    [items]
  );

  const ativos = useMemo(
    () => items.filter((item) => item.status_chamado === 'aberto').length,
    [items]
  );

  return (
    <View style={styles.screen}>
      <Header
        title={user?.nome || 'Perfil'}
        subtitle={`${user?.email || ''}\n${
          user?.endereco || 'Endereço não informado'
        }`}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={carregar} />
        }
      >
        <Text style={styles.section}>Estatísticas</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{items.length}</Text>
            <Text style={styles.statLabel}>Reportes</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{resolvidos}</Text>
            <Text style={styles.statLabel}>Resolvidos</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{ativos}</Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
        </View>

        {offlineItems.length > 0 && (
          <View style={styles.offlineBox}>
            <Ionicons name="cloud-offline-outline" size={22} color="#B77900" />

            <View style={styles.offlineContent}>
              <Text style={styles.offlineTitle}>
                {offlineItems.length} reporte(s) pendente(s)
              </Text>

              <Text style={styles.offlineText}>
                Esses reportes foram salvos offline e serão enviados ao banco
                quando a conexão voltar.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.section}>Meus Reportes</Text>

        {items.length ? (
          items.map((item) => (
            <ChamadoCard
              key={item.id_chamado}
              item={item}
              canResolve
              onResolve={() => resolver(item.id_chamado)}
              onMap={() => abrirMapa(item)}
            />
          ))
        ) : (
          <EmptyState text="Você ainda não fez nenhum reporte salvo no banco." />
        )}

        <Text style={styles.section}>Dados de contato</Text>

        <View style={styles.option}>
          <Ionicons name="call-outline" color="#7B5143" size={19} />

          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Telefone usado nos reportes</Text>

            <Text style={styles.optionText}>
              {user?.telefone || 'Telefone não informado'}
            </Text>
          </View>
        </View>

        <Text style={styles.helperText}>
          Esse telefone aparece nos seus reportes para que outras pessoas possam
          entrar em contato caso encontrem ou ajudem o animal.
        </Text>

        <Pressable style={styles.logout} onPress={signOut}>
          <Ionicons name="exit-outline" color="#fff" size={20} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
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
    paddingBottom: 100,
  },

  section: {
    fontSize: 18,
    color: '#1E1715',
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  stat: {
    flex: 1,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    color: '#7B5143',
    fontWeight: '900',
  },

  statLabel: {
    color: '#7B5143',
    fontSize: 12,
    marginTop: 4,
  },

  offlineBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#E6C86E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  offlineContent: {
    flex: 1,
  },

  offlineTitle: {
    color: '#7A4F00',
    fontWeight: '900',
    marginBottom: 4,
  },

  offlineText: {
    color: '#7A4F00',
    fontSize: 13,
    lineHeight: 18,
  },

  option: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },

  optionContent: {
    flex: 1,
  },

  optionLabel: {
    color: '#8C6F64',
    fontSize: 12,
    marginBottom: 3,
  },

  optionText: {
    color: '#1E1715',
    fontWeight: '800',
    fontSize: 15,
  },

  helperText: {
    color: '#8C6F64',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },

  logout: {
    backgroundColor: '#7B5143',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  logoutText: {
    color: '#fff',
    fontWeight: '900',
  },
});