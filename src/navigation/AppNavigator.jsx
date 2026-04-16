import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import NotesListScreen from '../screens/NotesListScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ emoji, focused }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
);

const NotesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesList" component={NotesListScreen} />
    <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#F0F0F0',
            borderTopWidth: 1,
            height: 52 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 6,
          },
          tabBarActiveTintColor: '#4A6FA5',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          },
        }}
      >
        <Tab.Screen
          name="Notes"
          component={NotesStack}
          options={{
            tabBarLabel: 'Notes',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📝" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{
            tabBarLabel: 'Catégories',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📂" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Search"
          component={NotesListScreen}
          options={{
            tabBarLabel: 'Recherche',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Paramètres',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;