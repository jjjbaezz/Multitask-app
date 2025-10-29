import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer>
          <Drawer.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: true,
              title: 'Multitask App',
              drawerLabel: 'Herramientas Principales'
            }} 
          />
          <Drawer.Screen 
            name="pokemon" 
            options={{ 
              title: 'Pokémon',
              drawerLabel: 'Pokédex'
            }} 
          />
          <Drawer.Screen 
            name="wordpress" 
            options={{ 
              title: 'Noticias WordPress',
              drawerLabel: 'Noticias'
            }} 
          />
          <Drawer.Screen 
            name="about" 
            options={{ 
              title: 'Acerca de',
              drawerLabel: 'Acerca de'
            }} 
          />
          <Drawer.Screen 
            name="modal" 
            options={{ 
              title: 'Modal',
              drawerItemStyle: { display: 'none' }
            }} 
          />
        </Drawer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
