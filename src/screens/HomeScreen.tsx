import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Zap, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { FriendRow } from '../components/FriendRow';
import { StatCard } from '../components/StatCard';

import { friends, stats, userProfile } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSessionActive) {
      setElapsedSeconds(0);
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSessionActive]);

  const handleStartSession = () => {
    navigation.navigate('StartSession');
  };

  const handleEndSession = () => {
    navigation.navigate('EndSession', {
      duration: formatSeconds(elapsedSeconds),
      appsBlocked: 3,
      sessionName: 'Focus Session',
    });
    setIsSessionActive(false);
  };

  // Called when returning from StartSessionModal with a confirmed start
  // (In production this would use a global state/context; here we just start immediately)
  const startSessionDirectly = () => setIsSessionActive(true);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero greeting */}
        <View style={styles.heroSection}>
          <Text style={styles.heroSub}>Welcome back, {userProfile.name}</Text>
          <Text style={styles.heroTitle}>Stay Focused,{'\n'}Stay Ahead.</Text>
        </View>

        <ActiveSessionCard
          isActive={isSessionActive}
          sessionName="Focus Session"
          duration={isSessionActive ? formatSeconds(elapsedSeconds) : '00:00:00'}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />

        {/* Quick stats row */}
        <View style={styles.statCards}>
          <StatCard
            label="Today's block"
            value={stats.blockTime}
            bgColor="#EEF2FF"
            icon={<Clock color="#6366F1" size={18} />}
          />
          <StatCard
            label="Streak"
            value={userProfile.longestStreak}
            bgColor="#F0FDF4"
            icon={<Zap color="#22C55E" size={18} />}
          />
        </View>

        {/* Friends card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Leaderboard' as any)}>
            <Text style={styles.seeAllText}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.friendsCard}>
          {friends.slice(0, 3).map((friend) => (
            <FriendRow
              key={friend.id}
              avatar={friend.avatar}
              name={friend.name}
              username={friend.username}
              streak={friend.streak}
              rank={friend.rank}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  heroSection: {
    marginBottom: 24,
    marginTop: 4,
  },
  heroSub: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  statCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  friendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 4,
  },
});
