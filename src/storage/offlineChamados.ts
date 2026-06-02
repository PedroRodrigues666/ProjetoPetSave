import AsyncStorage from '@react-native-async-storage/async-storage';
import { Especie, TipoChamado } from '../types';

const OFFLINE_CHAMADOS_KEY = '@petsave:offline_chamados';

export type OfflineChamado = {
  id_local: string;
  id_usuario: number;
  tipo: TipoChamado;
  especie: Especie;
  observacoes: string;
  latitude: number;
  longitude: number;
  imagemUri: string | null;
  criado_em: string;
};

export async function salvarChamadoOffline(chamado: Omit<OfflineChamado, 'id_local' | 'criado_em'>) {
  const chamados = await listarChamadosOffline();

  const novoChamado: OfflineChamado = {
    ...chamado,
    id_local: String(Date.now()),
    criado_em: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    OFFLINE_CHAMADOS_KEY,
    JSON.stringify([...chamados, novoChamado])
  );

  return novoChamado;
}

export async function listarChamadosOffline(): Promise<OfflineChamado[]> {
  const data = await AsyncStorage.getItem(OFFLINE_CHAMADOS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function removerChamadoOffline(id_local: string) {
  const chamados = await listarChamadosOffline();

  const atualizados = chamados.filter(
    (chamado) => chamado.id_local !== id_local
  );

  await AsyncStorage.setItem(
    OFFLINE_CHAMADOS_KEY,
    JSON.stringify(atualizados)
  );
}

export async function limparChamadosOffline() {
  await AsyncStorage.removeItem(OFFLINE_CHAMADOS_KEY);
}