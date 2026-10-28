// Theme colors cho toàn bộ ứng dụng
export const Colors = {
  primary: '#2563EB',        // Xanh dương chính
  primaryDark: '#1D4ED8',    // Xanh dương đậm
  primaryLight: '#DBEAFE',   // Xanh dương nhạt
  secondary: '#059669',      // Xanh lá
  danger: '#DC2626',         // Đỏ
  dangerLight: '#FEE2E2',   // Đỏ nhạt
  warning: '#F59E0B',        // Vàng cam
  warningLight: '#FEF3C7',  // Vàng nhạt

  white: '#FFFFFF',
  background: '#F1F5F9',     // Nền xám nhạt
  card: '#FFFFFF',           // Nền card
  text: '#1E293B',           // Chữ chính
  textSecondary: '#64748B',  // Chữ phụ
  textLight: '#94A3B8',      // Chữ rất nhạt
  border: '#E2E8F0',         // Viền
  borderFocus: '#2563EB',    // Viền khi focus
  borderError: '#DC2626',    // Viền lỗi
  disabled: '#CBD5E1',       // Màu disabled
  disabledBg: '#F1F5F9',    // Nền disabled
  shadow: '#000000',         // Bóng

  categoryGiaotrinh: '#7C3AED',
  categoryTieuthuyet: '#DB2777',
  categoryKhoahoc: '#0891B2',
  categoryThieunhi: '#EA580C',
};

export const Fonts = {
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
};
