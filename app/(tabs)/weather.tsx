import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Constants from 'expo-constants';

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    feelslike_c: number;
    uv: number;
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    vis_km: number;
  };
}

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  const API_KEY = (Constants.expoConfig?.extra as any)?.WEATHER_API_KEY || process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  const DEFAULT_QUERY = 'Santo Domingo, DO';


  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!API_KEY) {
        throw new Error('Falta la API key de WeatherAPI');
      }
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(DEFAULT_QUERY)}&aqi=no&lang=es`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`WeatherAPI respondió con estado ${res.status}`);
      }
      const apiData = await res.json();
      setWeatherData(apiData as WeatherData);
    } catch (err) {
      setError('Error al obtener datos del clima. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return '☀️';
      case 'parcialmente nublado':
        return '⛅';
      case 'nublado':
        return '☁️';
      case 'lluvia ligera':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return '#FFA726';
      case 'parcialmente nublado':
        return '#42A5F5';
      case 'nublado':
        return '#78909C';
      case 'lluvia ligera':
        return '#5C6BC0';
      default:
        return '#66BB6A';
    }
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Bajo', color: '#4CAF50' };
    if (uv <= 5) return { level: 'Moderado', color: '#FF9800' };
    if (uv <= 7) return { level: 'Alto', color: '#FF5722' };
    if (uv <= 10) return { level: 'Muy Alto', color: '#E91E63' };
    return { level: 'Extremo', color: '#9C27B0' };
  };

  if (loading && !weatherData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <ThemedText style={styles.loadingText}>Obteniendo datos del clima...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F59E0B']} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🌤️ Clima en RD
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Estado del tiempo actual • Datos de WeatherAPI
        </ThemedText>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
            <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {weatherData && (
        <ThemedView style={styles.weatherContainer}>

          <ThemedView style={[styles.mainWeatherCard, { borderLeftColor: getWeatherColor(weatherData.current.condition.text) }]}>
            <ThemedView style={styles.locationHeader}>
              <ThemedText type="subtitle" style={styles.locationName}>
                📍 {weatherData.location.name}
              </ThemedText>
              <ThemedText style={styles.country}>
                {weatherData.location.country}
              </ThemedText>
              <ThemedText style={styles.lastUpdate}>
                {weatherData.location.localtime}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.currentWeather}>
              <ThemedText style={styles.weatherIcon}>
                {getWeatherIcon(weatherData.current.condition.text)}
              </ThemedText>
              <ThemedView style={styles.temperatureContainer}>
                <ThemedText style={styles.temperature}>
                  {weatherData.current.temp_c}°C
                </ThemedText>
                <ThemedText style={styles.temperatureFahrenheit}>
                  {weatherData.current.temp_f}°F
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedText style={[styles.condition, { color: getWeatherColor(weatherData.current.condition.text) }]}>
              {weatherData.current.condition.text}
            </ThemedText>

            <ThemedText style={styles.feelsLike}>
              Sensación térmica: {weatherData.current.feelslike_c}°C
            </ThemedText>
          </ThemedView>


          <ThemedView style={styles.detailsContainer}>
            <ThemedText type="subtitle" style={styles.detailsTitle}>
              📊 Detalles del Clima
            </ThemedText>

            <ThemedView style={styles.detailsGrid}>
              <ThemedView style={styles.detailCard}>
                <IconSymbol name="drop.fill" size={24} color="#2196F3" />
                <ThemedText style={styles.detailLabel}>Humedad</ThemedText>
                <ThemedText style={styles.detailValue}>{weatherData.current.humidity}%</ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailCard}>
                <IconSymbol name="wind" size={24} color="#4CAF50" />
                <ThemedText style={styles.detailLabel}>Viento</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {weatherData.current.wind_kph} km/h {weatherData.current.wind_dir}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailCard}>
                <ThemedText style={styles.detailIcon}>☀️</ThemedText>
                <ThemedText style={styles.detailLabel}>Índice UV</ThemedText>
                <ThemedText style={[styles.detailValue, { color: getUVLevel(weatherData.current.uv).color }]}>
                  {weatherData.current.uv} - {getUVLevel(weatherData.current.uv).level}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailCard}>
                <ThemedText style={styles.detailIcon}>🔍</ThemedText>
                <ThemedText style={styles.detailLabel}>Visibilidad</ThemedText>
                <ThemedText style={styles.detailValue}>{weatherData.current.vis_km} km</ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailCard}>
                <ThemedText style={styles.detailIcon}>🌡️</ThemedText>
                <ThemedText style={styles.detailLabel}>Presión</ThemedText>
                <ThemedText style={styles.detailValue}>{weatherData.current.pressure_mb} mb</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.infoContainer}>
            <ThemedText style={styles.infoTitle}>ℹ️ Información</ThemedText>
            <ThemedText style={styles.infoText}>
              • Los datos se actualizan en tiempo real{'\n'}
              • Desliza hacia abajo para refrescar{'\n'}
              • Información específica para República Dominicana{'\n'}
              • Todas las mediciones están en sistema métrico
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  loadingText: {
    marginTop: 10,
    opacity: 0.7,
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
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherContainer: {
    padding: 20,
  },
  mainWeatherCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  locationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationName: {
    color: '#333',
    marginBottom: 5,
  },
  country: {
    opacity: 0.7,
    marginBottom: 5,
  },
  lastUpdate: {
    fontSize: 12,
    opacity: 0.6,
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  weatherIcon: {
    fontSize: 80,
    marginRight: 20,
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 56,
  },
  temperatureFahrenheit: {
    fontSize: 18,
    opacity: 0.7,
    lineHeight: 22,
  },
  condition: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  feelsLike: {
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailsTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
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