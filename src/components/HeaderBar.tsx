import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Bell, Plus } from 'lucide-react-native';

interface HeaderBarProps {
  showAdd?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
  /** @deprecated use onNotificationsPress */
  onSettingsPress?: () => void;
  /** @deprecated no-op, kept for backwards compat */
  showSettings?: boolean;
  onMenuPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  showAdd = false,
  addLabel = 'New',
  onAdd,
  onNotificationsPress,
  onAvatarPress,
  onSettingsPress,
  onMenuPress,
}) => {
  const handleBellPress = onNotificationsPress ?? onSettingsPress;

  return (
    <View style={styles.container}>
      {/* Logo / App name */}
      <TouchableOpacity onPress={onMenuPress} style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <Text style={styles.appName}>Unplugged</Text>
      </TouchableOpacity>

      {/* Right actions */}
      <View style={styles.actions}>
        {showAdd && (
          <TouchableOpacity onPress={onAdd} style={styles.addButton}>
            <Plus color="#111827" size={16} />
            <Text style={styles.addLabel}>{addLabel}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleBellPress} style={styles.iconButton}>
          <Bell color="#111827" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAvatarPress ?? onMenuPress} style={styles.avatarButton}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=ali' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#F8FAFB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  appName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 32,
    height: 32,
  },
});
