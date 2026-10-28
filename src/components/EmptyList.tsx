import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing } from '../theme/colors';

interface EmptyListProps {
  message?: string;
}

/**
 * Component hiển thị khi danh sách rỗng.
 */
const EmptyList: React.FC<EmptyListProps> = ({ message = 'Không có sách nào' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📚</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.hint}>Nhấn "+ Thêm sách" để thêm sách mới</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xl,
  },
  emoji: {
    fontSize: 60,
    marginBottom: Spacing.lg,
  },
  message: {
    ...Fonts.subtitle,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  hint: {
    ...Fonts.caption,
    textAlign: 'center',
  },
});

export default EmptyList;
