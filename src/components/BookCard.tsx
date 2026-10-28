import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Book } from '../types';
import { Colors, Fonts, Spacing, BorderRadius, Shadow } from '../theme/colors';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

/**
 * Component hiển thị thông tin 1 cuốn sách dạng thẻ (card).
 */
const BookCard: React.FC<BookCardProps> = ({ book, onPress, onLongPress }) => {
  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining === 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Giáo trình': return Colors.categoryGiaotrinh;
      case 'Tiểu thuyết': return Colors.categoryTieuthuyet;
      case 'Khoa học': return Colors.categoryKhoahoc;
      case 'Thiếu nhi': return Colors.categoryThieunhi;
      default: return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      delayLongPress={500}
    >
      <View style={styles.cardContent}>
        {/* Phần trái: thông tin chính */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>✍️ {book.author}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(book.category) + '20' }]}>
              <Text style={[styles.categoryText, { color: getCategoryColor(book.category) }]}>
                {book.category}
              </Text>
            </View>
            <Text style={styles.year}>📅 {book.year}</Text>
          </View>
        </View>

        {/* Phần phải: số lượng còn lại */}
        <View style={styles.stockContainer}>
          {isOutOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Hết sách</Text>
            </View>
          ) : (
            <View style={styles.stockBadge}>
              <Text style={styles.stockNumber}>{remaining}</Text>
              <Text style={styles.stockLabel}>còn lại</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadow.card,
  },
  cardContent: {
    flexDirection: 'row',
    padding: Spacing.lg,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    ...Fonts.bodyBold,
    marginBottom: Spacing.xs,
  },
  author: {
    ...Fonts.caption,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  categoryText: {
    ...Fonts.small,
    fontWeight: '600',
  },
  year: {
    ...Fonts.small,
  },
  stockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 55,
  },
  stockNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  stockLabel: {
    ...Fonts.small,
    color: Colors.primary,
    marginTop: 2,
  },
  outOfStockBadge: {
    backgroundColor: Colors.dangerLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  outOfStockText: {
    ...Fonts.small,
    fontWeight: '700',
    color: Colors.danger,
  },
});

export default BookCard;
