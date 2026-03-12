import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface FriendRowProps {
  avatar: string;
  name: string;
  username: string;
  streak: string;
  rank: number;
}

export const FriendRow: React.FC<FriendRowProps> = ({
  avatar,
  name,
  username,
  streak,
  rank,
}) => {
  return (
    <View style={styles.row}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.streak}>{streak}</Text>
      </View>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  streak: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rankBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
});
