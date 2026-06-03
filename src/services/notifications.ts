import { Alert, Platform } from 'react-native';

export async function configurarNotificacoes() {
  console.log('Expo Notifications deixado como implementação futura.');
  return true;
}

export async function notificarChamadoCriado() {
  if (Platform.OS === 'web') {
    alert('O chamado do animal foi registrado com sucesso.');
    return;
  }

  Alert.alert(
    'Reporte enviado!',
    'O chamado do animal foi registrado com sucesso.'
  );
}

export async function notificarEmergencia() {
  if (Platform.OS === 'web') {
    alert('Um animal ferido foi reportado e precisa de ajuda.');
    return;
  }

  Alert.alert(
    'Alerta de emergência!',
    'Um animal ferido foi reportado e precisa de ajuda.'
  );
}

/*
  IMPLEMENTAÇÃO FUTURA COM EXPO NOTIFICATIONS

  Esta parte foi deixada como referência para uma futura versão do aplicativo,
  utilizando Development Build em vez do Expo Go.

  No Expo Go com SDK 53 ou superior, o uso direto do expo-notifications para
  notificações reais pode gerar erro no Android.


  import * as Notifications from 'expo-notifications';
  import { Platform } from 'react-native';

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  export async function configurarNotificacoesReais() {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reports', {
        name: 'Reportes',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7B5143',
      });
    }

    return true;
  }

  export async function notificarChamadoCriadoReal() {
    await configurarNotificacoesReais();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reporte enviado!',
        body: 'O chamado do animal foi registrado com sucesso.',
        sound: true,
      },
      trigger: {
        seconds: 2,
        channelId: 'reports',
      },
    });
  }

  export async function notificarEmergenciaReal() {
    await configurarNotificacoesReais();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alerta de emergência!',
        body: 'Um animal ferido foi reportado e precisa de ajuda.',
        sound: true,
      },
      trigger: {
        seconds: 2,
        channelId: 'reports',
      },
    });
  }
*/