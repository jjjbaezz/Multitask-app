import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();

  const tools = [
    { id: 'gender', title: 'Predictor de Género', description: 'Predice el género basado en un nombre', icon: 'person.2.fill', color: '#6366F1' },
    { id: 'age', title: 'Predictor de Edad', description: 'Determina la edad aproximada', icon: 'calendar', color: '#EF4444' },
    { id: 'universities', title: 'Universidades', description: 'Busca universidades por país', icon: 'building.2.fill', color: '#10B981' },
    { id: 'weather', title: 'Clima RD', description: 'Estado del tiempo en República Dominicana', icon: 'cloud.sun.fill', color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerEmoji}>🧰</ThemedText>
        <ThemedText style={styles.subtitle}>
          Tu caja de herramientas digital con múltiples utilidades
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.toolsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Herramientas Disponibles
        </ThemedText>
        
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, { borderLeftColor: tool.color }]}
            onPress={() => router.push(tool.id as any)}
          >
            <ThemedView style={[styles.iconContainer, { backgroundColor: tool.color + '20' }]}>
              <IconSymbol name={tool.icon as any} size={24} color={tool.color} />
            </ThemedView>
            <ThemedView style={styles.toolInfo}>
              <ThemedText type="defaultSemiBold">{tool.title}</ThemedText>
              <ThemedText style={styles.toolDescription}>{tool.description}</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.extraContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Más Herramientas
        </ThemedText>
        <ThemedText style={styles.extraText}>
          Accede a más funcionalidades desde el menú lateral:
        </ThemedText>
        <ThemedView style={styles.extraList}>
          <ThemedText style={styles.extraItem}>🎮 Pokédex - Información de Pokémon</ThemedText>
          <ThemedText style={styles.extraItem}>📰 Noticias - Últimas noticias de WordPress</ThemedText>
          <ThemedText style={styles.extraItem}>👤 Acerca de - Mi informacion</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  headerEmoji: {
    fontSize: 90,
    lineHeight: 100,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  toolsContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  toolInfo: {
    flex: 1,
  },
  toolDescription: {
    opacity: 0.6,
    fontSize: 12,
    marginTop: 2,
  },
  extraContainer: {
    padding: 20,
    paddingTop: 0,
  },
  extraText: {
    opacity: 0.7,
    marginBottom: 15,
  },
  extraList: {
    gap: 8,
  },
  extraItem: {
    fontSize: 14,
    opacity: 0.8,
  },
});
