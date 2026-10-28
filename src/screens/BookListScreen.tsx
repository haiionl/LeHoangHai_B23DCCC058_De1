import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Book, Category, RootStackParamList } from '../types';
import { getBooks, saveBooks } from '../storage/bookStorage';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import EmptyList from '../components/EmptyList';
import { Colors, Fonts, Spacing, BorderRadius, Shadow } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookList'>;

/**
 * Màn hình Danh sách sách (Câu 1, 3, 5).
 */
const BookListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.(Colors.primary, true);
    }
  }, []);

  // Tải dữ liệu mỗi khi màn hình focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  // Lọc và tìm kiếm đồng thời (Câu 5)
  const filteredBooks = useMemo(() => {
    let result = books;

    // Lọc theo thể loại
    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa/thường)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query)
      );
    }

    return result;
  }, [books, searchQuery, selectedCategory]);

  // Tính tổng
  const totalBooks = books.length;
  const totalBorrowed = books.reduce((sum, b) => sum + b.borrowed, 0);

  // Xoá sách (Câu 3)
  const handleDeleteBook = (book: Book) => {
    // Không cho xoá sách đang có người mượn
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn. Không thể xoá!`,
        [{ text: 'Đóng', style: 'cancel' }]
      );
      return;
    }

    // Hỏi xác nhận trước khi xoá
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc muốn xoá sách "${book.title}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentBooks = await getBooks();
              const updatedBooks = currentBooks.filter((b) => b.id !== book.id);
              setBooks(updatedBooks);
              await saveBooks(updatedBooks);
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xoá sách. Vui lòng thử lại!');
            }
          },
        },
      ]
    );
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
      onLongPress={() => handleDeleteBook(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.md) + Spacing.sm }]}>
        <Text style={styles.headerTitle}>📚 Quản lý Thư viện</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('BookForm', {})}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Thêm sách</Text>
        </TouchableOpacity>
      </View>

      {/* Thống kê */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: Colors.primaryLight }]}>
          <Text style={[styles.statNumber, { color: Colors.primary }]}>{totalBooks}</Text>
          <Text style={[styles.statLabel, { color: Colors.primary }]}>đầu sách</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.warningLight }]}>
          <Text style={[styles.statNumber, { color: Colors.warning }]}>{totalBorrowed}</Text>
          <Text style={[styles.statLabel, { color: Colors.warning }]}>đang mượn</Text>
        </View>
      </View>

      {/* Ô tìm kiếm (Câu 5) */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Lọc thể loại (Câu 5) */}
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Danh sách sách (Câu 1) */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyList
            message={
              searchQuery || selectedCategory
                ? 'Không tìm thấy sách phù hợp'
                : 'Chưa có sách nào'
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Fonts.title,
    color: Colors.white,
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    ...Shadow.button,
  },
  addButtonText: {
    ...Fonts.bodyBold,
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    ...Fonts.small,
    fontWeight: '500',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
});

export default BookListScreen;
