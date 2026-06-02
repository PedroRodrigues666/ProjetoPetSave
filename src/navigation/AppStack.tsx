import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './Tabs';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';

export type AppStackParamList = {
  Tabs: undefined;
  Report: undefined;
  Map:
    | {
        latitude?: number;
        longitude?: number;
        title?: string;
        description?: string;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Novo reporte', headerTintColor: '#7B5143' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Localização', headerTintColor: '#7B5143' }}
      />
    </Stack.Navigator>
  );
}
