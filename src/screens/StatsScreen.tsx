import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { SegmentedProgress } from '../components/SegmentedProgress';

import { stats, blockedApps } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Stable mock data to avoid re-randomizing on every render
const APP_DATA = [
  { id: '1', name: 'Instagram', timeBlocked: '3h 45m', progress: 0.85 },
  { id: '2', name: 'TikTok', timeBlocked: '2h 20m', progress: 0.65 },
  { id: '3', name: 'YouTube', timeBlocked: '1h 10m', progress: 0.40 },
];

const AppUsageRow = ({ name, timeBlocked, progress, isLast }: any) => (
  <View style={[styles.appRow, isLast && styles.appRowLast]}>
    <View style={styles.appLeft}>
      <View style={styles.appIconContainer}>
        <View style={styles.appIconPlaceholder} />
      </View>
      <View style={styles.appInfoColumn}>
        <Text style={styles.appName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <Text style={styles.appTime} numberOfLines={1}>{timeBlocked}</Text>
      </View>
    </View>
    <SegmentedProgress total={6} filled={Math.floor(progress * 6)} size={28} />
  </View>
);

const BarChart = ({ data }: { data: any[] }) => {
  const maxBarHeight = 110;
  return (
    <View style={styles.barChartCard}>
      <View style={styles.barChartBars}>
        {data.map((item, index) => (
          <View key={index} style={styles.barColumn}>
            <View style={styles.barStack}>
              <View style={[styles.bar, styles.barBlue, { height: item.blockTime * maxBarHeight }]} />
              <View style={[styles.bar, styles.barPink, { height: item.usageSaved * maxBarHeight }]} />
            </View>
            <Text style={styles.barLabel} numberOfLines={1}>{item.date.split(' ')[0]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#A5F3E0' }]} />
          <Text style={styles.legendText}>Block time</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FCA5A5' }]} />
          <Text style={styles.legendText}>Usage saved</Text>
        </View>
      </View>
    </View>
  );
};

export default function StatsScreen() {
  const navigation = useNavigation<Nav>();
  const [year, setYear] = useState('2025');

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
          <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity style={styles.yearSelector} onPress={() => {}}>
            <Text style={styles.yearText}>{year}</Text>
            <ChevronDown size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Summary stat cards */}
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: '#A5F3E0' }]}>
            <Text style={styles.summaryLabel}>Sessions this week</Text>
            <Text style={styles.summaryValue}>{stats.sessionsThisWeek}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.summaryLabel}>Longest streak</Text>
            <Text style={styles.summaryValue}>{stats.longestStreak}</Text>
          </View>
        </View>

        <BarChart data={stats.chartData} />

        {/* Top blocked apps */}
        <View style={styles.appsCard}>
          <Text style={styles.appsTitle}>Top blocked apps</Text>
          {APP_DATA.map((app, index) => (
            <AppUsageRow
              key={app.id}
              name={app.name}
              timeBlocked={app.timeBlocked}
              progress={app.progress}
              isLast={index === APP_DATA.length - 1}
            />
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
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  yearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(17,24,39,0.55)',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  barChartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  barChartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 130,
    marginBottom: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barStack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  bar: {
    width: 9,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barBlue: {
    backgroundColor: '#A5F3E0',
  },
  barPink: {
    backgroundColor: '#FCA5A5',
  },
  barLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  appsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  appsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appRowLast: {
    borderBottomWidth: 0,
  },
  appLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  appInfoColumn: {
    flex: 1,
    minWidth: 0,
  },
  appIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconPlaceholder: {
    width: 26,
    height: 26,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  appTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
