import React, { createContext, useContext, useMemo, useState } from 'react';
import { Usuario } from '../types';
import * as api from '../api/api';

interface AuthContextValue {
  user: Usuario | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (payload: Omit<Usuario, 'id_usuario'> & { senha: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<Usuario | null>(null);

  async function signIn(email: string, senha: string) {
    const usuario = await api.login(email.trim(), senha);
    setUser(usuario);
  }

  async function signUp(payload: Omit<Usuario, 'id_usuario'> & { senha: string }) {
    await api.cadastrarUsuario(payload);
    await signIn(payload.email, payload.senha);
  }

  function signOut() {
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, signIn, signUp, signOut }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
