import React, { useEffect, useState } from 'react';
import { Tabs, Redirect, useRootNavigationState } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Palette } from '../../src/constants/palette'
import { LoadingProvider } from '../../src/hooks/useLoading';
import { DataProvider } from '../../src/hooks/useData'
import { useData } from '../../src/hooks'
import AuthScreen from '../../src/components/screens/AuthScreen'



//re add title bar icon
export default function TabLayout() { 

  


  return (
    <Tabs 
      screenOptions={{ tabBarActiveTintColor: Palette.primary, headerShown: false }}
      sceneContainerStyle={{ backgroundColor: 'white' }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="view-dashboard-variant" color={color} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />

    </Tabs>

  );
}
