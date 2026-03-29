import React, { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, Zap, Users, FileText, Trophy } from 'lucide-react-native';
import { notifications } from '../mock/data';

const TYPE_META: Record<string, { icon: any; color: string; bg: string }> = {
  streak:          { icon: Zap,      color: '#F59E0B', bg: '#FFFBEB' },
  friend_activity: { icon: Users,    color: '#6366F1', bg: '#EEF2FF' },
  friend_request:  { icon: Users,    color: '#22C55E', bg: '#F0FDF4' },
  weekly_summary:  { icon: FileText, color: '#3B82F6', bg: '#EFF6FF' },
  achievement:     { icon: Trophy,   color: '#F472B6', bg: '#FFF0F3' },
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter(n => !n.isRead).length;

  const markAllRead = () => setItems(items.map(n => ({ ...n, isRead: true })));

  const todayItems = items.slice(0, 3);
  const olderItems = items.slice(3);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today */}
        <Text style={styles.sectionLabel}>Today</Text>
        {todayItems.map(item => <NotifRow key={item.id} item={item} />)}

        {/* Earlier */}
        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Earlier</Text>
        {olderItems.map(item => <NotifRow key={item.id} item={item} />)}

        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={40} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No new notifications right now.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotifRow({ item }: { item: typeof notifications[0] }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.weekly_summary;
  const Icon = meta.icon;

  return (
    <View style={[styles.notifRow, !item.isRead && styles.notifRowUnread]}>
      {/* Actor avatar or icon */}
      {'actorAvatar' in item && item.actorAvatar ? (
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: item.actorAvatar as string }} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: meta.bg }]}>
            <Icon size={10} color={meta.color} />
          </View>
        </View>
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: meta.bg }]}>
          <Icon size={20} color={meta.color} />
        </View>
      )}

      <View style={styles.notifContent}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{item.timestamp}</Text>
      </View>

      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  unreadBadge: {
    backgroundColor: '#111827',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
    width: 80,
    textAlign: 'right',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  notifRowUnread: {
    backgroundColor: '#FAFBFF',
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
  },
  avatarWrapper: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: { flex: 1 },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  notifBody: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
