import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

interface ScheduleCardProps {
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  isActive: boolean;
  onToggle: (value: boolean) => void;
  onEdit?: () => void;
  appsCount?: number;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  name,
  startTime,
  endTime,
  days,
  isActive,
  onToggle,
  onEdit,
  appsCount = 0,
}) => {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <View style={[styles.statusDot, isActive ? styles.statusDotActive : styles.statusDotInactive]} />
          <Text style={[styles.name, isActive && styles.nameActive]}>{name}</Text>
        </View>
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#111827' }}
          thumbColor={'#FFFFFF'}
          onValueChange={onToggle}
          value={isActive}
        />
      </View>

      <Text style={[styles.timeText, isActive && styles.timeTextActive]}>
        {startTime} → {endTime}
      </Text>

      <View style={styles.bottomRow}>
        <View style={styles.daysRow}>
          {DAYS.map((day, index) => {
            const isDayActive = days.includes(index + 1);
            return (
              <View
                key={index}
                style={[
                  styles.dayDot,
                  isDayActive
                    ? (isActive ? styles.dayDotActiveCard : styles.dayDotFilled)
                    : styles.dayDotEmpty,
                ]}
              >
                <Text style={[styles.dayText, isDayActive ? styles.dayTextFilled : styles.dayTextEmpty]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.meta}>
          <Text style={[styles.appsCount, isActive && styles.appsCountActive]}>
            {appsCount} apps
          </Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={[styles.editText, isActive && styles.editTextActive]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardActive: {
    backgroundColor: '#111827',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: '#4ADE80',
  },
  statusDotInactive: {
    backgroundColor: '#D1D5DB',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
  nameActive: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 16,
  },
  timeTextActive: {
    color: 'rgba(255,255,255,0.6)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotFilled: {
    backgroundColor: '#111827',
  },
  dayDotActiveCard: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dayDotEmpty: {
    backgroundColor: '#F3F4F6',
  },
  dayText: {
    fontSize: 9,
    fontWeight: '700',
  },
  dayTextFilled: {
    color: '#FFFFFF',
  },
  dayTextEmpty: {
    color: '#9CA3AF',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appsCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  appsCountActive: {
    color: 'rgba(255,255,255,0.4)',
  },
  editText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  editTextActive: {
    color: 'rgba(255,255,255,0.6)',
  },
});
