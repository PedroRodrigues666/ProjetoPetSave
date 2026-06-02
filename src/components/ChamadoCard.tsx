import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { API_BASE_URL } from '../api/config';
import { Chamado } from '../types';

type Props = {
  item: Chamado;
  onMap?: () => void;
  onResolve?: () => void;
  canResolve?: boolean;
};

function formatDate(value: string) {
  const date = new Date(value.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function capitalize(value?: string) {
  if (!value) {
    return 'Animal';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ChamadoCard({
  item,
  onMap,
  onResolve,
  canResolve = false,
}: Props) {
  const photoUri = item.imagem ? `${API_BASE_URL}/${item.imagem}` : undefined;
  const isFerido = item.tipo === 'ferido';
  const isAberto = item.status_chamado === 'aberto';

  return (
    <View style={styles.card}>
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
        />
      )}

      <View style={styles.rowBetween}>
        <View
          style={[
            styles.badge,
            isFerido ? styles.badgeRed : styles.badgeYellow,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isFerido ? styles.redText : styles.yellowText,
            ]}
          >
            {isFerido ? 'Ferido' : 'Perdido'}
          </Text>
        </View>

        <Text style={styles.status}>{item.status_chamado}</Text>
      </View>

      <Text style={styles.title}>{capitalize(item.especie)}</Text>

      <Text style={styles.desc}>
        {item.observacoes || 'Sem observações.'}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={15} color="#8C6F64" />
        <Text style={styles.info}>
          {item.telefone_usuario || 'Contato não informado'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={15} color="#8C6F64" />
        <Text style={styles.info}>
          {item.latitude?.toFixed(5)}, {item.longitude?.toFixed(5)}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.small}>{formatDate(item.data_chamado)}</Text>

        {onMap && (
          <Pressable onPress={onMap}>
            <Text style={styles.link}>Ver no mapa</Text>
          </Pressable>
        )}
      </View>

      {canResolve && isAberto && (
        <Pressable style={styles.resolveButton} onPress={onResolve}>
          <Text style={styles.resolveText}>Marcar como resolvido</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4D5CE',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  photo: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#EEE',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeRed: {
    backgroundColor: '#FFE8EA',
  },

  badgeYellow: {
    backgroundColor: '#FFF3CD',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  redText: {
    color: '#D8242F',
  },

  yellowText: {
    color: '#B77900',
  },

  status: {
    color: '#8C6F64',
    fontSize: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    color: '#1E1715',
  },

  desc: {
    color: '#7B5143',
    marginTop: 7,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 9,
  },

  info: {
    color: '#7B5143',
    flex: 1,
  },

  small: {
    color: '#8C6F64',
    marginTop: 10,
    fontSize: 12,
  },

  link: {
    color: '#2F8F43',
    fontWeight: '800',
    marginTop: 10,
  },

  resolveButton: {
    marginTop: 13,
    backgroundColor: '#2F8F43',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
  },

  resolveText: {
    color: '#fff',
    fontWeight: '800',
  },
});