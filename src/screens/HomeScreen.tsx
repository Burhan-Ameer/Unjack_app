import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Clock, Zap } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { FriendRow } from '../components/FriendRow';
import { StatCard } from '../components/StatCard';

import { friends, stats, userProfile } from '../mock/data';
import { useSession } from '../contexts/SessionContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { session, resetSession } = useSession();

  const handleStartSession = () => {
    navigation.navigate('StartSession');
  };

  const handleEndSession = useCallback(() => {
    const duration = formatSeconds(session.elapsedSeconds);
    navigation.navigate('EndSession', {
      duration,
      appsBlocked: 3,
      sessionName: 'Focus Session',
    });
    resetSession();
  }, [navigation, session.elapsedSeconds, resetSession]);

  // Handle navigation params for starting session
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // Check if we have params from StartSessionModal
        // Since navigation params are not directly accessible here,
        // we need to handle it differently. For now, assume startSessionDirectly is called.
      });
      return unsubscribe;
    }, [navigation]),
  );

  // Auto-end session when time is up
  useEffect(() => {
    if (
      !session.isActive &&
      session.elapsedSeconds >= session.targetDuration &&
      session.targetDuration > 0
    ) {
      // Session just ended
      handleEndSession();
    }
  }, [
    session.isActive,
    session.elapsedSeconds,
    session.targetDuration,
    handleEndSession,
  ]);

  // Called when returning from StartSessionModal with a confirmed start
  // In production, this would be handled via navigation params or global state
  // const startSessionDirectly = (duration: number, scheduleId?: string | null) => {
  //   startSession(duration, scheduleId);
  // };

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
          isActive={session.isActive}
          sessionName="Focus Session"
          duration={
            session.isActive
              ? formatSeconds(session.targetDuration - session.elapsedSeconds)
              : '00:00:00'
          }
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
          <TouchableOpacity
            onPress={() => navigation.navigate('Leaderboard' as any)}
          >
            <Text style={styles.seeAllText}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.friendsCard}>
          {friends.slice(0, 3).map(friend => (
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
