import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { HeaderBar } from '../components/HeaderBar';
import { PillTab } from '../components/PillTab';
import { ScheduleCard } from '../components/ScheduleCard';
import { AppRow } from '../components/AppRow';

import { blockedApps } from '../mock/data';
import Accessibility from '../native/AccessibilityModule';
import { useSession } from '../contexts/SessionContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type NormalizedApp = {
  id: string;
  name: string;
  packageName: string;
  icon?: string;
};

export default function ScheduleScreen() {
  const navigation = useNavigation<Nav>();
  const { focusMode, schedules, setFocusBlockedApps, toggleScheduleActive } = useSession();
  const [activeTab, setActiveTab] = useState('Schedules');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedApps, setInstalledApps] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState<boolean>(Platform.OS === 'android');

  useEffect(() => {
    if (Platform.OS !== 'android') {
      setAppsLoading(false);
      return;
    }

    Accessibility.getInstalledApps()
      .then((apps: any[]) => {
        setInstalledApps(
          apps.sort((a, b) =>
            (a.info?.CFBundleIdentifier ?? a.app).localeCompare(
              b.info?.CFBundleIdentifier ?? b.app,
            ),
          ),
        );
        setAppsLoading(false);
      })
      .catch(() => {
        setAppsLoading(false);
      });
  }, []);

  const toggleApp = (packageName: string) => {
    const isBlocked = focusMode.blockedApps.includes(packageName);
    setFocusBlockedApps(
      isBlocked
        ? focusMode.blockedApps.filter(pkg => pkg !== packageName)
        : [...focusMode.blockedApps, packageName],
    );
  };

  const availableApps = useMemo<NormalizedApp[]>(() => {
    if (Platform.OS === 'android') {
      return installedApps
        .filter(app => !app.system && !app.isSystemApp)
        .map(app => ({
          id: app.info?.CFBundleIdentifier ?? app.app,
          name: app.info?.CFBundleDisplayName ?? app.name ?? app.app,
          packageName: app.info?.CFBundleIdentifier ?? app.app,
          icon: app.icon || app.iconURI,
        }));
    }

    return blockedApps.map(app => ({
      id: app.id,
      name: app.name,
      packageName: app.packageName,
    }));
  }, [installedApps]);

  const filteredApps = useMemo(
    () =>
      availableApps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [availableApps, searchQuery],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        showAdd={true}
        addLabel="New Schedule"
        compactOnSmallScreen={true}
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
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                name={schedule.name}
                startTime={schedule.startTime}
                endTime={schedule.endTime}
                days={schedule.days}
                isActive={schedule.isActive}
                onToggle={() => toggleScheduleActive(schedule.id)}
                onEdit={() => navigation.navigate('AddEditSchedule', { scheduleId: schedule.id })}
                appsCount={schedule.appIds?.length ?? 0}
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

            {appsLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.loadingText}>Loading apps...</Text>
              </View>
            ) : (
              filteredApps.map(app => (
                <AppRow
                  key={app.id}
                  name={app.name}
                  packageName={app.packageName}
                  icon={app.icon}
                  isBlocked={focusMode.blockedApps.includes(app.packageName)}
                  onToggle={() => toggleApp(app.packageName)}
                />
              ))
            )}
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
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
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
