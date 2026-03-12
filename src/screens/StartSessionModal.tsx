import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { X, Zap, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { schedules } from '../mock/data';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DURATION_PRESETS = [
  { label: '15 min', minutes: 15 },
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: 'Custom', minutes: -1 },
];

export default function StartSessionModal() {
  const navigation = useNavigation<Nav>();
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetPress = (minutes: number) => {
    if (minutes === -1) {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      setSelectedDuration(minutes);
    }
  };

  const effectiveDuration = showCustom
    ? customHours * 60 + customMinutes
    : selectedDuration;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  const handleStart = () => {
    // Navigate back and pass the session params via goBack
    navigation.navigate('MainTabs', {
      screen: 'Home',
      startSession: { duration: effectiveDuration, scheduleId: selectedScheduleId },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Handle bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Start Session</Text>
          <Text style={styles.headerSubtitle}>Choose duration and schedule</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Duration section */}
        <Text style={styles.sectionLabel}>Duration</Text>
        <View style={styles.durationGrid}>
          {DURATION_PRESETS.map((preset) => {
            const isSelected =
              preset.minutes !== -1
                ? !showCustom && selectedDuration === preset.minutes
                : showCustom;
            return (
              <TouchableOpacity
                key={preset.label}
                style={[styles.durationPill, isSelected && styles.durationPillSelected]}
                onPress={() => handlePresetPress(preset.minutes)}
              >
                <Text style={[styles.durationPillText, isSelected && styles.durationPillTextSelected]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom duration stepper */}
        {showCustom && (
          <View style={styles.customCard}>
            <View style={styles.customColumn}>
              <Text style={styles.customUnitLabel}>Hours</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCustomHours(Math.min(23, customHours + 1))}
              >
                <Text style={styles.stepperBtnText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{String(customHours).padStart(2, '0')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCustomHours(Math.max(0, customHours - 1))}
              >
                <Text style={styles.stepperBtnText}>▼</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.customColon}>:</Text>

            <View style={styles.customColumn}>
              <Text style={styles.customUnitLabel}>Minutes</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCustomMinutes(Math.min(59, customMinutes + 5))}
              >
                <Text style={styles.stepperBtnText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{String(customMinutes).padStart(2, '0')}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCustomMinutes(Math.max(0, customMinutes - 5))}
              >
                <Text style={styles.stepperBtnText}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Schedule section */}
        <Text style={styles.sectionLabel}>Schedule (optional)</Text>
        <TouchableOpacity
          style={[styles.scheduleRow, selectedScheduleId === null && styles.scheduleRowSelected]}
          onPress={() => setSelectedScheduleId(null)}
        >
          <View style={styles.scheduleIconBox}>
            <Zap size={16} color="#111827" />
          </View>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleName}>No schedule</Text>
            <Text style={styles.scheduleSubtitle}>Free-form focus session</Text>
          </View>
          {selectedScheduleId === null && <View style={styles.selectedDot} />}
        </TouchableOpacity>

        {schedules.map((schedule) => (
          <TouchableOpacity
            key={schedule.id}
            style={[
              styles.scheduleRow,
              selectedScheduleId === schedule.id && styles.scheduleRowSelected,
            ]}
            onPress={() => setSelectedScheduleId(schedule.id)}
          >
            <View style={styles.scheduleIconBox}>
              <Clock size={16} color="#111827" />
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleName}>{schedule.name}</Text>
              <Text style={styles.scheduleSubtitle}>
                {schedule.startTime} – {schedule.endTime}
              </Text>
            </View>
            {selectedScheduleId === schedule.id && <View style={styles.selectedDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Zap size={18} color="#FFFFFF" />
          <Text style={styles.startButtonText}>
            Start {formatDuration(effectiveDuration)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  durationPillSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  durationPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  durationPillTextSelected: {
    color: '#FFFFFF',
  },
  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    marginTop: 12,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  customColumn: {
    alignItems: 'center',
    gap: 10,
  },
  customUnitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
  },
  stepperValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
    width: 60,
    textAlign: 'center',
  },
  customColon: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginTop: 28,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  scheduleRowSelected: {
    borderColor: '#111827',
    backgroundColor: '#F9FAFB',
  },
  scheduleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F8FAFB',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 22,
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
