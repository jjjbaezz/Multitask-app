import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface GenderResponse {
  name: string;
  gender: 'male' | 'female' | null;
  probability: number;
  count: number;
}

export default function GenderScreen() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<GenderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictGender = async () => {
    if (!name.trim()) {
      setError('Por favor ingresa un nombre');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://api.genderize.io/?name=${name.trim()}`);
      const data: GenderResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error al conectar con el servicio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundColor = () => {
    if (!result?.gender) return '#f8f9fa';
    return result.gender === 'male' ? '#E3F2FD' : '#FCE4EC';
  };

  const getTextColor = () => {
    if (!result?.gender) return '#000';
    return result.gender === 'male' ? '#1976D2' : '#E91E63';
  };

  const getGenderEmoji = () => {
    if (!result?.gender) return '❓';
    return result.gender === 'male' ? '👨' : '👩';
  };

  const getGenderText = () => {
    if (!result?.gender) return 'No se pudo determinar';
    return result.gender === 'male' ? 'Masculino' : 'Femenino';
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          👤 Predictor de Género
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingresa un nombre para predecir su género
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa un nombre..."
          value={name}
          onChangeText={setName}
          onSubmitEditing={predictGender}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={predictGender}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>Predecir</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        </ThemedView>
      )}

      {result && (
        <ThemedView style={styles.resultContainer}>
          <ThemedText style={[styles.genderEmoji, { color: getTextColor() }]}>
            {getGenderEmoji()}
          </ThemedText>
          <ThemedText type="title" style={[styles.genderText, { color: getTextColor() }]}>
            {getGenderText()}
          </ThemedText>
          <ThemedText style={styles.nameText}>
            Nombre: <ThemedText type="defaultSemiBold">{result.name}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.probabilityText}>
            Probabilidad: <ThemedText type="defaultSemiBold">{Math.round(result.probability * 100)}%</ThemedText>
          </ThemedText>
          <ThemedText style={styles.countText}>
            Basado en {result.count} registros
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  genderEmoji: {
    fontSize: 80,
    lineHeight: 90,
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
    includeFontPadding: false,
  },
  genderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  nameText: {
    fontSize: 16,
    marginBottom: 8,
  },
  probabilityText: {
    fontSize: 16,
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginTop: 'auto',
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});