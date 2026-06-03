import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { sincronizarChamadosOffline } from './src/storage/syncChamados';

function Routes() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    sincronizarChamadosOffline();

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        sincronizarChamadosOffline();
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#7B5143" />
      <Routes />
    </AuthProvider>
  );
}