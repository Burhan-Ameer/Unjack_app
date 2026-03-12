import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface AppRowProps {
  name: string;
  packageName: string;
  icon?: string;
  isBlocked: boolean;
  onToggle: () => void;
}

export const AppRow: React.FC<AppRowProps> = ({
  name,
  packageName,
  icon,
  isBlocked,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.row, isBlocked && styles.rowActive]}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.iconContainer, isBlocked && styles.iconContainerActive]}>
          {icon ? (
            <Image source={{ uri: icon }} style={styles.iconImage} />
          ) : (
            <View style={[styles.iconPlaceholder, isBlocked && styles.iconPlaceholderActive]} />
          )}
        </View>
        <View>
          <Text style={[styles.name, isBlocked && styles.nameActive]}>{name}</Text>
          <Text style={[styles.packageName, isBlocked && styles.packageNameActive]}>{packageName}</Text>
        </View>
      </View>

      <View style={[styles.checkbox, isBlocked && styles.checkboxActive]}>
        {isBlocked && <Check size={12} color="white" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowActive: {
    backgroundColor: '#F8FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#EEF2FF',
  },
  iconImage: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
  },
  iconPlaceholderActive: {
    backgroundColor: '#C7D2FE',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  nameActive: {
    color: '#111827',
  },
  packageName: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  packageNameActive: {
    color: '#6B7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
});
