import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';

type FormState = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  tipo_usuario: 'pessoal' | 'empresa';
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const initialFormState: FormState = {
  nome: '',
  email: '',
  senha: '',
  telefone: '',
  endereco: '',
  tipo_usuario: 'pessoal',
};

const registerTypes: FormState['tipo_usuario'][] = ['pessoal', 'empresa'];

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function cadastrar() {
    if (!form.nome || !form.email || !form.senha || !form.telefone) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await signUp(form);
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.subtitle}>
          Seus dados serão usados para contato nos reportes.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={form.nome}
          onChangeText={(value) => setField('nome', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => setField('email', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={form.senha}
          onChangeText={(value) => setField('senha', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={form.telefone}
          onChangeText={(value) => setField('telefone', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Cidade / endereço"
          value={form.endereco}
          onChangeText={(value) => setField('endereco', value)}
        />

        <View style={styles.row}>
          {registerTypes.map((tipo) => (
            <Pressable
              key={tipo}
              style={[styles.chip, form.tipo_usuario === tipo && styles.chipActive]}
              onPress={() => setField('tipo_usuario', tipo)}
            >
              <Text
                style={[styles.chipText, form.tipo_usuario === tipo && styles.chipTextActive]}
              >
                {tipo}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={cadastrar} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já tenho conta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6EFE8',
  },

  content: {
    padding: 22,
    paddingTop: 70,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#7B5143',
  },

  subtitle: {
    color: '#7B5143',
    marginTop: 8,
    marginBottom: 16,
  },

  input: {
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#D9C7BE',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
  },

  chip: {
    flex: 1,
    backgroundColor: '#FFFDFC',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9C7BE',
  },

  chipActive: {
    backgroundColor: '#7B5143',
  },

  chipText: {
    color: '#7B5143',
    fontWeight: '800',
    textTransform: 'capitalize',
  },

  chipTextActive: {
    color: '#fff',
  },

  button: {
    backgroundColor: '#7B5143',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  link: {
    color: '#7B5143',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '800',
  },
});
