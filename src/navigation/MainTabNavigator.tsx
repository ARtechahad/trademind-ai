import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

import DashboardScreen from '@/screens/Dashboard/DashboardScreen';
import MarketsScreen from '@/screens/Markets/MarketsScreen';
import AssetDetailScreen from '@/screens/Markets/AssetDetailScreen';
import AIChatScreen from '@/screens/AIAssistant/AIChatScreen';
import SignalsScreen from '@/screens/Signals/SignalsScreen';
import NewsScreen from '@/screens/News/NewsScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const MarketsStack = createNativeStackNavigator();

function MarketsStackNavigator() {
  return (
    <MarketsStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.text }}>
      <MarketsStack.Screen name="MarketsList" component={MarketsScreen} options={{ title: 'Markets' }} />
      <MarketsStack.Screen name="AssetDetail" component={AssetDetailScreen} options={{ title: '' }} />
    </MarketsStack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home',
            Markets: 'trending-up',
            Assistant: 'chatbubble-ellipses',
            Signals: 'flash',
            News: 'newspaper',
            Profile: 'person-circle',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Markets" component={MarketsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Assistant" component={AIChatScreen} options={{ title: 'AI Assistant' }} />
      <Tab.Screen name="Signals" component={SignalsScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
