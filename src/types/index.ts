export type TipoUsuario = 'pessoal' | 'empresa';
export type TipoChamado = 'perdido' | 'ferido';
export type Especie = 'cachorro' | 'gato' | 'outro';
export type StatusChamado = 'aberto' | 'resolvido';

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  telefone: string;
  tipo_usuario: TipoUsuario;
  endereco?: string | null;
}

export interface Chamado {
  id_chamado: number;
  latitude: number;
  longitude: number;
  imagem?: string | null;
  data_chamado: string;
  observacoes: string;
  tipo: TipoChamado;
  especie: Especie;
  status_chamado: StatusChamado;
  id_usuario: number;
  nome_usuario?: string;
  telefone_usuario?: string;
  email_usuario?: string;
  distancia_km?: number;
}

export interface Parceiro {
  id_parceiro: number;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  descricao?: string;
  tipo: 'ong' | 'clinica' | 'empresa' | 'protetor';
  latitude?: number;
  longitude?: number;
  status?: 'aberto' | 'fechado';
}
