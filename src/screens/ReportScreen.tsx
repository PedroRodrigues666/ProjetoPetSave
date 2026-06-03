import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import MapView, { Marker, Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { salvarChamado } from '../api/api';
import { AppStackParamList } from '../navigation/AppStack';
import { useAuth } from '../context/AuthContext';
import { salvarChamadoOffline } from '../storage/offlineChamados';
import { Especie, TipoChamado } from '../types';
import {
  notificarChamadoCriado,
  notificarEmergencia,
} from '../services/notifications';

type Props = NativeStackScreenProps<AppStackParamList, 'Report'>;

const defaultRegionDelta = {
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

const fallbackRegion: Region = {
  latitude: -23.55052,
  longitude: -46.633308,
  ...defaultRegionDelta,
};

const tipoOptions: TipoChamado[] = ['perdido', 'ferido'];
const especieOptions: Especie[] = ['cachorro', 'gato', 'outro'];

const tipoLabels: Record<TipoChamado, string> = {
  perdido: 'Perdido',
  ferido: 'Ferido',
};

const especieLabels: Record<Especie, string> = {
  cachorro: 'Cachorro',
  gato: 'Gato',
  outro: 'Outro',
};

type OptionChipProps<T extends string> = {
  value: T;
  activeValue: T;
  label: string;
  onPress: (value: T) => void;
};

function OptionChip<T extends string>({
  value,
  activeValue,
  label,
  onPress,
}: OptionChipProps<T>) {
  const isActive = value === activeValue;

  return (
    <Pressable
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function buildRegion(latitude: number, longitude: number): Region {
  return {
    latitude,
    longitude,
    ...defaultRegionDelta,
  };
}

export default function ReportScreen({ navigation }: Props) {
  const { user } = useAuth();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const [tipo, setTipo] = useState<TipoChamado>('perdido');
  const [especie, setEspecie] = useState<Especie>('cachorro');
  const [observacoes, setObservacoes] = useState('');

  const [region, setRegion] = useState<Region>(fallbackRegion);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarLocalizacao();
  }, []);

  async function carregarLocalizacao() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Localização',
          'Permita a localização para marcar onde o animal foi visto.'
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({});

      setRegion(buildRegion(current.coords.latitude, current.coords.longitude));
    } catch {
      Alert.alert(
        'Localização',
        'Não foi possível obter sua localização. O mapa usará uma localização padrão.'
      );
    }
  }

  async function abrirCamera() {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert('Câmera', 'Permita a câmera para fotografar o animal.');
        return;
      }
    }

    setShowCamera(true);
  }

  async function tirarFoto() {
    try {
      const result = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
      });

      if (result?.uri) {
        setPhoto(result.uri);
        setShowCamera(false);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  }

  function atualizarMarcador(latitude: number, longitude: number) {
    setRegion((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  }

  async function exibirNotificacaoDoReporte() {
    if (tipo === 'ferido') {
      await notificarEmergencia();
    } else {
      await notificarChamadoCriado();
    }
  }

  async function enviar() {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      return;
    }

    if (!observacoes.trim()) {
      Alert.alert('Atenção', 'Descreva o animal e a situação.');
      return;
    }

    const chamadoData = {
      id_usuario: user.id_usuario,
      tipo,
      especie,
      observacoes: observacoes.trim(),
      latitude: region.latitude,
      longitude: region.longitude,
      imagemUri: photo,
    };

    try {
      setSaving(true);

      const netState = await NetInfo.fetch();

      if (netState.isConnected) {
        await salvarChamado(chamadoData);
        await exibirNotificacaoDoReporte();

        Alert.alert('Sucesso', 'Reporte foi aberto.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);

        return;
      }

      await salvarChamadoOffline(chamadoData);
      await exibirNotificacaoDoReporte();

      Alert.alert(
        'Salvo offline',
        'Você está sem internet. O reporte foi salvo no aparelho e será enviado ao banco quando a conexão voltar.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível salvar o reporte.');
    } finally {
      setSaving(false);
    }
  }

  if (showCamera) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView ref={cameraRef} style={styles.camera} />

        <View style={styles.cameraActions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>

          <Pressable style={styles.captureButton} onPress={tirarFoto}>
            <Ionicons name="camera" size={30} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Tipo do reporte</Text>

      <View style={styles.row}>
        {tipoOptions.map((value) => (
          <OptionChip
            key={value}
            value={value}
            activeValue={tipo}
            label={tipoLabels[value]}
            onPress={setTipo}
          />
        ))}
      </View>

      <Text style={styles.label}>Espécie</Text>

      <View style={styles.row}>
        {especieOptions.map((value) => (
          <OptionChip
            key={value}
            value={value}
            activeValue={especie}
            label={especieLabels[value]}
            onPress={setEspecie}
          />
        ))}
      </View>

      <Text style={styles.label}>Foto feita pela câmera</Text>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="image-outline" size={38} color="#A98A7E" />
          <Text style={styles.placeholderText}>Nenhuma foto ainda</Text>
        </View>
      )}

      <Pressable style={styles.secondaryButton} onPress={abrirCamera}>
        <Ionicons name="camera-outline" size={18} color="#7B5143" />
        <Text style={styles.secondaryText}>
          {photo ? 'Tirar outra foto' : 'Abrir câmera'}
        </Text>
      </Pressable>

      <Text style={styles.label}>Descrição</Text>

      <TextInput
        style={styles.textarea}
        multiline
        placeholder="Ex: Labrador dourado perdido, usando coleira azul..."
        placeholderTextColor="#A98A7E"
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <Text style={styles.label}>Local onde foi visto</Text>

      <Text style={styles.hint}>
        Arraste o marcador para ajustar o ponto antes de salvar.
      </Text>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          draggable
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          onDragEnd={(event) =>
            atualizarMarcador(
              event.nativeEvent.coordinate.latitude,
              event.nativeEvent.coordinate.longitude
            )
          }
        />
      </MapView>

      <Pressable style={styles.button} onPress={enviar} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar reporte</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6EFE8',
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  label: {
    color: '#1E1715',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 8,
  },

  hint: {
    color: '#8C6F64',
    marginBottom: 8,
  },

  placeholderText: {
    color: '#8C6F64',
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 9,
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  chipActive: {
    backgroundColor: '#7B5143',
  },

  chipText: {
    color: '#7B5143',
    fontWeight: '800',
  },

  chipTextActive: {
    color: '#fff',
  },

  photo: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },

  photoPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#FFFDFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9C7BE',
  },

  secondaryButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    borderRadius: 10,
    padding: 13,
  },

  secondaryText: {
    color: '#7B5143',
    fontWeight: '900',
  },

  textarea: {
    minHeight: 110,
    textAlignVertical: 'top',
    backgroundColor: '#FFFDFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D9C7BE',
    color: '#1E1715',
  },

  map: {
    width: '100%',
    height: 230,
    borderRadius: 12,
  },

  button: {
    backgroundColor: '#2F8F43',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  cameraActions: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },

  cancelButton: {
    padding: 14,
    backgroundColor: '#FFFDFC',
    borderRadius: 12,
  },

  cancelText: {
    color: '#7B5143',
    fontWeight: '900',
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7B5143',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
