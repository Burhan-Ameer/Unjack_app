import React, { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput, StyleSheet, Switch, Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Clock, Trash2, Check } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { schedules, blockedApps } from '../mock/data';

type RouteT = RouteProp<RootStackParamList, 'AddEditSchedule'>;

const ALL_DAYS = [
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
  { label: 'S', value: 7 },
];

// Simple time picker wheel using + / - buttons (no native picker dep needed)
function TimePicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [hour, minute] = value.split(':').map(Number);

  const adjustHour = (delta: number) => {
    const h = ((hour + delta) + 24) % 24;
    onChange(`${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };
  const adjustMinute = (delta: number) => {
    const m = ((minute + delta) + 60) % 60;
    onChange(`${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <View style={styles.timePicker}>
      <Text style={styles.timePickerLabel}>{label}</Text>
      <View style={styles.timePickerRow}>
        {/* Hours */}
        <View style={styles.timeUnit}>
          <TouchableOpacity onPress={() => adjustHour(1)} style={styles.timeBtn}><Text style={styles.timeBtnText}>▲</Text></TouchableOpacity>
          <Text style={styles.timeValue}>{String(hour).padStart(2, '0')}</Text>
          <TouchableOpacity onPress={() => adjustHour(-1)} style={styles.timeBtn}><Text style={styles.timeBtnText}>▼</Text></TouchableOpacity>
        </View>
        <Text style={styles.timeSep}>:</Text>
        {/* Minutes */}
        <View style={styles.timeUnit}>
          <TouchableOpacity onPress={() => adjustMinute(5)} style={styles.timeBtn}><Text style={styles.timeBtnText}>▲</Text></TouchableOpacity>
          <Text style={styles.timeValue}>{String(minute).padStart(2, '0')}</Text>
          <TouchableOpacity onPress={() => adjustMinute(-5)} style={styles.timeBtn}><Text style={styles.timeBtnText}>▼</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function AddEditScheduleScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const scheduleId = route.params?.scheduleId;

  const existing = scheduleId ? schedules.find(s => s.id === scheduleId) : null;
  const isEditing = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [startTime, setStartTime] = useState(existing?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(existing?.endTime ?? '17:00');
  const [selectedDays, setSelectedDays] = useState<number[]>(existing?.days ?? [1, 2, 3, 4, 5]);
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [selectedApps, setSelectedApps] = useState<string[]>(existing?.appIds ?? []);

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleApp = (id: string) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    // In a real app: persist to state/API
    navigation.goBack();
  };

  const handleDelete = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Schedule' : 'New Schedule'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Name */}
        <Text style={styles.fieldLabel}>Schedule name</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="e.g. Work Hours, Deep Focus…"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        {/* Active toggle */}
        <View style={styles.activeRow}>
          <View>
            <Text style={styles.fieldLabel}>Active</Text>
            <Text style={styles.fieldSub}>Enable this schedule now</Text>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#E5E7EB', true: '#111827' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Time pickers */}
        <Text style={styles.fieldLabel}>Time range</Text>
        <View style={styles.timeRow}>
          <TimePicker label="Start" value={startTime} onChange={setStartTime} />
          <View style={styles.timeDivider} />
          <TimePicker label="End"   value={endTime}   onChange={setEndTime}   />
        </View>

        {/* Days */}
        <Text style={styles.fieldLabel}>Days</Text>
        <View style={styles.daysRow}>
          {ALL_DAYS.map((day) => {
            const active = selectedDays.includes(day.value);
            return (
              <TouchableOpacity
                key={day.value}
                style={[styles.dayPill, active && styles.dayPillActive]}
                onPress={() => toggleDay(day.value)}
              >
                <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App selection */}
        <Text style={styles.fieldLabel}>Block these apps</Text>
        <Text style={styles.fieldSub}>Apps that will be blocked during this schedule</Text>
        <View style={styles.appList}>
          {blockedApps.map((app) => {
            const selected = selectedApps.includes(app.id);
            return (
              <TouchableOpacity
                key={app.id}
                style={[styles.appRow, selected && styles.appRowSelected]}
                onPress={() => toggleApp(app.id)}
              >
                <View style={[styles.appIcon, selected && styles.appIconSelected]}>
                  <View style={styles.appIconInner} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appPackage}>{app.packageName}</Text>
                </View>
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Delete (edit mode only) */}
        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete schedule</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
  },
  fieldSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: -4,
    marginBottom: 10,
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginTop: 20,
  },
  timeRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  timeDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  timePicker: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  timePickerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeUnit: {
    alignItems: 'center',
    gap: 6,
  },
  timeBtn: {
    padding: 4,
  },
  timeBtnText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    minWidth: 44,
    textAlign: 'center',
  },
  timeSep: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayPill: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  dayPillTextActive: {
    color: '#FFFFFF',
  },
  appList: {
    gap: 8,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  appRowSelected: {
    borderColor: '#111827',
    backgroundColor: '#FAFAFA',
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconSelected: {
    backgroundColor: '#E5E7EB',
  },
  appIconInner: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  appPackage: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
