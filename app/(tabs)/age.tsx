import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface AgeResponse {
  name: string;
  age: number | null;
  count: number;
}

interface AgeCategory {
  category: string;
  message: string;
  emoji: string;
  imageUrl: string;
  color: string;
}

export default function AgeScreen() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<AgeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAgeCategory = (age: number): AgeCategory => {
    if (age <= 17) {
      return {
        category: 'Joven',
        message: '¡Tienes toda la vida por delante!',
        emoji: '👶',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
        color: '#4CAF50'
      };
    } else if (age <= 59) {
      return {
        category: 'Adulto',
        message: '¡En la mejor etapa de la vida!',
        emoji: '👨‍💼',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        color: '#2196F3'
      };
    } else {
      return {
        category: 'Anciano',
        message: '¡Sabiduría y experiencia!',
        emoji: '👴',
        imageUrl: 'https://images.unsplash.com/photo-1569779213435-ba3167ddf8d1?w=200&h=200&fit=crop',
        color: '#FF9800'
      };
    }
  };

  const predictAge = async () => {
    if (!name.trim()) {
      setError('Por favor ingresa un nombre');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`https://api.agify.io/?name=${name.trim()}`);
      const data: AgeResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error al conectar con el servicio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const ageCategory = result?.age ? getAgeCategory(result.age) : null;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          📅 Predictor de Edad
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Ingresa un nombre para predecir su edad aproximada
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa un nombre..."
          value={name}
          onChangeText={setName}
          onSubmitEditing={predictAge}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={predictAge}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>Predecir Edad</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        </ThemedView>
      )}

      {result && result.age && ageCategory && (
        <ThemedView style={[styles.resultContainer, { borderLeftColor: ageCategory.color }]}>
          <ThemedView style={styles.resultHeader}>
            <Image
              source={{ uri: ageCategory.imageUrl }}
              style={styles.categoryImage}
              contentFit="cover"
            />
            <ThemedView style={styles.resultInfo}>
              <ThemedText style={styles.ageEmoji}>{ageCategory.emoji}</ThemedText>
              <ThemedText type="title" style={[styles.categoryText, { color: ageCategory.color }]}>
                {ageCategory.category}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.ageContainer}>
            <ThemedText type="title" style={styles.ageNumber}>
              {result.age} años
            </ThemedText>
            <ThemedText style={styles.nameText}>
              Nombre: <ThemedText type="defaultSemiBold">{result.name}</ThemedText>
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.messageContainer, { backgroundColor: ageCategory.color + '20' }]}>
            <ThemedText style={[styles.messageText, { color: ageCategory.color }]}>
              {ageCategory.message}
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.countText}>
            Basado en {result.count} registros
          </ThemedText>
        </ThemedView>
      )}

      {result && !result.age && (
        <ThemedView style={styles.noResultContainer}>
          <ThemedText style={styles.noResultEmoji}>🤷‍♂️</ThemedText>
          <ThemedText type="subtitle">No se pudo determinar la edad</ThemedText>
          <ThemedText style={styles.noResultText}>
            El nombre "{result.name}" no tiene suficientes datos para hacer una predicción.
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoTitle}>ℹ️ Categorías de Edad</ThemedText>
        <ThemedText style={styles.infoText}>
          • <ThemedText style={{ color: '#4CAF50' }}>Joven</ThemedText>: 0-17 años{'\n'}
          • <ThemedText style={{ color: '#2196F3' }}>Adulto</ThemedText>: 18-59 años{'\n'}
          • <ThemedText style={{ color: '#FF9800' }}>Anciano</ThemedText>: 60+ años
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#EF4444',
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
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 25,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
    alignItems: 'center',
  },
  ageEmoji: {
    fontSize: 40,
    lineHeight: 48,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ageNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  noResultContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
  },
  noResultEmoji: {
    fontSize: 60,
    lineHeight: 70,
    marginBottom: 15,
    marginTop: 10,
    textAlign: 'center',
    includeFontPadding: false,
  },
  noResultText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
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