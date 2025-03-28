import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
// import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const NavigationButtons = () => (
    <View style={{ flexDirection: 'row', marginRight: 10 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
        <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ 
              headerShown: false,
            }} />
            <Stack.Screen name="login" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Login'
            }} />
            <Stack.Screen name="signup" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Sign Up'
            }} />
            
            <Stack.Screen name="otpMobile" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'OTP Verification'
            }} />
             <Stack.Screen name="documentVerification" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'OTP Verification'
            }} />
            <Stack.Screen name="otpEmail" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Email Verification'
            }} />
            <Stack.Screen name="additionalDetails" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Additional Details'
            }} />
            <Stack.Screen name="success" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Success'
            }} />
            <Stack.Screen name="dashboard" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Dashboard'
            }} />
            <Stack.Screen name="account" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Account Details'
            }} />
            <Stack.Screen name="profile" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Profile'
            }} />
            <Stack.Screen name="change-password" options={{ 
              headerShown: true,
              headerRight: () => <NavigationButtons />,
              title: 'Change Password'
            }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
