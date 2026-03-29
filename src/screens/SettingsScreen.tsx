import React, { useState, useEffect, useRef } from 'react';
import { AppRow } from '../components/AppRow';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import {
  ArrowLeft,
  Bell,
  Shield,
  Eye,
  Trash2,
  ChevronRight,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react-native';
import { appSettings } from '../mock/data';
import Accessibility from '../native/AccessibilityModule';
import { useSession } from '../contexts/SessionContext';

export default function SettingsScreen() {
  // Get focus mode from context
  const { focusMode, toggleFocusMode, setFocusBlockedApps, setFocusDailyGoal, setFocusWeeklyGoal } =
    useSession();

  // Android blocked apps selector state
  const [installedApps, setInstalledApps] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState<boolean>(true);

  // Load installed apps and blocked apps
  useEffect(() => {``
    // Only run on Android
    if (Platform.OS !== 'android') return;
    // Load installed apps
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
        console.warn('Failed to load installed apps');
        setAppsLoading(false);
      });
  }, []);

  const navigation = useNavigation();

  // Handle blocked apps enforcement during focus mode
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (focusMode.enabled && focusMode.blockedApps.length > 0) {
        Accessibility.setBlockedApps(focusMode.blockedApps);
      } else {
        Accessibility.setBlockedApps([]);
      }
    }
  }, [focusMode.enabled, focusMode.blockedApps]);

  // App settings state + toggles
  const [settings, setSettings] = useState(appSettings);

  const toggleNotif = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const toggleBehavior = (key: keyof typeof settings.behavior) => {
    if (typeof settings.behavior[key] === 'boolean') {
      setSettings(prev => ({
        ...prev,
        behavior: { ...prev.behavior, [key]: !prev.behavior[key] },
      }));
    }
  };

  const togglePrivacy = (key: keyof typeof settings.privacy) => {
    if (typeof settings.privacy[key] === 'boolean') {
      setSettings(prev => ({
        ...prev,
        privacy: { ...prev.privacy, [key]: !prev.privacy[key] },
      }));
    }
  };

  // Focus timer controls
  const handleFocusModeToggle = async () => {
    const newEnabled = !focusMode.enabled;
    if (newEnabled && Platform.OS === 'android' && focusMode.blockedApps.length > 0) {
      const enabled = await Accessibility.isAccessibilityEnabled();
      if (!enabled) {
        Alert.alert(
          'Enable Accessibility',
          'To block apps during focus mode, enable Accessibility Service for this app.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: () => {
                Accessibility.openAccessibilitySettings();
                toggleFocusMode(true);
              },
            },
          ],
        );
        return;
      }
    }
    toggleFocusMode(newEnabled);
  };

  const handleDailyGoalChange = (delta: number) =>
    setFocusDailyGoal(focusMode.dailyGoalMinutes + delta);
  const handleWeeklyGoalChange = (delta: number) =>
    setFocusWeeklyGoal(focusMode.weeklyGoalMinutes + delta);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Focus Timer Section */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Focus Mode */}
        <SectionHeader
          icon={Zap}
          label="Focus Mode"
          color="#F59E0B"
          bg="#FEF3C7"
        />
        <View style={styles.card}>
          <ToggleRow
            label="Enable Focus Mode"
            sub="Block distracting apps when active"
            value={focusMode.enabled}
            onToggle={handleFocusModeToggle}
          />

          <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', marginVertical: 12 }} />

          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                color: '#111827',
                marginBottom: 8,
              }}
            >
              Daily Goal
            </Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleDailyGoalChange(-5)}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#374151',
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                {focusMode.dailyGoalMinutes} min
              </Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleDailyGoalChange(5)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 15,
                color: '#111827',
                marginBottom: 8,
              }}
            >
              Weekly Goal
            </Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleWeeklyGoalChange(-15)}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#374151',
                  minWidth: 60,
                  textAlign: 'center',
                }}
              >
                {focusMode.weeklyGoalMinutes} min
              </Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleWeeklyGoalChange(15)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.timerBtn,
              {
                borderColor: focusMode.enabled ? '#F59E0B' : '#D1D5DB',
                backgroundColor: focusMode.enabled ? '#FEF3C7' : '#FFF',
              },
            ]}
            onPress={handleFocusModeToggle}
          >
            <Zap size={18} color={focusMode.enabled ? '#F59E0B' : '#D1D5DB'} />
            <Text
              style={{
                fontWeight: '700',
                fontSize: 14,
                color: '#374151',
                marginLeft: 8,
              }}
            >
              {focusMode.enabled ? 'Focus Mode Active' : 'Activate Focus Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Blocked Apps Section (Android only) */}
        {Platform.OS === 'android' && (
          <>
            <SectionHeader
              icon={Shield}
              label="Apps to Block in Focus Mode"
              color="#111827"
              bg="#E5E7EB"
            />
            <View style={styles.card}>
              {appsLoading ? (
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text style={{ color: '#9CA3AF', marginTop: 4 }}>
                    Loading apps...
                  </Text>
                </View>
              ) : (
                (() => {
                  // Filter user apps - exclude system apps or very common system packages
                  const systemPackages = new Set([
                    'android',
                    'com.android',
                    'com.google.android',
                    'com.sec',
                    'android.com',
                  ]);
                  
                  const isSystemPackage = (pkg: string) => 
                    systemPackages.has(pkg) || 
                    systemPackages.has(pkg.split('.').slice(0, 2).join('.'));

                  const userApps = installedApps.filter(
                    app => {
                      const pkg = app.info?.CFBundleIdentifier || app.app || '';
                      // Show non-system apps or apps that don't have system identifiers
                      return !app.system && !app.isSystemApp && !isSystemPackage(pkg);
                    },
                  );
                  
                  // Debug: Log all apps and filtered apps
                  console.log('Total installed apps:', installedApps.length);
                  console.log('All apps:', installedApps.map(app => ({
                    name: app.info?.CFBundleDisplayName || app.app,
                    packageName: app.info?.CFBundleIdentifier || app.app,
                    system: app.system,
                    isSystemApp: app.isSystemApp,
                  })));
                  console.log('Filtered user apps:', userApps.length);
                  console.log('Filtered apps:', userApps.map(app => ({
                    name: app.info?.CFBundleDisplayName || app.app,
                    packageName: app.info?.CFBundleIdentifier || app.app,
                  })));
                  
                  if (!userApps.length) {
                    return (
                      <Text
                        style={{
                          color: '#9CA3AF',
                          textAlign: 'center',
                          marginVertical: 12,
                        }}
                      >
                        No user apps found to block.
                      </Text>
                    );
                  }
                  return userApps.map(app => (
                    <AppRow
                      key={app.info?.CFBundleIdentifier ?? app.app}
                      name={app.info?.CFBundleDisplayName ?? app.app}
                      packageName={app.info?.CFBundleIdentifier ?? app.app}
                      icon={app.icon || app.iconURI}
                      isBlocked={focusMode.blockedApps.includes(
                        app.info?.CFBundleIdentifier ?? app.app,
                      )}
                      onToggle={() => {
                        const pkg = app.info?.CFBundleIdentifier ?? app.app;
                        setFocusBlockedApps(
                          focusMode.blockedApps.includes(pkg)
                            ? focusMode.blockedApps.filter(p => p !== pkg)
                            : [...focusMode.blockedApps, pkg],
                        );
                      }}
                    />
                  ));
                })()
              )}
            </View>
          </>
        )}

        {/* Notifications */}
        <SectionHeader
          icon={Bell}
          label="Notifications"
          color="#6366F1"
          bg="#EEF2FF"
        />
        <View style={styles.card}>
          <ToggleRow
            label="Streak reminders"
            sub="Get nudged before your streak breaks"
            value={settings.notifications.streakReminders}
            onToggle={() => toggleNotif('streakReminders')}
          />
          <ToggleRow
            label="Friend activity"
            sub="When friends start or finish sessions"
            value={settings.notifications.friendActivity}
            onToggle={() => toggleNotif('friendActivity')}
            divider
          />
          <ToggleRow
            label="Weekly report"
            sub="Your Sunday summary email"
            value={settings.notifications.weeklyReport}
            onToggle={() => toggleNotif('weeklyReport')}
            divider
          />
          <ToggleRow
            label="Session start alerts"
            sub="Notify when a schedule activates"
            value={settings.notifications.sessionStart}
            onToggle={() => toggleNotif('sessionStart')}
            divider
          />
        </View>

        {/* App Behavior */}
        <SectionHeader
          icon={Clock}
          label="App Behavior"
          color="#F59E0B"
          bg="#FFFBEB"
        />
        <View style={styles.card}>
          <InfoRow
            label="Default session duration"
            value={`${settings.behavior.defaultDuration} min`}
            onPress={() => {}}
          />
          <InfoRow
            label="Grace period"
            value={`${settings.behavior.gracePeriod} min`}
            onPress={() => {}}
            divider
          />
          <ToggleRow
            label="Strict mode"
            sub="Prevent ending sessions early"
            value={settings.behavior.strictMode}
            onToggle={() => toggleBehavior('strictMode')}
            divider
            destructive
          />
        </View>

        {/* Privacy */}
        <SectionHeader
          icon={Eye}
          label="Privacy"
          color="#22C55E"
          bg="#F0FDF4"
        />
        <View style={styles.card}>
          <InfoRow
            label="Profile visibility"
            value={settings.privacy.profileVisibility}
            onPress={() => {}}
            capitalize
          />
          <ToggleRow
            label="Share stats publicly"
            sub="Let others see your block time"
            value={settings.privacy.shareStats}
            onToggle={() => togglePrivacy('shareStats')}
            divider
          />
        </View>

        {/* Account */}
        <SectionHeader
          icon={Shield}
          label="Account"
          color="#3B82F6"
          bg="#EFF6FF"
        />
        <View style={styles.card}>
          <LinkRow label="Edit profile" onPress={() => {}} />
          <LinkRow label="Change password" onPress={() => {}} divider />
          <LinkRow label="Connected accounts" onPress={() => {}} divider />
        </View>

        {/* About */}
        <SectionHeader
          icon={Shield}
          label="About"
          color="#6B7280"
          bg="#F3F4F6"
        />
        <View style={styles.card}>
          <LinkRow label="Terms of Service" onPress={() => {}} />
          <LinkRow label="Privacy Policy" onPress={() => {}} divider />
          <LinkRow label="Send feedback" onPress={() => {}} divider />
          <View
            style={[
              styles.row,
              {
                paddingVertical: 14,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6',
              },
            ]}
          >
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>

        {/* Danger zone */}
        <SectionHeader
          icon={AlertTriangle}
          label="Danger Zone"
          color="#EF4444"
          bg="#FEF2F2"
        />
        <View style={styles.card}>
          <TouchableOpacity style={styles.dangerRow} onPress={() => {}}>
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.dangerText}>Reset all data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dangerRow,
              { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
            ]}
            onPress={() => {}}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.dangerText}>Delete account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ icon: Icon, label, color, bg }: any) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIconContainer, { backgroundColor: bg }]}>
        <Icon size={14} color={color} />
      </View>
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function ToggleRow({ label, sub, value, onToggle, divider, destructive }: any) {
  return (
    <View style={[styles.row, divider && styles.rowDivider]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, destructive && { color: '#EF4444' }]}>
          {label}
        </Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#111827' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function InfoRow({ label, value, onPress, divider, capitalize }: any) {
  return (
    <TouchableOpacity
      style={[styles.row, divider && styles.rowDivider]}
      onPress={onPress}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text
          style={[
            styles.rowValue,
            capitalize && { textTransform: 'capitalize' },
          ]}
        >
          {value}
        </Text>
        <ChevronRight size={16} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}

function LinkRow({ label, onPress, divider }: any) {
  return (
    <TouchableOpacity
      style={[styles.row, divider && styles.rowDivider]}
      onPress={onPress}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  timerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 12,
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  rowSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '400',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
});
