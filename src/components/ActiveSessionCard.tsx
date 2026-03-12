import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, StopCircle } from 'lucide-react-native';

interface ActiveSessionCardProps {
  isActive: boolean;
  sessionName?: string;
  duration?: string;
  onEndSession: () => void;
  onStartSession: () => void;
}

export const ActiveSessionCard: React.FC<ActiveSessionCardProps> = ({
  isActive,
  sessionName,
  duration,
  onEndSession,
  onStartSession,
}) => {
  if (isActive) {
    return (
      <View style={[styles.card, styles.cardActive]}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.activeBadgeRow}>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>LIVE</Text>
          </View>
          <Text style={styles.sessionNameText}>{sessionName || 'Focus Session'}</Text>
        </View>

        <Text style={styles.durationText}>{duration}</Text>
        <Text style={styles.subtitleActive}>Stay strong. Your streak is live.</Text>

        <TouchableOpacity onPress={onEndSession} style={styles.endButton}>
          <StopCircle size={15} color="#111827" />
          <Text style={styles.endButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.cardInactive]}>
      {/* Decorative circles */}
      <View style={styles.decorCircle1Inactive} />
      <View style={styles.decorCircle2Inactive} />

      <View style={styles.iconRow}>
        <View style={styles.sessionIcon}>
          <Zap size={22} color="#111827" />
        </View>
      </View>

      <Text style={styles.inactiveTitle}>No active session</Text>
      <Text style={styles.inactiveSubtitle}>Start a schedule to begin your streak</Text>

      <TouchableOpacity onPress={onStartSession} style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Focus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardActive: {
    backgroundColor: '#111827',
    minHeight: 180,
  },
  cardInactive: {
    backgroundColor: '#A5F3E0',
    minHeight: 160,
  },
  // Decorative background circles (active)
  decorCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -30,
    right: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 10,
    right: 60,
  },
  // Decorative background circles (inactive/teal)
  decorCircle1Inactive: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: -50,
    right: -40,
  },
  decorCircle2Inactive: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    bottom: -20,
    left: 30,
  },
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sessionNameText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  durationText: {
    fontSize: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitleActive: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  endButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  iconRow: {
    marginBottom: 14,
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  inactiveSubtitle: {
    fontSize: 13,
    color: 'rgba(17,24,39,0.55)',
    marginBottom: 20,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#111827',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
