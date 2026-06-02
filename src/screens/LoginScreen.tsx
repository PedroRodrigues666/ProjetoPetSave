import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, senha);
    } catch (error: any) {
      Alert.alert('Erro no login', error.message || 'Confira os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>PetSave</Text>
        <Text style={styles.subtitle}>
          Entre para reportar e encontrar animais na sua região.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Pressable
          style={styles.button}
          onPress={entrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Criar uma nova conta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6EFE8',
    justifyContent: 'center',
    padding: 22,
  },

  card: {
    backgroundColor: '#FFFDFC',
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2D2CA',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: '#7B5143',
    marginTop: 4,
  },

  subtitle: {
    color: '#7B5143',
    textAlign: 'center',
    marginVertical: 18,
    lineHeight: 20,
  },

  input: {
    backgroundColor: '#F4ECE7',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    color: '#231815',
  },

  button: {
    backgroundColor: '#7B5143',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  link: {
    color: '#7B5143',
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '800',
  },
});
