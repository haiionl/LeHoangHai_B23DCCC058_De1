# Hướng dẫn `src/` và bài tập chỉnh sửa ứng dụng Quản lý Thư viện

Tài liệu này giải thích vai trò từng file trong `src/`, các đoạn code cốt lõi và những yêu cầu chỉnh sửa đơn giản thường gặp khi thuyết trình/thực hành. Ví dụ dựa trên cấu trúc hiện tại của dự án.

## 1. Cấu trúc `src/`

```text
src/
├── components/
│   ├── BookCard.tsx        # Thẻ hiển thị một cuốn sách
│   ├── CategoryFilter.tsx  # Các nút lọc thể loại
│   ├── EmptyList.tsx       # Giao diện khi danh sách trống
│   └── SearchBar.tsx       # Ô tìm kiếm
├── data/
│   └── sampleBooks.ts      # Dữ liệu sách mẫu
├── screens/
│   ├── BookDetailScreen.tsx # Chi tiết, mượn và trả sách
│   ├── BookFormScreen.tsx   # Form thêm/sửa sách
│   └── BookListScreen.tsx   # Danh sách, tìm kiếm, lọc và xóa
├── storage/
│   └── bookStorage.ts      # Đọc/ghi dữ liệu AsyncStorage
├── theme/
│   └── colors.ts           # Màu, font, khoảng cách, bo góc, bóng
└── types/
    └── index.ts            # Kiểu Book, Category và tham số màn hình
```

## 2. Chức năng và code chính của từng file

### `types/index.ts` — kiểu dữ liệu dùng chung

Khai báo cấu trúc một quyển sách để TypeScript kiểm tra dữ liệu:

```ts
export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  year: number;
  quantity: number;
  borrowed: number;
}
```

`quantity` là tổng số cuốn, `borrowed` là số đang được mượn, số còn lại tính bằng `quantity - borrowed`. `Category` giới hạn thể loại vào bốn giá trị đã khai báo. `CATEGORIES` được form và bộ lọc dùng để tạo nút thể loại. `RootStackParamList` mô tả dữ liệu truyền giữa các màn hình: `BookDetail` nhận `bookId`, `BookForm` có thể nhận `book` khi sửa.

### `data/sampleBooks.ts` — sách khởi tạo

File xuất `SAMPLE_BOOKS: Book[]`, hiện có năm quyển. Mỗi phần tử phải có đủ các thuộc tính trong `Book`. Muốn đổi dữ liệu mẫu, sửa `title`, `author`, `category`, `year`, `quantity`, `borrowed` tại đây.

Lưu ý: sửa file này chỉ ảnh hưởng dữ liệu được khởi tạo cho người dùng chưa có dữ liệu lưu. Người đã chạy app trước đó thường đã có danh sách trong AsyncStorage, nên sửa `sampleBooks.ts` sẽ không tự thay dữ liệu cũ. Xem mục 3.3 để kiểm tra dữ liệu khởi tạo.

### `storage/bookStorage.ts` — lưu trữ local

File dùng `@react-native-async-storage/async-storage` với khóa `@library_books`.

- `getBooks()` đọc JSON từ thiết bị; nếu chưa có dữ liệu, hiện tại lưu và trả về `SAMPLE_BOOKS`.
- `saveBooks(books)` chuyển mảng thành JSON và ghi lại.
- `try/catch` bắt lỗi đọc/ghi và ghi lỗi ra console.

Đây là nơi cần chỉnh nếu đề yêu cầu lần đầu chạy app để danh sách trống thay vì có sách mẫu.

### `screens/BookListScreen.tsx` — màn hình chính

Quản lý state của danh sách sách, nội dung tìm kiếm và thể loại đang lọc. `useFocusEffect` gọi tải dữ liệu khi màn hình được mở/quay lại. `useMemo` kết hợp lọc thể loại với tìm kiếm tên sách/tác giả. `FlatList` hiển thị kết quả.

Các thao tác chính:

