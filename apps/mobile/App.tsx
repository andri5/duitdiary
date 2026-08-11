import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { MaintenanceScreen } from './src/screens/MaintenanceScreen';
import { MainNavigator } from './src/navigation/MainNavigator';
import { getMe, type User } from './src/lib/auth';
import { getAccessToken } from './src/lib/api';
import { isMaintenanceMode } from './src/lib/maintenance';
import { PageLoader } from './src/components/PageStatus';
import { AppStatusProvider } from './src/components/AppStatusProvider';
import { DialogProvider } from './src/components/AppDialog';
import { ThemeProvider, useTheme } from './src/themeContext';
import type { ThemeColors } from './src/theme';
import { AuthContext, type RootStackParamList } from './src/authContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'duitdiary://'],
  config: {
    screens: {
      Welcome: 'welcome',
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
      },
      Terms: 'terms',
      Privacy: 'privacy',
    },
  },
};

function AppInner() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [maintenance, setMaintenance] = useState(isMaintenanceMode);

  useEffect(() => {
    if (maintenance) {
      setBooting(false);
      return;
    }
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setUser(null);
          return;
        }
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, [maintenance]);

  if (booting) {
    return (
      <View style={styles.boot}>
        <PageLoader label="Menyiapkan DuitDiary…" />
      </View>
    );
  }

  if (maintenance) {
    return (
      <>
        <StatusBar style="light" />
        <MaintenanceScreen
          onRetry={() => {
            setMaintenance(isMaintenanceMode);
            if (!isMaintenanceMode) {
              setBooting(true);
            }
          }}
        />
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <DialogProvider>
        <AppStatusProvider>
          <StatusBar style={colors.statusBar} />
          <NavigationContainer linking={linking}>
            {user ? (
              <MainNavigator user={user} onLogout={() => setUser(null)} />
            ) : (
              <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                <Stack.Screen name="Terms" component={TermsScreen} />
                <Stack.Screen name="Privacy" component={PrivacyScreen} />
              </Stack.Navigator>
            )}
          </NavigationContainer>
        </AppStatusProvider>
      </DialogProvider>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  });
}
