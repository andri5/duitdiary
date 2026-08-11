import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { User } from '../lib/auth';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TransactionFormScreen } from '../screens/TransactionFormScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { CategoryFormScreen } from '../screens/CategoryFormScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { colors } from '../theme';
import type { MainStackParamList, MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const TAB_BAR_BASE = 56;

function MainTabs({ user, onLogout }: { user: User; onLogout: () => void }) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.faint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: TAB_BAR_BASE + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'Dashboard'
              ? 'home'
              : route.name === 'Transactions'
                ? 'list'
                : 'person';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" options={{ title: 'Beranda' }}>
        {() => <DashboardScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: 'Transaksi' }}
      />
      <Tab.Screen name="Profile" options={{ title: 'Profil' }}>
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function MainNavigator({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" options={{ headerShown: false }}>
        {() => <MainTabs user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="TransactionForm"
        component={TransactionFormScreen}
        options={{
          title: 'Tambah transaksi',
          presentation: 'modal',
          headerTintColor: colors.brand,
          headerBackTitle: 'Kembali',
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Kategori',
          headerTintColor: colors.brand,
          headerBackTitle: 'Kembali',
        }}
      />
      <Stack.Screen
        name="CategoryForm"
        component={CategoryFormScreen}
        options={{
          title: 'Kategori',
          presentation: 'modal',
          headerTintColor: colors.brand,
          headerBackTitle: 'Kembali',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Pengaturan',
          headerTintColor: colors.brand,
          headerBackTitle: 'Kembali',
        }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Bantuan',
          headerTintColor: colors.brand,
          headerBackTitle: 'Kembali',
        }}
      />
    </Stack.Navigator>
  );
}