- Nút `+ Thêm sách` điều hướng sang `BookForm`.
- Nhấn một `BookCard` điều hướng sang `BookDetail`.
- `handleDeleteBook(book)` hỏi xác nhận, không cho xóa sách đang có người mượn, sau đó cập nhật AsyncStorage.
- `totalBooks` và `totalBorrowed` tạo hai ô thống kê.

Đây thường là file cần sửa nếu đề yêu cầu thay chữ trên màn danh sách, thêm nút, đổi thống kê hoặc cách xóa.

### `screens/BookFormScreen.tsx` — thêm và sửa

Một form dùng cho cả hai trường hợp. `route.params?.book` có dữ liệu thì form sửa; không có thì form thêm. Các `useState` giữ nội dung ô nhập. `validate()` kiểm tra tên, tác giả, thể loại, năm xuất bản và số lượng. Khi lưu:

- Sửa: dùng `map()` thay sách có cùng `id`, giữ các trường khác bằng `...b`.
- Thêm: tạo `id` bằng `Date.now().toString()`, đặt `borrowed: 0`, rồi thêm vào mảng.
- Cả hai trường hợp gọi `saveBooks()` và quay lại màn hình trước.

Nếu đổi các trường của sách, cập nhật đồng bộ `Book` trong `types/index.ts`, form, dữ liệu mẫu và nơi hiển thị.

### `screens/BookDetailScreen.tsx` — chi tiết/mượn/trả

Nhận `bookId`, tải sách từ `getBooks()` và tìm bằng `find()`. Nếu không tìm thấy thì báo lỗi. Màn hình hiển thị thông tin và số còn lại. `handleBorrow()` tăng `borrowed` một đơn vị nếu còn sách; `handleReturn()` giảm một đơn vị nếu đang có sách được mượn. Sau thao tác, file lưu danh sách và cập nhật state để giao diện đổi ngay.

### `components/BookCard.tsx` — thẻ sách

Nhận dữ liệu `book` và callback tương tác từ màn danh sách. Card hiển thị tên, tác giả, thể loại, năm và số còn. Màu thể loại được chọn trong `getCategoryColor()`. Đây là nơi chỉnh cách trình bày từng sách hoặc thêm nút thao tác riêng trên mỗi thẻ.

### `components/SearchBar.tsx` — ô tìm kiếm

Component con nhận `value` và `onChangeText` từ màn cha. Nó chỉ hiển thị ô nhập và gửi nội dung mới lên; phần tìm kiếm thực tế nằm trong `BookListScreen.tsx`.

### `components/CategoryFilter.tsx` — lọc thể loại

Tạo chip “Tất cả” và các chip còn lại từ `CATEGORIES`. Khi người dùng chạm chip, gọi `onSelect(category)` để màn cha cập nhật state. `null` đại diện cho “Tất cả”.

### `components/EmptyList.tsx` — trạng thái danh sách trống

Hiển thị biểu tượng, thông báo và gợi ý thêm sách. Màn danh sách truyền `message` khác nhau tùy trường hợp: chưa có sách hay không tìm thấy sách khớp. Muốn đổi thông báo/gợi ý thì sửa file này hoặc chỗ truyền `message` trong `BookListScreen.tsx`.

### `theme/colors.ts` — giao diện dùng chung

- `Colors`: màu chủ đạo, nền, chữ, cảnh báo, màu thể loại.
- `Fonts`: các kiểu chữ tiêu đề, nội dung, chú thích.
- `Spacing`: khoảng cách chuẩn.
- `BorderRadius`: độ bo góc.
- `Shadow`: bóng cho card/nút.

Các màn hình và component import các hằng số này để giao diện thống nhất. Thường chỉ cần sửa một giá trị trong theme để thay đổi màu ở nhiều nơi.

## 3. Các yêu cầu mẫu của thầy và cách làm

### 3.1 Đổi màu chủ đạo của app

Mở `src/theme/colors.ts`, sửa `Colors.primary` và các màu đi cùng nếu cần. Ví dụ đổi xanh dương thành tím:

```ts
primary: '#7C3AED',
primaryDark: '#6D28D9',
primaryLight: '#EDE9FE',
```

