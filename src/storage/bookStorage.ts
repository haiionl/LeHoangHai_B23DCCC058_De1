import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';
import { SAMPLE_BOOKS } from '../data/sampleBooks';

const STORAGE_KEY = '@library_books';

/**
 * Lấy danh sách sách từ AsyncStorage.
 * Nếu chưa có dữ liệu (lần đầu chạy), khởi tạo dữ liệu mẫu.
 */
export const getBooks = async (): Promise<Book[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    // Lần đầu tiên: lưu dữ liệu mẫu
    await saveBooks(SAMPLE_BOOKS);
    return SAMPLE_BOOKS;
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu:', error);
    return SAMPLE_BOOKS;
  }
};

/**
 * Lưu danh sách sách vào AsyncStorage.
 */
export const saveBooks = async (books: Book[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(books);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
  }
};
