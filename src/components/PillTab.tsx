import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PillTabProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export const PillTab: React.FC<PillTabProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onChange(tab)}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  track: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    alignSelf: 'flex-start',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});
