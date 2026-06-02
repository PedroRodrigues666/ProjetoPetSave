import NetInfo from '@react-native-community/netinfo';

import { salvarChamado } from '../api/api';
import {
  listarChamadosOffline,
  removerChamadoOffline,
} from './offlineChamados';

export async function sincronizarChamadosOffline() {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    return;
  }

  const chamadosOffline = await listarChamadosOffline();

  if (!chamadosOffline.length) {
    return;
  }

  for (const chamado of chamadosOffline) {
    try {
      await salvarChamado({
        id_usuario: chamado.id_usuario,
        tipo: chamado.tipo,
        especie: chamado.especie,
        observacoes: chamado.observacoes,
        latitude: chamado.latitude,
        longitude: chamado.longitude,
        imagemUri: chamado.imagemUri,
      });

      await removerChamadoOffline(chamado.id_local);
    } catch (error) {
      console.log('Erro ao sincronizar chamado offline:', error);
    }
  }
}