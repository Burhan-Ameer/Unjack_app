import React, { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  TouchableOpacity, Switch, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Bell, Shield, Eye, Trash2,
  ChevronRight, Moon, Clock, AlertTriangle,
} from 'lucide-react-native';
import { appSettings } from '../mock/data';

export default function SettingsScreen() {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <SectionHeader icon={Bell} label="Notifications" color="#6366F1" bg="#EEF2FF" />
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
        <SectionHeader icon={Clock} label="App Behavior" color="#F59E0B" bg="#FFFBEB" />
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
        <SectionHeader icon={Eye} label="Privacy" color="#22C55E" bg="#F0FDF4" />
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
        <SectionHeader icon={Shield} label="Account" color="#3B82F6" bg="#EFF6FF" />
        <View style={styles.card}>
          <LinkRow label="Edit profile"     onPress={() => {}} />
          <LinkRow label="Change password"  onPress={() => {}} divider />
          <LinkRow label="Connected accounts" onPress={() => {}} divider />
        </View>

        {/* About */}
        <View style={styles.card}>
          <LinkRow label="Terms of Service" onPress={() => {}} />
          <LinkRow label="Privacy Policy"   onPress={() => {}} divider />
          <LinkRow label="Send feedback"    onPress={() => {}} divider />
          <View style={[styles.row, { paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>

        {/* Danger zone */}
        <SectionHeader icon={AlertTriangle} label="Danger Zone" color="#EF4444" bg="#FEF2F2" />
        <View style={styles.card}>
          <TouchableOpacity style={styles.dangerRow} onPress={() => {}}>
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.dangerText}>Reset all data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dangerRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6' }]} onPress={() => {}}>
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
        <Text style={[styles.rowLabel, destructive && { color: '#EF4444' }]}>{label}</Text>
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
    <TouchableOpacity style={[styles.row, divider && styles.rowDivider]} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={[styles.rowValue, capitalize && { textTransform: 'capitalize' }]}>{value}</Text>
        <ChevronRight size={16} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}

function LinkRow({ label, onPress, divider }: any) {
  return (
    <TouchableOpacity style={[styles.row, divider && styles.rowDivider]} onPress={onPress}>
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
    paddingHorizontal: 16,
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
