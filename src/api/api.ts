import { API_BASE_URL } from './config';
import { Chamado, Parceiro, Usuario } from '../types';

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text || 'Resposta inválida do servidor');
  }
}

function ok(data: any) {
  return data?.status === 'sucesso' || data?.success === true || data?.ok === true;
}

export async function login(email: string, senha: string): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/login_usuario.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const data = await parseResponse(response);
  if (!response.ok || (!ok(data) && !data.usuario)) throw new Error(data?.msg || data?.message || 'Não foi possível fazer login');
  return data.usuario || data.data || data;
}

export async function cadastrarUsuario(payload: Omit<Usuario, 'id_usuario'> & { senha: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/salvar_usuario.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse(response);
  if (!response.ok || !ok(data)) throw new Error(data?.msg || data?.message || 'Não foi possível cadastrar');
}

export async function listarChamados(): Promise<Chamado[]> {
  const response = await fetch(`${API_BASE_URL}/listar_chamados.php`);
  const data = await parseResponse(response);
  const lista = Array.isArray(data) ? data : data.chamados || data.data || [];
  return lista.map((item: any) => ({
    ...item,
    id_chamado: Number(item.id_chamado),
    id_usuario: Number(item.id_usuario),
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    distancia_km: item.distancia_km ? Number(item.distancia_km) : undefined,
  }));
}

export async function salvarChamado(payload: {
  id_usuario: number;
  tipo: 'perdido' | 'ferido';
  especie: 'cachorro' | 'gato' | 'outro';
  observacoes: string;
  latitude: number;
  longitude: number;
  imagemUri?: string | null;
}): Promise<void> {
  const formData = new FormData();
  formData.append('id_usuario', String(payload.id_usuario));
  formData.append('tipo', payload.tipo);
  formData.append('especie', payload.especie);
  formData.append('observacoes', payload.observacoes);
  formData.append('latitude', String(payload.latitude));
  formData.append('longitude', String(payload.longitude));

  if (payload.imagemUri) {
    const filename = payload.imagemUri.split('/').pop() || `foto_${Date.now()}.jpg`;
    formData.append('imagem', {
      uri: payload.imagemUri,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  const response = await fetch(`${API_BASE_URL}/salvar_chamado.php`, {
    method: 'POST',
    body: formData,
  });
  const data = await parseResponse(response);
  if (!response.ok || !ok(data)) throw new Error(data?.msg || data?.message || 'Não foi possível salvar o reporte');
}

export async function marcarResolvido(id_chamado: number, id_usuario: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/atualizar_status_chamado.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_chamado, id_usuario, status_chamado: 'resolvido' }),
  });
  const data = await parseResponse(response);
  if (!response.ok || !ok(data)) throw new Error(data?.msg || data?.message || 'Não foi possível atualizar');
}

export async function listarParceiros(): Promise<Parceiro[]> {
  const response = await fetch(`${API_BASE_URL}/listar_parceiros.php`);
  const data = await parseResponse(response);
  const lista = Array.isArray(data) ? data : data.parceiros || data.data || [];
  return lista.map((item: any) => ({
    ...item,
    id_parceiro: Number(item.id_parceiro),
    latitude: item.latitude ? Number(item.latitude) : undefined,
    longitude: item.longitude ? Number(item.longitude) : undefined,
  }));
}