Kiểm tra màn hình danh sách, header điều hướng, nút lưu và chip đang chọn. Những chỗ dùng `Colors.primary` sẽ tự đổi. Một số màu có thể đang viết trực tiếp (ví dụ màu trạng thái trong `BookDetailScreen.tsx`); nếu muốn đồng nhất, chuyển chúng thành hằng số trong `Colors` rồi thay chỗ dùng.

### 3.2 Đổi chữ hoặc kiểu chữ

- Đổi nội dung nút/tiêu đề: tìm chuỗi tiếng Việt trong file màn hình hoặc component, ví dụ `BookListScreen.tsx`, `BookFormScreen.tsx`, `BookDetailScreen.tsx`.
- Đổi kiểu chữ dùng chung: sửa `Fonts.title`, `Fonts.body`, `Fonts.subtitle` trong `theme/colors.ts`.
- Đổi kích thước khoảng cách: sửa `Spacing` trong cùng file.

Ví dụ tăng cỡ tiêu đề chung:

```ts
title: {
  fontSize: 26,
  fontWeight: '700' as const,
  color: Colors.text,
},
```

### 3.3 Đổi sách mẫu lần đầu chạy app

Sửa mảng trong `src/data/sampleBooks.ts`. Đảm bảo thể loại đúng một trong các giá trị của `Category` và số `borrowed` không lớn hơn `quantity`.

Để kiểm tra dữ liệu khởi tạo mới, cần xóa dữ liệu app đang lưu hoặc gỡ ứng dụng rồi cài lại. Gỡ app sẽ xóa dữ liệu local. Nếu không muốn gỡ app, có thể thêm tạm nút reset có xác nhận gọi `saveBooks(SAMPLE_BOOKS)`; xóa nút reset sau khi kiểm tra. Không nên nghĩ rằng sửa `sampleBooks.ts` tự ghi đè dữ liệu đã lưu.

### 3.4 Muốn không có sách khi cài/chạy lần đầu

Trong `src/storage/bookStorage.ts`, bỏ import dữ liệu mẫu:

```ts
// Xóa dòng này:
// import { SAMPLE_BOOKS } from '../data/sampleBooks';
```

Đổi nhánh chưa có dữ liệu trong `getBooks()` thành:

```ts
if (jsonValue !== null) {
  return JSON.parse(jsonValue);
}
return [];
```

Không gọi `saveBooks(SAMPLE_BOOKS)` nữa. Giữ nguyên `BookListScreen.tsx`: khi mảng rỗng, `EmptyList` sẽ hiển thị “Chưa có sách nào” và nút thêm sách vẫn hoạt động. Để xác nhận đúng lần đầu, xóa dữ liệu app cũ/gỡ cài đặt trước khi chạy lại.

### 3.5 Thêm nút xóa sách, không cần nhấn giữ

Logic xóa đã có trong `BookListScreen.tsx` ở `handleDeleteBook()`. Hiện `BookCard` gọi hàm này qua `onLongPress`; cần đổi giao diện để có nút xóa nhìn thấy được.

Cách sửa:

1. Trong `BookListScreen.tsx`, truyền callback xóa cho card, ví dụ:

```tsx
<BookCard
  book={item}
  onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
  onDeletePress={() => handleDeleteBook(item)}
/>
```

2. Trong `BookCard.tsx`, đổi props `onLongPress` thành `onDeletePress`.
3. Vì không nên lồng một `TouchableOpacity` xóa bên trong `TouchableOpacity` bọc toàn bộ card, đổi cấu trúc ngoài thành `View`. Đặt một `TouchableOpacity` riêng cho vùng thông tin (gọi `onPress`) và một nút xóa bên cạnh (gọi `onDeletePress`). Ví dụ cấu trúc JSX:

```tsx
<View style={styles.card}>
  <View style={styles.cardContent}>
    <TouchableOpacity style={styles.info} onPress={onPress}>
      {/* tên sách, tác giả, thể loại, năm */}
    </TouchableOpacity>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Xóa sách ${book.title}`}
      onPress={onDeletePress}
    >
      <Text>🗑️</Text>
    </TouchableOpacity>
    {/* phần hiển thị số lượng còn */}
  </View>
