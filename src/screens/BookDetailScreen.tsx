import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Book, RootStackParamList } from '../types';
import { getBooks, saveBooks } from '../storage/bookStorage';
import { Colors, Fonts, Spacing, BorderRadius, Shadow } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;
type DetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;

/**
 * Màn hình Chi tiết sách (Câu 4).
 * Hiển thị đầy đủ thông tin + nút Cho mượn / Nhận trả.
 */
const BookDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { bookId } = route.params;

  const [book, setBook] = useState<Book | null>(null);

  // Tải dữ liệu mỗi khi màn hình focus (sau khi sửa xong quay về)
  useFocusEffect(
    useCallback(() => {
      loadBook();
    }, [bookId])
  );

  const loadBook = async () => {
    const books = await getBooks();
    const found = books.find((b) => b.id === bookId);
    if (!found) {
      Alert.alert('Thông báo', 'Sách không tồn tại hoặc đã bị xoá', [
        { text: 'Quay lại', onPress: () => navigation.goBack() },
      ]);
      return;
    }
    setBook(found);
  };

  if (!book) {
    return (
      <View style={styles.center}>
        <Text style={Fonts.body}>Đang tải...</Text>
      </View>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const canBorrow = remaining > 0;
  const canReturn = book.borrowed > 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Giáo trình': return Colors.categoryGiaotrinh;
      case 'Tiểu thuyết': return Colors.categoryTieuthuyet;
      case 'Khoa học': return Colors.categoryKhoahoc;
      case 'Thiếu nhi': return Colors.categoryThieunhi;
      default: return Colors.primary;
    }
  };

  /**
   * Cho mượn: tăng borrowed lên 1.
   */
  const handleBorrow = async () => {
    if (!book || book.quantity - book.borrowed <= 0) return;
    try {
      const books = await getBooks();
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, borrowed: b.borrowed + 1 } : b
      );
      await saveBooks(updatedBooks);
      setBook((prev) => (prev ? { ...prev, borrowed: prev.borrowed + 1 } : null));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thực hiện mượn sách. Vui lòng thử lại!');
    }
  };

  /**
   * Nhận trả: giảm borrowed đi 1.
   */
  const handleReturn = async () => {
    if (!book || book.borrowed <= 0) return;
    try {
      const books = await getBooks();
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, borrowed: b.borrowed - 1 } : b
      );
      await saveBooks(updatedBooks);
      setBook((prev) => (prev ? { ...prev, borrowed: prev.borrowed - 1 } : null));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thực hiện trả sách. Vui lòng thử lại!');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tiêu đề sách */}
      <View style={styles.headerCard}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>✍️ {book.author}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(book.category) + '20' }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(book.category) }]}>
            {book.category}
          </Text>
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>📋 Thông tin chi tiết</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã sách:</Text>
          <Text style={styles.infoValue}>{book.id}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Năm xuất bản:</Text>
          <Text style={styles.infoValue}>{book.year}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tổng số cuốn:</Text>
          <Text style={styles.infoValue}>{book.quantity}</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Đang cho mượn:</Text>
          <Text style={[styles.infoValue, book.borrowed > 0 && { color: Colors.warning }]}>
            {book.borrowed}
          </Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Còn lại:</Text>
          <Text style={[styles.infoValue, remaining === 0 && { color: Colors.danger }]}>
            {remaining}
            {remaining === 0 && ' (Hết sách)'}
          </Text>
        </View>
      </View>

      {/* Trạng thái hiện tại */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusBox, { backgroundColor: Colors.primaryLight }]}>
            <Text style={[styles.statusNumber, { color: Colors.primary }]}>{book.quantity}</Text>
            <Text style={[styles.statusLabel, { color: Colors.primary }]}>Tổng</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: Colors.warningLight }]}>
            <Text style={[styles.statusNumber, { color: Colors.warning }]}>{book.borrowed}</Text>
            <Text style={[styles.statusLabel, { color: Colors.warning }]}>Đang mượn</Text>
          </View>
          <View style={[styles.statusBox, { backgroundColor: remaining > 0 ? '#DCFCE7' : Colors.dangerLight }]}>
            <Text style={[styles.statusNumber, { color: remaining > 0 ? Colors.secondary : Colors.danger }]}>{remaining}</Text>
            <Text style={[styles.statusLabel, { color: remaining > 0 ? Colors.secondary : Colors.danger }]}>Còn lại</Text>
          </View>
        </View>
      </View>

      {/* Nút Cho mượn / Nhận trả (Câu 4) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.borrowButton, !canBorrow && styles.disabledButton]}
          onPress={canBorrow ? handleBorrow : undefined}
          activeOpacity={canBorrow ? 0.7 : 1}
          disabled={!canBorrow}
        >
          <Text style={[styles.actionButtonText, !canBorrow && styles.disabledButtonText]}>
            📤 Cho mượn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.returnButton, !canReturn && styles.disabledButton]}
          onPress={canReturn ? handleReturn : undefined}
          activeOpacity={canReturn ? 0.7 : 1}
          disabled={!canReturn}
        >
          <Text style={[styles.actionButtonText, styles.returnButtonText, !canReturn && styles.disabledButtonText]}>
            📥 Nhận trả
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút Sửa */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('BookForm', { book })}
        activeOpacity={0.7}
      >
        <Text style={styles.editButtonText}>✏️ Sửa thông tin sách</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
    alignItems: 'center',
  },
  bookTitle: {
    ...Fonts.title,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  bookAuthor: {
    ...Fonts.body,
    color: Colors.primaryLight,
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
  },
  categoryText: {
    ...Fonts.caption,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    margin: Spacing.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  sectionTitle: {
    ...Fonts.subtitle,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    ...Fonts.body,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Fonts.bodyBold,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  statusCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statusBox: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusLabel: {
    ...Fonts.small,
    fontWeight: '500',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadow.button,
  },
  borrowButton: {
    backgroundColor: Colors.primary,
  },
  returnButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.disabledBg,
    borderColor: Colors.disabled,
  },
  actionButtonText: {
    ...Fonts.bodyBold,
    color: Colors.white,
  },
  returnButtonText: {
    color: Colors.primary,
  },
  disabledButtonText: {
    color: Colors.disabled,
  },
  editButton: {
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  editButtonText: {
    ...Fonts.bodyBold,
    color: Colors.textSecondary,
  },
});

export default BookDetailScreen;
