import { Book } from '../types';

// Dữ liệu mẫu 5 cuốn sách khởi tạo ban đầu
export const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Cấu trúc dữ liệu và giải thuật',
    author: 'Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2020,
    quantity: 10,
    borrowed: 3,
  },
  {
    id: '2',
    title: 'Đắc nhân tâm',
    author: 'Dale Carnegie',
    category: 'Tiểu thuyết',
    year: 2018,
    quantity: 5,
    borrowed: 2,
  },
  {
    id: '3',
    title: 'Lược sử thời gian',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2015,
    quantity: 3,
    borrowed: 0,
  },
  {
    id: '4',
    title: 'Harry Potter và hòn đá phù thuỷ',
    author: 'J.K. Rowling',
    category: 'Thiếu nhi',
    year: 2001,
    quantity: 7,
    borrowed: 5,
  },
  {
    id: '5',
    title: 'Mạng máy tính',
    author: 'Trần Văn B',
    category: 'Giáo trình',
    year: 2022,
    quantity: 4,
    borrowed: 4,
  },
];
