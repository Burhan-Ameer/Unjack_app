import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SegmentedProgressProps {
  total: number;
  filled: number;
  color?: string;
  size?: number;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  total,
  filled,
  color = '#A5F3E0',
  size = 28,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isFilled = index < filled;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              { width: size, backgroundColor: isFilled ? color : '#F3F4F6' },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  segment: {
    height: 8,
    borderRadius: 4,
  },
});
