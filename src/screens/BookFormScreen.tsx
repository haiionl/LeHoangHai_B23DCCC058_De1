import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Book, Category, CATEGORIES, RootStackParamList } from '../types';
import { getBooks, saveBooks } from '../storage/bookStorage';
import { Colors, Fonts, Spacing, BorderRadius, Shadow } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookForm'>;
type BookFormRouteProp = RouteProp<RootStackParamList, 'BookForm'>;

interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  quantity?: string;
  category?: string;
}

/**
 * Màn hình Thêm/Sửa sách (Câu 2).
 * Cùng một form dùng cho cả thêm và sửa.
 */
const BookFormScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookFormRouteProp>();
  const editingBook = route.params?.book;
  const isEditing = !!editingBook;

  const [title, setTitle] = useState(editingBook?.title ?? '');
  const [author, setAuthor] = useState(editingBook?.author ?? '');
  const [category, setCategory] = useState<Category | ''>(editingBook?.category ?? '');
  const [year, setYear] = useState(editingBook?.year?.toString() ?? '');
  const [quantity, setQuantity] = useState(editingBook?.quantity?.toString() ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const currentYear = new Date().getFullYear();

  /**
   * Kiểm tra dữ liệu hợp lệ.
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Tên sách bắt buộc
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên sách';
    }

    // Tác giả bắt buộc
    if (!author.trim()) {
      newErrors.author = 'Vui lòng nhập tên tác giả';
    }

    // Thể loại bắt buộc
    if (!category) {
      newErrors.category = 'Vui lòng chọn thể loại';
    }

    // Năm xuất bản: số hợp lệ từ 1900 đến năm hiện tại
    const yearNum = parseInt(year, 10);
    if (!year.trim() || isNaN(yearNum)) {
      newErrors.year = 'Vui lòng nhập năm xuất bản hợp lệ';
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Năm phải từ 1900 đến ${currentYear}`;
    }

    // Số lượng > 0
    const quantityNum = parseInt(quantity, 10);
    if (!quantity.trim() || isNaN(quantityNum)) {
      newErrors.quantity = 'Vui lòng nhập số lượng hợp lệ';
    } else if (quantityNum <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    } else if (isEditing && editingBook && quantityNum < editingBook.borrowed) {
      // Khi sửa, số lượng không được nhỏ hơn số cuốn đang mượn
      newErrors.quantity = `Số lượng không được nhỏ hơn ${editingBook.borrowed} (đang mượn)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Xử lý lưu sách (thêm hoặc sửa).
   */
  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const books = await getBooks();

      if (isEditing && editingBook) {
        // Sửa sách
        const updatedBooks = books.map((b) =>
          b.id === editingBook.id
            ? {
                ...b,
                title: title.trim(),
                author: author.trim(),
                category: category as Category,
                year: parseInt(year, 10),
                quantity: parseInt(quantity, 10),
              }
            : b
        );
        await saveBooks(updatedBooks);
      } else {
        // Thêm sách mới
        const newBook: Book = {
          id: Date.now().toString(),
          title: title.trim(),
          author: author.trim(),
          category: category as Category,
          year: parseInt(year, 10),
          quantity: parseInt(quantity, 10),
          borrowed: 0,
        };
        await saveBooks([...books, newBook]);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu sách. Vui lòng thử lại!');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>
          {isEditing ? '✏️ Sửa thông tin sách' : '📖 Thêm sách mới'}
        </Text>

        {/* Tên sách */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tên sách *</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Nhập tên sách"
            placeholderTextColor={Colors.textLight}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Tác giả */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tác giả *</Text>
          <TextInput
            style={[styles.input, errors.author && styles.inputError]}
            value={author}
            onChangeText={(t) => {
              setAuthor(t);
              if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
            }}
            placeholder="Nhập tên tác giả"
            placeholderTextColor={Colors.textLight}
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
        </View>

        {/* Thể loại */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Thể loại *</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryBtn, isActive && styles.categoryBtnActive, errors.category && !category && styles.categoryBtnError]}
                  onPress={() => {
                    setCategory(cat);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryBtnText, isActive && styles.categoryBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Năm xuất bản */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Năm xuất bản *</Text>
          <TextInput
            style={[styles.input, errors.year && styles.inputError]}
            value={year}
            onChangeText={(t) => {
              setYear(t);
              if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
            }}
            placeholder={`VD: ${currentYear}`}
            placeholderTextColor={Colors.textLight}
            keyboardType="number-pad"
            maxLength={4}
          />
          {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
        </View>

        {/* Số lượng */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Số lượng *{' '}
            {isEditing && editingBook && (
              <Text style={styles.hintText}>(đang mượn: {editingBook.borrowed})</Text>
            )}
          </Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.inputError]}
            value={quantity}
            onChangeText={(t) => {
              setQuantity(t);
              if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: undefined }));
            }}
            placeholder="Nhập số lượng"
            placeholderTextColor={Colors.textLight}
            keyboardType="number-pad"
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
        </View>

        {/* Nút Lưu */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? '💾 Cập nhật' : '💾 Thêm sách'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  formTitle: {
    ...Fonts.title,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Fonts.bodyBold,
    marginBottom: Spacing.sm,
  },
  hintText: {
    ...Fonts.caption,
    fontWeight: '400',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Fonts.body,
  },
  inputError: {
    borderColor: Colors.borderError,
    backgroundColor: Colors.dangerLight,
  },
  errorText: {
    ...Fonts.small,
    color: Colors.danger,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryBtnError: {
    borderColor: Colors.borderError,
  },
  categoryBtnText: {
    ...Fonts.caption,
    fontWeight: '600',
  },
  categoryBtnTextActive: {
    color: Colors.white,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadow.button,
  },
  saveButtonText: {
    ...Fonts.subtitle,
    color: Colors.white,
  },
});

export default BookFormScreen;
