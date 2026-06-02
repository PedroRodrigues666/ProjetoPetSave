import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import PartnersScreen from '../screens/PartnersScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
  Home: undefined;
  Emergencias: undefined;
  ONGs: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const brown = '#7B5143';

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: brown,
        tabBarInactiveTintColor: '#8C6F64',
        tabBarActiveBackgroundColor: '#D8CBC5',
        tabBarItemStyle: {
          marginHorizontal: 5,
          borderRadius: 10,
        },
        tabBarStyle: {
          height: 66,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: '#FFFDFC',
          borderTopColor: '#E0D3CC',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home-outline" color={color} size={size} />;
          }

          if (route.name === 'Emergencias') {
            return <Ionicons name="alert-circle-outline" color={color} size={size} />;
          }

          if (route.name === 'ONGs') {
            return (
              <MaterialCommunityIcons
                name="office-building-outline"
                color={color}
                size={size}
              />
            );
          }

          return <Ionicons name="person-outline" color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen
        name="Emergencias"
        component={EmergencyScreen}
        options={{ tabBarLabel: 'Emergências' }}
      />
      <Tab.Screen
        name="ONGs"
        component={PartnersScreen}
        options={{ tabBarLabel: 'ONGs' }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
