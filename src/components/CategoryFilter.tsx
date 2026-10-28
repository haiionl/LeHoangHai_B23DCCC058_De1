import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Category, CATEGORIES } from '../types';
import { Colors, Fonts, Spacing, BorderRadius, Shadow } from '../theme/colors';

interface CategoryFilterProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

/**
 * Component hàng nút lọc theo thể loại.
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const allCategories: (Category | null)[] = [null, ...CATEGORIES];

  const getLabel = (cat: Category | null) => (cat === null ? 'Tất cả' : cat);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allCategories.map((cat) => {
        const isActive = selected === cat;
        return (
          <TouchableOpacity
            key={cat ?? 'all'}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {getLabel(cat)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.button,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Fonts.caption,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.white,
  },
});

export default CategoryFilter;
