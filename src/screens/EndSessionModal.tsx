import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { X, CheckCircle, Clock, Shield, Zap } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'EndSession'>;


export default function EndSessionModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const { duration = '00:00:00', appsBlocked = 0, sessionName = 'Focus Session' } =
    route.params ?? {};

  const handleConfirmEnd = () => {
    navigation.navigate('MainTabs', { endSession: true } as any);
  };

  const handleKeepGoing = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Handle bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>End Session?</Text>
        <TouchableOpacity onPress={handleKeepGoing} style={styles.closeButton}>
          <X size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.sessionBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.sessionBadgeText}>LIVE</Text>
        </View>

        <Text style={styles.sessionName}>{sessionName}</Text>
        <Text style={styles.durationValue}>{duration}</Text>
        <Text style={styles.durationLabel}>session time</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Shield size={18} color="#111827" />
          </View>
          <Text style={styles.statValue}>{appsBlocked}</Text>
          <Text style={styles.statLabel}>Apps blocked</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Clock size={18} color="#111827" />
          </View>
          <Text style={styles.statValue}>{duration}</Text>
          <Text style={styles.statLabel}>Time focused</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Zap size={18} color="#111827" />
          </View>
          <Text style={styles.statValue}>+1</Text>
          <Text style={styles.statLabel}>Streak day</Text>
        </View>
      </View>

      {/* Encouragement */}
      <View style={styles.encourageBox}>
        <CheckCircle size={18} color="#22C55E" />
        <Text style={styles.encourageText}>
          Great work! Your streak is still counting.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.keepGoingButton} onPress={handleKeepGoing}>
          <Text style={styles.keepGoingText}>Keep Going</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endButton} onPress={handleConfirmEnd}>
          <Text style={styles.endButtonText}>End Session</Text>
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
    alignItems: 'center',
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
  summaryCard: {
    backgroundColor: '#111827',
    borderRadius: 28,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 28,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  decorCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -40,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 0,
    right: 60,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  sessionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sessionName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
    marginBottom: 8,
  },
  durationValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#A5F3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  encourageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  encourageText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 'auto',
    paddingBottom: 24,
    paddingTop: 24,
  },
  keepGoingButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepGoingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  endButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
