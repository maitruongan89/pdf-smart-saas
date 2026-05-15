/**
 * PDF Smart - Payment Configuration
 * Điền thông tin ngân hàng của bạn tại đây để nhận tiền
 */

export const PAYMENT_CONFIG = {
  bank: {
    id: "MB", // Mã ngân hàng (ví dụ: VCB, MB, ICB, ACB...)
    accountNumber: "0905012131", // Số tài khoản của bạn
    accountName: "MAI QUOC TRUONG AN", // Tên chủ tài khoản (viết hoa không dấu)
  },
  plans: [
    {
      id: "pro_monthly",
      name: "Gói Tháng",
      price: 199000,
      description: "Dành cho nhu cầu ngắn hạn",
    },
    {
      id: "pro_yearly",
      name: "Gói Năm (Ưu đãi)",
      price: 1490000,
      description: "Tiết kiệm 40% so với gói tháng",
      isPopular: true,
    }
  ],
  // Nội dung chuyển khoản mẫu: PDF [Số điện thoại]
  generateMessage: (phone: string) => `PDF SMART ${phone}`,
};
