import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet } from 'react-native';
import { Trophy, Activity, Calendar, Award } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { userProfile } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Stable bar heights (avoid re-randomizing on each render)
const STREAK_BARS = [
  { filled: true, height: 88 },
  { filled: true, height: 64 },
  { filled: true, height: 100 },
  { filled: true, height: 72 },
  { filled: true, height: 96 },
  { filled: false, height: 14 },
  { filled: false, height: 14 },
];
const DAYS_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const StreakHistoryChart = () => (
  <View style={styles.chartContainer}>
    {STREAK_BARS.map((bar, index) => (
      <View key={index} style={styles.chartColumn}>
        <View
          style={[
            styles.chartBar,
            bar.filled ? styles.chartBarFilled : styles.chartBarEmpty,
            { height: bar.height },
          ]}
        />
        <Text style={styles.chartDayLabel}>{DAYS_LABELS[index]}</Text>
      </View>
    ))}
  </View>
);

const AchievementCard = ({ name, description, icon }: any) => {
  let IconComponent: any = Trophy;
  if (icon === 'sunrise') IconComponent = Activity;
  if (icon === 'moon') IconComponent = Award;
  if (icon === 'calendar') IconComponent = Calendar;

  return (
    <View style={styles.achievementCard}>
      <View style={styles.achievementIcon}>
        <IconComponent size={20} color="#111827" />
      </View>
      <Text style={styles.achievementName}>{name}</Text>
      <Text style={styles.achievementDesc} numberOfLines={2}>{description}</Text>
    </View>
  );
};

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();

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
        {/* Profile hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=ali' }}
              style={styles.avatar}
            />
            <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileUsername}>{userProfile.username}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.friendsCount}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.streak}</Text>
            <Text style={styles.statLabel}>Current</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest</Text>
          </View>
        </View>

        {/* Streak history */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Streak history</Text>
          <Text style={styles.cardSubtitle}>Last 7 days</Text>
          <StreakHistoryChart />
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsScroll}
          >
            {userProfile.achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
              />
            ))}
          </ScrollView>
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
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5E7EB',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 4,
  },
  chartColumn: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  chartBar: {
    width: 10,
    borderRadius: 5,
  },
  chartBarFilled: {
    backgroundColor: '#111827',
  },
  chartBarEmpty: {
    backgroundColor: '#F3F4F6',
  },
  chartDayLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  achievementsSection: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  achievementsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    width: 150,
    height: 150,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  achievementIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#A5F3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 15,
    fontWeight: '500',
  },
});
