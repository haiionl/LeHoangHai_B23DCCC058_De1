// Định nghĩa kiểu dữ liệu Sách
export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  quantity: number;
  borrowed: number;
}

export type Category = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

export const CATEGORIES: Category[] = ['Giáo trình', 'Tiểu thuyết', 'Khoa học', 'Thiếu nhi'];

// Stack Navigation param list
export type RootStackParamList = {
  BookList: undefined;
  BookForm: { book?: Book };
  BookDetail: { bookId: string };
};
