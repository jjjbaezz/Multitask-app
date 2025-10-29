import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AboutScreen() {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('Error opening link:', err);
    }
  };

  const contactMethods = [
    {
      type: 'email',
      label: 'Email',
      value: 'jjjbaezm@gmail.com',
      icon: 'envelope.fill',
      color: '#EA4335',
      action: () => openLink('mailto:jjjbaezm@gmail.com')
    },
    {
      type: 'phone',
      label: 'Teléfono',
      value: '+1 (809) 261-6560',
      icon: 'phone.fill',
      color: '#34A853',
      action: () => openLink('tel:+18092616560')
    },
    {
      type: 'linkedin',
      label: 'LinkedIn',
      value: 'https://www.linkedin.com/in/justin-baez-573b4433b',
      icon: 'person.crop.rectangle',
      color: '#0A66C2',
      action: () => openLink('https://www.linkedin.com/in/justin-baez-573b4433b')
    },
    {
      type: 'github',
      label: 'GitHub',
      value: 'https://github.com/jjjbaezz',
      icon: 'chevron.left.forwardslash.chevron.right',
      color: '#333',
      action: () => openLink('https://github.com/jjjbaezz')
    },
    {
      type: 'portfolio',
      label: 'Portfolio',
      value: 'not ready yet',
      icon: 'globe',
      color: '#FF6B35',
      action: () => openLink('not ready yet')
    }
  ];

  const skills = [
    { name: 'Swift', level: 90, color: '#cf61fbff' },
    { name: 'React Native', level: 85, color: '#61DAFB' },
    { name: 'TypeScript', level: 90, color: '#3178C6' },
    { name: 'JavaScript', level: 95, color: '#F7DF1E' },
    { name: 'Node.js', level: 85, color: '#339933' },
    { name: 'React', level: 60, color: '#61DAFB' },
    { name: 'Firebase', level: 85, color: '#FFCA28' },
    { name: 'MongoDB', level: 75, color: '#47A248' }
  ];

  const experiences = [
    {
      title: 'Desarrollador Mobile Junior',
      company: 'Banco Popular',
      period: '2024 - Presente',
      description: 'Desarrollo de aplicaciones móviles nativas para iOS '
    },
    {
      title: 'Desarrollador Frontend',
      company: 'Freelance',
      period: '2020 - 2024',
      description: 'Creación de interfaces web responsivas y experiencias de usuario interactivas'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <Image
          source={require('../assets/Mi-foto.png')}
          style={styles.profileImage}
          contentFit="cover"
        />
        <ThemedText type="title" style={styles.name}>
          Justin Baez Desarrollador
        </ThemedText>
        <ThemedText style={styles.title}>
          Desarrollador Mobile & Full Stack
        </ThemedText>
        <ThemedText style={styles.location}>
          📍 Santo Domingo, República Dominicana
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          👨‍💻 Acerca de mí
        </ThemedText>
        <ThemedText style={styles.description}>
          Desarrollador apasionado con más de 2 años de experiencia en el desarrollo de aplicaciones móviles y web. 
          Especializado en React Native, TypeScript y Swift y tecnologías modernas. Me encanta crear soluciones innovadoras 
          que resuelvan problemas reales y mejoren la experiencia del usuario.
        </ThemedText>
        <ThemedText style={styles.description}>
          Esta aplicación Multitask es un ejemplo de mis habilidades técnicas, integrando múltiples APIs y 
          funcionalidades en una experiencia móvil fluida y atractiva.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          📞 Información de Contacto
        </ThemedText>
        <ThemedText style={styles.contactSubtitle}>
          ¿Interesado en trabajar conmigo? ¡Contáctame!
        </ThemedText>
        
        {contactMethods.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.contactCard, { borderLeftColor: contact.color }]}
            onPress={contact.action}
          >
            <ThemedView style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
              <IconSymbol name={contact.icon as any} size={24} color={contact.color} />
            </ThemedView>
            <ThemedView style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>{contact.label}</ThemedText>
              <ThemedText style={styles.contactValue}>{contact.value}</ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color="#666" />
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          🛠️ Habilidades Técnicas
        </ThemedText>
        
        {skills.map((skill, index) => (
          <ThemedView key={index} style={styles.skillContainer}>
            <ThemedView style={styles.skillHeader}>
              <ThemedText style={styles.skillName}>{skill.name}</ThemedText>
              <ThemedText style={styles.skillPercentage}>{skill.level}%</ThemedText>
            </ThemedView>
            <ThemedView style={styles.skillBarContainer}>
              <ThemedView 
                style={[
                  styles.skillBar, 
                  { 
                    width: `${skill.level}%`,
                    backgroundColor: skill.color
                  }
                ]} 
              />
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          💼 Experiencia Laboral
        </ThemedText>
        
        {experiences.map((exp, index) => (
          <ThemedView key={index} style={styles.experienceCard}>
            <ThemedText style={styles.experienceTitle}>{exp.title}</ThemedText>
            <ThemedText style={styles.experienceCompany}>{exp.company}</ThemedText>
            <ThemedText style={styles.experiencePeriod}>{exp.period}</ThemedText>
            <ThemedText style={styles.experienceDescription}>{exp.description}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          🚀 Servicios que Ofrezco
        </ThemedText>
        
        <ThemedView style={styles.servicesList}>
          <ThemedText style={styles.serviceItem}>📱 Desarrollo de Apps Móviles (iOS/Android)</ThemedText>
          <ThemedText style={styles.serviceItem}>🌐 Desarrollo de Aplicaciones Web</ThemedText>
          <ThemedText style={styles.serviceItem}>🔧 Integración de APIs y Servicios</ThemedText>
          <ThemedText style={styles.serviceItem}>☁️ Implementación de flujos automatizados</ThemedText>
          <ThemedText style={styles.serviceItem}>🔍 Consultoría Técnica</ThemedText>
          <ThemedText style={styles.serviceItem}>🛠️ Mantenimiento y Soporte</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.ctaSection}>
        <ThemedText type="subtitle" style={styles.ctaTitle}>
          ¿Tienes un proyecto en mente?
        </ThemedText>
        <ThemedText style={styles.ctaDescription}>
          Estoy disponible para nuevos proyectos y colaboraciones. 
          ¡Hablemos sobre cómo puedo ayudarte a hacer realidad tu idea!
        </ThemedText>
        
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => openLink('mailto:desarrollador@multitaskapp.com?subject=Consulta sobre proyecto')}
        >
          <IconSymbol name="envelope.fill" size={20} color="white" />
          <ThemedText style={styles.ctaButtonText}>
            Enviar mensaje
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Made in DR ❤️‍🔥
        </ThemedText>
        <ThemedText style={styles.footerText}>
          Multitask App © 2025
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
    paddingTop: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  name: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 12,
  },
  contactSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillContainer: {
    marginBottom: 15,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillPercentage: {
    fontSize: 12,
    opacity: 0.7,
  },
  skillBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  skillBar: {
    height: '100%',
    borderRadius: 4,
  },
  experienceCard: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experiencePeriod: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 10,
  },
  experienceDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  servicesList: {
    gap: 10,
  },
  serviceItem: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 22,
  },
  ctaSection: {
    backgroundColor: '#4CAF50',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  ctaTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaDescription: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
});