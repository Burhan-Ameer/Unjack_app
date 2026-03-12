import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { PillTab } from '../components/PillTab';

import { friends, globalLeaderboard } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  streak: string;
  rank: number;
  avatar: string;
}

const PODIUM_COLORS = ['#EEF2FF', '#A5F3E0', '#FFF0F3'];
const PODIUM_ORDER = [1, 0, 2]; // 2nd, 1st, 3rd display order

const PodiumCard = ({
  user,
  backgroundColor,
  isCenter,
}: {
  user: LeaderboardUser;
  backgroundColor: string;
  isCenter: boolean;
}) => (
  <View
    style={[
      styles.podium,
      { backgroundColor },
      isCenter && styles.podiumCenter,
    ]}
  >
    {isCenter && (
      <View style={styles.crownBadge}>
        <Text style={styles.crownText}>👑</Text>
      </View>
    )}
    <Image source={{ uri: user.avatar }} style={[styles.podiumAvatar, isCenter && styles.podiumAvatarCenter]} />
    <Text style={styles.podiumRank}>#{user.rank}</Text>
    <Text style={styles.podiumName} numberOfLines={1}>{user.name}</Text>
    <Text style={styles.podiumStreak}>{user.streak}</Text>
  </View>
);

export default function LeaderboardScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState('Friends');
  const data = activeTab === 'Friends' ? friends : (globalLeaderboard || friends);

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        onNotificationsPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Leaderboard</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>

        <PillTab
          tabs={['Friends', 'Global']}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Podium */}
        {topThree.length >= 3 && (
          <View style={styles.podiumContainer}>
            {PODIUM_ORDER.map((dataIndex, displayIndex) => {
              if (!topThree[dataIndex]) return null;
              const isCenter = displayIndex === 1;
              return (
                <PodiumCard
                  key={topThree[dataIndex].id}
                  user={topThree[dataIndex]}
                  backgroundColor={PODIUM_COLORS[dataIndex]}
                  isCenter={isCenter}
                />
              );
            })}
          </View>
        )}

        {/* Rest of list */}
        <View style={styles.listContainer}>
          {rest.map((user, index) => (
            <View key={user.id} style={styles.listItem}>
              <Text style={styles.listRank}>{user.rank}</Text>
              <Image source={{ uri: user.avatar }} style={styles.listAvatar} />
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{user.name}</Text>
                <Text style={styles.listUsername}>{user.username}</Text>
              </View>
              <View style={styles.listRight}>
                <Text style={styles.listStreak}>{user.streak}</Text>
                <Text style={styles.rankChange}>▲ 1</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  podium: {
    flex: 1,
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    height: 155,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  podiumCenter: {
    height: 185,
    justifyContent: 'flex-end',
  },
  crownBadge: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
  crownText: {
    fontSize: 18,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  podiumAvatarCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  podiumRank: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  podiumName: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  podiumStreak: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    width: 26,
    textAlign: 'center',
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 10,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  listUsername: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  listRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  listStreak: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  rankChange: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '700',
  },
});
