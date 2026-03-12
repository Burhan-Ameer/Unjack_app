import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Home, Calendar, Trophy, BarChart2, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import SignUpScreen from '../screens/onboarding/SignUpScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddEditScheduleScreen from '../screens/AddEditScheduleScreen';
import StartSessionModal from '../screens/StartSessionModal';
import EndSessionModal from '../screens/EndSessionModal';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Notifications: undefined;
  Settings: undefined;
  AddEditSchedule: { scheduleId?: string } | undefined;
  StartSession: undefined;
  EndSession: { duration?: string; appsBlocked?: number; sessionName?: string } | undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabBarIcon({ icon: Icon, focused }: { icon: any; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Icon color={focused ? '#FFFFFF' : '#9CA3AF'} size={22} />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen name="Home"        component={HomeScreen}        options={{ tabBarIcon: ({ focused }) => <TabBarIcon icon={Home}      focused={focused} /> }} />
      <Tab.Screen name="Schedule"    component={ScheduleScreen}    options={{ tabBarIcon: ({ focused }) => <TabBarIcon icon={Calendar}  focused={focused} /> }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ tabBarIcon: ({ focused }) => <TabBarIcon icon={Trophy}    focused={focused} /> }} />
      <Tab.Screen name="Stats"       component={StatsScreen}       options={{ tabBarIcon: ({ focused }) => <TabBarIcon icon={BarChart2} focused={focused} /> }} />
      <Tab.Screen name="Profile"     component={ProfileScreen}     options={{ tabBarIcon: ({ focused }) => <TabBarIcon icon={User}      focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // Toggle to false to start from onboarding, true to skip to main app
  const [isOnboarded] = useState(false);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isOnboarded ? (
          <>
            <RootStack.Screen name="MainTabs"        component={MainTabs}             />
            <RootStack.Screen name="Notifications"   component={NotificationsScreen}  options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="Settings"        component={SettingsScreen}       options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="AddEditSchedule" component={AddEditScheduleScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <RootStack.Screen name="StartSession"    component={StartSessionModal}    options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <RootStack.Screen name="EndSession"      component={EndSessionModal}      options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
          </>
        ) : (
          <>
            <RootStack.Screen name="Splash"          component={SplashScreen}         options={{ animation: 'fade' }} />
            <RootStack.Screen name="Onboarding"      component={OnboardingScreen}     options={{ animation: 'fade' }} />
            <RootStack.Screen name="Login"           component={LoginScreen}          options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="SignUp"          component={SignUpScreen}         options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="MainTabs"        component={MainTabs}             options={{ animation: 'fade' }} />
            <RootStack.Screen name="Notifications"   component={NotificationsScreen}  options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="Settings"        component={SettingsScreen}       options={{ animation: 'slide_from_right' }} />
            <RootStack.Screen name="AddEditSchedule" component={AddEditScheduleScreen} options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <RootStack.Screen name="StartSession"    component={StartSessionModal}    options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <RootStack.Screen name="EndSession"      component={EndSessionModal}      options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#111827',
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 12,
    marginHorizontal: 10
  },
  tabBarItem: {
    height: 68,
    paddingTop: 12,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 34,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
