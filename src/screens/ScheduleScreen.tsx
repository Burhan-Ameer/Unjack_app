import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { PillTab } from '../components/PillTab';
import { ScheduleCard } from '../components/ScheduleCard';
import { AppRow } from '../components/AppRow';

import { schedules as initialSchedules, blockedApps } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ScheduleScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState('Schedules');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState(blockedApps);
  const [scheduleList, setScheduleList] = useState(initialSchedules);

  const toggleApp = (id: string) => {
    setApps(apps.map(app =>
      app.id === id ? { ...app, isBlocked: !app.isBlocked } : app
    ));
  };

  const toggleSchedule = (id: string) => {
    setScheduleList(scheduleList.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        showAdd={true}
        addLabel="New Schedule"
        onAdd={() => navigation.navigate('AddEditSchedule', {})}
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Schedule</Text>
      </View>

      <PillTab
        tabs={['Schedules', 'Blocked Apps']}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Schedules' ? (
          <View style={styles.list}>
            {scheduleList.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                name={schedule.name}
                startTime={schedule.startTime}
                endTime={schedule.endTime}
                days={schedule.days}
                isActive={schedule.isActive}
                onToggle={() => toggleSchedule(schedule.id)}
                onEdit={() => navigation.navigate('AddEditSchedule', { scheduleId: schedule.id })}
                appsCount={blockedApps.filter(a => a.isBlocked).length}
              />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.searchContainer}>
              <Search color="#9CA3AF" size={18} />
              <TextInput
                placeholder="Search apps..."
                style={styles.searchInput}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {apps
              .filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((app) => (
                <AppRow
                  key={app.id}
                  name={app.name}
                  packageName={app.packageName}
                  isBlocked={app.isBlocked}
                  onToggle={() => toggleApp(app.id)}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  list: {
    gap: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});
