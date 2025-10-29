import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Linking, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface WordPressPost {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  link: string;
  date: string;
  author: number;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
    }>;
  };
}

export default function WordPressScreen() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  const WORDPRESS_API_URL = 'https://kinsta.com/wp-json/wp/v2/posts?per_page=3&_embed';

  const fetchWordPressPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(WORDPRESS_API_URL);
      
      if (!response.ok) {
        throw new Error('Error al obtener las noticias');
      }

      const data: WordPressPost[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Error al cargar las noticias. Intenta de nuevo.');
      console.error('Error fetching WordPress posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWordPressPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWordPressPosts();
  };

  const openLink = async (url: string) => {
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

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading && posts.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A0D2" />
        <ThemedText style={styles.loadingText}>Cargando noticias...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00A0D2']} />
      }
    >
      <ThemedView style={styles.header}>
        <Image
          source={{ uri: 'https://kinsta.com/wp-content/themes/kinsta/images/kinsta-logo.svg' }}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.title}>
          📰 Noticias de WordPress
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Las últimas 3 noticias de Kinsta
        </ThemedText>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWordPressPosts}>
            <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {posts.length > 0 && (
        <ThemedView style={styles.postsContainer}>
          {posts.map((post, index) => (
            <ThemedView key={post.id} style={styles.postCard}>
              {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <Image
                  source={{ uri: post._embedded['wp:featuredmedia'][0].source_url }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
              )}
              
              <ThemedView style={styles.postContent}>
                <ThemedText type="defaultSemiBold" style={styles.postTitle}>
                  {stripHtml(post.title.rendered)}
                </ThemedText>

                <ThemedView style={styles.postMeta}>
                  <ThemedText style={styles.postDate}>
                    📅 {formatDate(post.date)}
                  </ThemedText>
                  {post._embedded?.author?.[0]?.name && (
                    <ThemedText style={styles.postAuthor}>
                      ✍️ {post._embedded.author[0].name}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedText style={styles.postExcerpt}>
                  {truncateText(stripHtml(post.excerpt.rendered))}
                </ThemedText>

                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => openLink(post.link)}
                >
                  <IconSymbol name="link" size={16} color="white" />
                  <ThemedText style={styles.readMoreText}>
                    Leer artículo completo
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoTitle}>ℹ️ Acerca de esta fuente</ThemedText>
        <ThemedText style={styles.infoText}>
          • <ThemedText style={styles.boldText}>Fuente:</ThemedText> Kinsta.com{'\n'}
          • <ThemedText style={styles.boldText}>API:</ThemedText> WordPress REST API{'\n'}
          • <ThemedText style={styles.boldText}>Contenido:</ThemedText> Hosting, desarrollo web y WordPress{'\n'}
          • <ThemedText style={styles.boldText}>Actualización:</ThemedText> Desliza hacia abajo para refrescar
        </ThemedText>
        
        <TouchableOpacity
          style={styles.visitSiteButton}
          onPress={() => openLink('https://kinsta.com/blog/')}
        >
          <IconSymbol name="safari" size={20} color="#00A0D2" />
          <ThemedText style={styles.visitSiteText}>
            Visitar sitio completo
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    opacity: 0.7,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 40,
    marginBottom: 15,
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
    backgroundColor: '#00A0D2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00A0D2',
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: 20,
  },
  postTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 12,
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  postDate: {
    fontSize: 12,
    opacity: 0.7,
    color: '#666',
  },
  postAuthor: {
    fontSize: 12,
    opacity: 0.7,
    color: '#666',
  },
  postExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 15,
    color: '#555',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A0D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  readMoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  visitSiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  visitSiteText: {
    color: '#00A0D2',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});