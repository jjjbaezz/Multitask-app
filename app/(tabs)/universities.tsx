import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface University {
  name: string;
  country: string;
  web_pages: string[];
  domains: string[];
  'state-province': string | null;
  alpha_two_code: string;
}

export default function UniversitiesScreen() {
  const [country, setCountry] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUniversities = async () => {
    if (!country.trim()) {
      setError('Por favor ingresa el nombre de un país en inglés');
      return;
    }

    setLoading(true);
    setError(null);
    setUniversities([]);

    try {
      // Usar proxy HTTPS para evitar problemas de HTTP/CORS/ATS
      const response = await fetch(`https://adamix.net/proxy.php?country=${encodeURIComponent(country.trim())}`);
      const data: University[] = await response.json();
      
      if (data.length === 0) {
        setError('No se encontraron universidades para este país. Verifica que el nombre esté en inglés.');
      } else {
        setUniversities(data);
      }
    } catch (err) {
      setError('Error al conectar con el servicio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setError('No se puede abrir este enlace');
      }
    } catch (err) {
      setError('Error al abrir el enlace');
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const popularCountries = [
    'Dominican Republic', 'United States', 'United Kingdom', 'Canada', 
    'Germany', 'France', 'Spain', 'Italy', 'Japan', 'Australia'
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🏛️ Universidades
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Busca universidades por país (nombre en inglés)
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Dominican Republic, United States..."
          value={country}
          onChangeText={setCountry}
          onSubmitEditing={searchUniversities}
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={searchUniversities}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>Buscar</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.suggestionsContainer}>
        <ThemedText style={styles.suggestionsTitle}>Países populares:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularCountries.map((countryName) => (
            <TouchableOpacity
              key={countryName}
              style={styles.suggestionChip}
              onPress={() => setCountry(countryName)}
            >
              <ThemedText style={styles.suggestionText}>{countryName}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        </ThemedView>
      )}

      {universities.length > 0 && (
        <ThemedView style={styles.resultsContainer}>
          <ThemedText type="subtitle" style={styles.resultsTitle}>
            📚 {universities.length} universidades encontradas en {universities[0].country}
          </ThemedText>
          
          <ScrollView style={styles.universitiesList} showsVerticalScrollIndicator={false}>
            {universities.map((university, index) => (
              <ThemedView key={index} style={styles.universityCard}>
                <ThemedView style={styles.universityHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.universityName}>
                    {university.name}
                  </ThemedText>
                  {university['state-province'] && (
                    <ThemedText style={styles.universityLocation}>
                      📍 {university['state-province']}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView style={styles.universityInfo}>
                  <ThemedText style={styles.infoLabel}>Dominio:</ThemedText>
                  <ThemedText style={styles.domainText}>
                    {university.domains[0] || 'No disponible'}
                  </ThemedText>
                </ThemedView>

                {university.web_pages.length > 0 && (
                  <TouchableOpacity
                    style={styles.websiteButton}
                    onPress={() => openWebsite(formatUrl(university.web_pages[0]))}
                  >
                    <IconSymbol name="link" size={16} color="#10B981" />
                    <ThemedText style={styles.websiteButtonText}>
                      Visitar sitio web
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </ThemedView>
            ))}
            
            <ThemedView style={styles.infoContainerInScroll}>
              <ThemedText style={styles.infoTitle}>ℹ️ Instrucciones</ThemedText>
              <ThemedText style={styles.infoText}>
                • Ingresa el nombre del país en inglés{'\n'}
                • Ejemplos: "Dominican Republic", "United States", "United Kingdom"{'\n'}
                • Toca los chips para seleccionar países populares{'\n'}
                • Presiona "Visitar sitio web" para abrir la página oficial
              </ThemedText>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      )}

      {universities.length === 0 && !loading && !error && (
        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>ℹ️ Instrucciones</ThemedText>
          <ThemedText style={styles.infoText}>
            • Ingresa el nombre del país en inglés{'\n'}
            • Ejemplos: "Dominican Republic", "United States", "United Kingdom"{'\n'}
            • Toca los chips para seleccionar países populares{'\n'}
            • Presiona "Visitar sitio web" para abrir la página oficial
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
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
    paddingHorizontal: 20,
    marginBottom: 15,
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
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    opacity: 0.8,
  },
  suggestionChip: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionText: {
    fontSize: 12,
    color: '#10B981',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  resultsTitle: {
    marginBottom: 15,
    color: '#10B981',
  },
  universitiesList: {
    flex: 1,
    maxHeight: 500,
  },
  universityCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  universityHeader: {
    marginBottom: 10,
  },
  universityName: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  universityLocation: {
    fontSize: 12,
    opacity: 0.7,
  },
  universityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  domainText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 10,
    borderRadius: 8,
  },
  websiteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  infoContainerInScroll: {
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
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 18,
  },
});