</View>
```

Đảm bảo khai báo `onDeletePress: () => void` trong `BookCardProps`, import `View`/`TouchableOpacity`/`Text` nếu cần, và giữ `handleDeleteBook()` để xác nhận trước khi xóa. Nên đặt nút xóa dễ nhìn nhưng tránh bấm nhầm; hộp thoại xác nhận hiện có sẽ bảo vệ người dùng. Nếu bố cục bị chật, đặt nút xóa cạnh số lượng hoặc ở góc card.

### 3.6 Đổi thông báo khi danh sách rỗng

Trong `BookListScreen.tsx`, `ListEmptyComponent` truyền nội dung cho `EmptyList`. Đổi các chuỗi “Không tìm thấy sách phù hợp” hoặc “Chưa có sách nào” tại đây. Đổi dòng gợi ý “Nhấn + Thêm sách...” trong `components/EmptyList.tsx`.

### 3.7 Thêm một thể loại mới

1. Thêm giá trị vào union `Category` và mảng `CATEGORIES` trong `types/index.ts`.
2. Nếu muốn màu riêng, thêm thuộc tính màu trong `Colors` ở `theme/colors.ts`.
3. Bổ sung `case` tương ứng trong `getCategoryColor()` ở `BookCard.tsx` và `BookDetailScreen.tsx`.
4. Kiểm tra form và bộ lọc vì chúng tạo nút từ `CATEGORIES`, nên sẽ tự xuất hiện thể loại mới.

### 3.8 Đổi quy tắc kiểm tra năm/số lượng

Sửa hàm `validate()` trong `screens/BookFormScreen.tsx`. Ví dụ đổi năm tối thiểu: thay `1900` trong điều kiện kiểm tra và trong thông báo lỗi. Nếu thay quy tắc số lượng, nhớ giữ điều kiện số lượng không được thấp hơn số cuốn đang mượn.

## 4. Câu hỏi thầy có thể hỏi kèm câu trả lời ngắn

**Hỏi: Dữ liệu sách được lưu ở đâu?**  
Trong `storage/bookStorage.ts`, bằng AsyncStorage trên thiết bị, với key `@library_books`.

**Hỏi: Tại sao sửa sách mẫu mà app không đổi?**  
Vì `getBooks()` ưu tiên dữ liệu đã lưu. `SAMPLE_BOOKS` chỉ dùng khi key chưa có; cần xóa dữ liệu app hoặc reset bộ nhớ để thử lại.

**Hỏi: Tìm kiếm được thực hiện ở đâu?**  
`SearchBar` chỉ nhận và gửi nội dung. `BookListScreen.tsx` lọc `books` theo tên/tác giả và thể loại.

**Hỏi: Vì sao không xóa được một số sách?**  
`handleDeleteBook()` chặn xóa khi `borrowed > 0`, để không xóa sách vẫn đang được mượn.

**Hỏi: Làm sao biết form đang thêm hay sửa?**  
Kiểm tra `route.params?.book`. Có sách thì form sửa và cập nhật sách cùng `id`; không có thì tạo sách mới.

**Hỏi: Số sách còn lại tính thế nào?**  
`quantity - borrowed`.

**Hỏi: Muốn đổi màu chung cần sửa ở đâu?**  
`src/theme/colors.ts`, trong object `Colors`. Nếu một màn hình vẫn giữ màu cũ, kiểm tra xem có màu viết trực tiếp trong style không.

## 5. Cách chạy và tự kiểm tra sau khi chỉnh

Tại thư mục gốc dự án:

```bash
npm install
npm start
```

Mở terminal khác để chạy Android hoặc iOS:

```bash
npm run android
# hoặc
npm run ios
```

Kiểm tra code:

```bash
npm run lint
npm test
```

Sau mỗi thay đổi, thử đúng luồng liên quan: thêm sách, tìm kiếm, lọc thể loại, sửa, mượn/trả và xóa. Khi kiểm tra sách khởi tạo lần đầu, nhớ xóa dữ liệu app cũ trước.
