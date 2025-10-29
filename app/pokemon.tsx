import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  base_experience: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  cries: {
    latest: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export default function PokemonScreen() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingSound, setPlayingSound] = useState(false);

  const searchPokemon = async () => {
    if (!pokemonName.trim()) {
      setError('Por favor ingresa el nombre de un Pokémon');
      return;
    }

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`);
      
      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }

      const data: Pokemon = await response.json();
      setPokemon(data);
    } catch (err) {
      setError('Pokémon no encontrado. Verifica el nombre e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const playPokemonCry = async () => {
    if (!pokemon?.cries?.latest) {
      setError('Sonido no disponible para este Pokémon');
      return;
    }

    try {
      setPlayingSound(true);

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: pokemon.cries.latest },
        { shouldPlay: true }
      );

      setSound(newSound);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingSound(false);
        }
      });

    } catch (err) {
      setError('Error al reproducir el sonido');
      setPlayingSound(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#68A090';
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const popularPokemon = [
    'pikachu', 'charizard', 'blastoise', 'venusaur', 'mewtwo', 
    'mew', 'lugia', 'rayquaza', 'arceus', 'lucario'
  ];

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🎮 Pokédex
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Busca información de cualquier Pokémon
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: pikachu, charizard, mewtwo..."
          value={pokemonName}
          onChangeText={setPokemonName}
          onSubmitEditing={searchPokemon}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={searchPokemon}
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
        <ThemedText style={styles.suggestionsTitle}>Pokémon populares:</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularPokemon.map((name) => (
            <TouchableOpacity
              key={name}
              style={styles.suggestionChip}
              onPress={() => setPokemonName(name)}
            >
              <ThemedText style={styles.suggestionText}>{capitalizeFirst(name)}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
        </ThemedView>
      )}

      {pokemon && (
        <ThemedView style={styles.pokemonContainer}>

          <ThemedView style={styles.pokemonCard}>
            <ThemedView style={styles.pokemonHeader}>
              <Image
                source={{ uri: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default }}
                style={styles.pokemonImage}
                contentFit="contain"
              />
              <ThemedView style={styles.pokemonInfo}>
                <ThemedText type="title" style={styles.pokemonName}>
                  {capitalizeFirst(pokemon.name)}
                </ThemedText>
                <ThemedText style={styles.pokemonId}>
                  #{pokemon.id.toString().padStart(3, '0')}
                </ThemedText>
                
                <ThemedView style={styles.typesContainer}>
                  {pokemon.types.map((type, index) => (
                    <ThemedView
                      key={index}
                      style={[styles.typeChip, { backgroundColor: getTypeColor(type.type.name) }]}
                    >
                      <ThemedText style={styles.typeText}>
                        {capitalizeFirst(type.type.name)}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>

                <TouchableOpacity
                  style={[styles.soundButton, playingSound && styles.soundButtonPlaying]}
                  onPress={playPokemonCry}
                  disabled={playingSound}
                >
                  <IconSymbol 
                    name={playingSound ? "speaker.wave.2.fill" : "speaker.2.fill"} 
                    size={20} 
                    color="white" 
                  />
                  <ThemedText style={styles.soundButtonText}>
                    {playingSound ? 'Reproduciendo...' : 'Escuchar grito'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.statsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📊 Información Básica
            </ThemedText>
            
            <ThemedView style={styles.basicStatsGrid}>
              <ThemedView style={styles.statCard}>
                <ThemedText style={styles.statValue}>{pokemon.base_experience}</ThemedText>
                <ThemedText style={styles.statLabel}>Experiencia Base</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.statCard}>
                <ThemedText style={styles.statValue}>{pokemon.height / 10} m</ThemedText>
                <ThemedText style={styles.statLabel}>Altura</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.statCard}>
                <ThemedText style={styles.statValue}>{pokemon.weight / 10} kg</ThemedText>
                <ThemedText style={styles.statLabel}>Peso</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.abilitiesContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              ⚡ Habilidades
            </ThemedText>
            <ThemedView style={styles.abilitiesList}>
              {pokemon.abilities.map((ability, index) => (
                <ThemedView key={index} style={styles.abilityChip}>
                  <ThemedText style={styles.abilityText}>
                    {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.combatStatsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              ⚔️ Estadísticas de Combate
            </ThemedText>
            
            {pokemon.stats.map((stat, index) => {
              const statNames: { [key: string]: string } = {
                hp: 'HP',
                attack: 'Ataque',
                defense: 'Defensa',
                'special-attack': 'Ataque Esp.',
                'special-defense': 'Defensa Esp.',
                speed: 'Velocidad'
              };
              
              const percentage = (stat.base_stat / 255) * 100;
              
              return (
                <ThemedView key={index} style={styles.statRow}>
                  <ThemedText style={styles.statName}>
                    {statNames[stat.stat.name] || capitalizeFirst(stat.stat.name)}
                  </ThemedText>
                  <ThemedView style={styles.statBarContainer}>
                    <ThemedView 
                      style={[
                        styles.statBar, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: percentage > 75 ? '#4CAF50' : percentage > 50 ? '#FF9800' : '#F44336'
                        }
                      ]} 
                    />
                  </ThemedView>
                  <ThemedText style={styles.statNumber}>{stat.base_stat}</ThemedText>
                </ThemedView>
              );
            })}
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoTitle}>ℹ️ Instrucciones</ThemedText>
        <ThemedText style={styles.infoText}>
          • Ingresa el nombre de un Pokémon en inglés{'\n'}
          • Usa los chips para seleccionar Pokémon populares{'\n'}
          • Presiona el botón de sonido para escuchar su grito{'\n'}
          • Los datos provienen de la PokéAPI oficial
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    backgroundColor: '#FF6B35',
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
    color: '#FF6B35',
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
  pokemonContainer: {
    padding: 20,
  },
  pokemonCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  pokemonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pokemonId: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 15,
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  soundButtonPlaying: {
    backgroundColor: '#4CAF50',
  },
  soundButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  basicStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 5,
  },
  abilitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  abilitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  abilityText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  combatStatsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 100,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  statNumber: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 15,
    margin: 20,
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