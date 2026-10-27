import { FoodItem, PackageCatalogItem, Voucher, CartItem } from '../types';

export const INITIAL_FOODS: FoodItem[] = [
  {
    id: 1,
    name: 'Cơm gà sốt tiêu',
    cat: 'Cơm',
    price: 55000,
    emoji: '🍗',
    desc: 'Gà đùi áp chảo sốt tiêu đen thơm nồng đậm đà, ăn kèm cơm trắng nóng hổi và dưa leo giòn mát.',
    bg: 'from-amber-100 to-amber-200',
    tag: 'BÁN CHẠY',
    imageUrl: '/assets/images/com_ga_sot_tieu_1793112548727.jpg',
  },
  {
    id: 2,
    name: 'Cơm sườn nướng mật ong',
    cat: 'Cơm',
    price: 59000,
    emoji: '🍖',
    desc: 'Sườn cốt lết nướng than hoa mật ong xém cạnh thơm phức, mỡ hành béo ngậy, cơm tấm dẻo và đồ chua.',
    bg: 'from-rose-100 to-rose-200',
    tag: 'ĐƯỢC YÊU THÍCH',
    imageUrl: '/assets/images/com_suon_nuong_1793112602742.jpg',
  },
  {
    id: 3,
    name: 'Cơm cá kho tộ đậm đà',
    cat: 'Cơm',
    price: 52000,
    emoji: '🐟',
    desc: 'Cá kho trong tộ đất chuẩn vị Nam Bộ, nước sốt kẹo sánh tiêu ớt cay the, cơm trắng và rau luộc thanh mát.',
    bg: 'from-emerald-100 to-emerald-200',
    tag: 'MÓN MỚI',
    imageUrl: '/assets/images/ca_kho_to_1793112646720.jpg',
  },
  {
    id: 4,
    name: 'Cơm gà xé lá chanh',
    cat: 'Cơm',
    price: 50000,
    emoji: '🍱',
    desc: 'Gà ta xé phay trộn lá chanh thơm lừng, hành tây ngâm chua ngọt, rau răm và cơm nghệ vàng ươm.',
    bg: 'from-cyan-100 to-cyan-200',
    tag: 'NHẸ NHÀNG',
    imageUrl: '/assets/images/com_ga_xe_1793112670730.jpg',
  },
  {
    id: 5,
    name: 'Cơm đậu hũ kho nấm đông cô',
    cat: 'Món chay',
    price: 45000,
    emoji: '🥦',
    desc: 'Đậu hũ chiên vàng kho nấm đông cô đậm vị tương truyền thống, ăn cùng cơm trắng và dưa leo rau thơm.',
    bg: 'from-green-100 to-green-200',
    tag: 'MÓN CHAY',
    imageUrl: '/assets/images/dau_hu_kho_nam_1793112686996.jpg',
  },
  {
    id: 6,
    name: 'Cơm bò xào lúc lắc khoai tây',
    cat: 'Cơm',
    price: 65000,
    emoji: '🥩',
    desc: 'Thịt bò xào mềm thơm bơ tỏi, ớt chuông hành tây, khoai tây chiên giòn rụm và cơm chiên tỏi.',
    bg: 'from-orange-100 to-orange-200',
    tag: 'ĐỦ NĂNG LƯỢNG',
    imageUrl: '/assets/images/bo_luc_lac_1793112709293.jpg',
  },
  {
    id: 7,
    name: 'Bún bò Huế giò chả',
    cat: 'Món nước',
    price: 60000,
    emoji: '🍜',
    desc: 'Nước dùng ninh xương đậm đà hương sả ruốc, thịt nạm bò mềm, khoanh giò heo, chả lụa và rau ghém tươi.',
    bg: 'from-amber-100 to-orange-100',
    tag: 'MÓN NƯỚC',
    imageUrl: '/assets/images/bun_bo_hue_1793112741274.jpg',
  },
  {
    id: 8,
    name: 'Mì xào giòn hải sản',
    cat: 'Món khô',
    price: 58000,
    emoji: '🍝',
    desc: 'Vắt mì chiên phồng giòn tan sốt tôm sú, mực tươi khía hoa, cải thìa, cà rốt và nấm đông cô nước sốt sánh bóng.',
    bg: 'from-yellow-100 to-amber-200',
    tag: 'ĐƯỢC YÊU THÍCH',
    imageUrl: '/assets/images/mi_xao_gion_1793112771893.jpg',
  },
  {
    id: 9,
    name: 'Canh rong biển thịt bằm thêm',
    cat: 'Món thêm',
    price: 15000,
    emoji: '🥣',
    desc: 'Bát canh nóng hổi với rong biển thanh mát, thịt bằm ngọt nước, đậu hũ non và rắc mè rang thơm lừng.',
    bg: 'from-emerald-50 to-teal-100',
    tag: 'MÓN THÊM',
    imageUrl: '/assets/images/canh_rong_bien_1793112796182.jpg',
  }
];

export const DEFAULT_PACKAGES: PackageCatalogItem[] = [
  {
    id: 'p5',
    count: 5,
    price: 275000,
    title: 'Gói 5 suất ăn',
    tag: 'LINH HOẠT',
    desc: 'Phù hợp lịch ăn trưa linh hoạt trong tuần. Tiết kiệm công đặt hàng mỗi ngày.',
    image: '/assets/images/com_ga_xe_1793112670730.jpg',
  },
  {
    id: 'p10',
    count: 10,
    price: 530000,
    title: 'Gói 10 suất ăn',
    tag: 'TIẾT KIỆM',
    desc: 'Dành cho khách hàng thường xuyên sử dụng, giảm sâu giá món ăn kèm ưu đãi giao.',
    image: '/assets/images/com_suon_nuong_1793112602742.jpg',
  },
  {
    id: 'p20',
    count: 20,
    price: 1040000,
    title: 'Gói 20 suất ăn',
    tag: 'DÀI HẠN',
    desc: 'Chủ động bữa trưa suốt cả tháng, chi phí tối ưu nhất và ưu tiên chế biến trước.',
    image: '/assets/images/bo_luc_lac_1793112709293.jpg',
  },
];

export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'TRUANGON',
    title: 'Trưa ngon – Giá hời',
    description: 'Giảm 20% cho đơn hàng đầu tiên, tối đa 30.000đ.',
    badge: 'ĐƠN ĐẦU TIÊN -20%',
    discountType: 'first_order',
    percent: 20,
    maxDiscount: 30000,
  },
  {
    id: 'v2',
    code: 'HOIANTRUA',
    title: 'Rủ hội ăn trưa – Deal thêm vui',
    description: 'Đặt từ 4 phần cơm trở lên giảm 5% tổng đơn hàng.',
    badge: 'ĐẶT TỪ 4 PHẦN -5%',
    discountType: 'group_order',
    percent: 5,
    minQuantity: 4,
  },
  {
    id: 'v3',
    code: 'THUTUVUIVE',
    title: 'Thứ Tư vui vẻ',
    description: 'Mỗi thứ Tư, chọn một số món ăn giảm giá 20% (Cơm gà sốt tiêu, Cơm sườn nướng, Cơm đậu hũ nấm).',
    badge: 'THỨ TƯ DEAL -20%',
    discountType: 'wednesday',
    percent: 20,
  },
];

export const WEDNESDAY_SPECIAL_DISH_IDS = [1, 2, 5];

export function isWednesday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() === 3; // 3 = Wednesday
}

export function checkVoucherEligibility(
  voucher: Voucher,
  cart: CartItem[],
  customerOrderCount: number,
  useDay: string
): { eligible: boolean; discount: number; reason?: string } {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const rawSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (voucher.discountType === 'first_order') {
    if (customerOrderCount > 0) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Chỉ áp dụng cho đơn hàng đầu tiên của bạn.',
      };
    }
    const calc = Math.round(rawSubtotal * 0.2);
    const capped = voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
    return {
      eligible: true,
      discount: capped,
    };
  }

  if (voucher.discountType === 'group_order') {
    if (totalQty < (voucher.minQuantity || 4)) {
      return {
        eligible: false,
        discount: 0,
        reason: `Cần đặt từ 4 phần cơm trở lên (hiện có ${totalQty} phần).`,
      };
    }
    const discount = Math.round(rawSubtotal * 0.05);
    return {
      eligible: true,
      discount,
    };
  }

  if (voucher.discountType === 'wednesday') {
    const isWed = isWednesday(useDay);
    if (!isWed) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Chỉ áp dụng cho đơn nhận cơm vào ngày Thứ Tư.',
      };
    }
    const wedItems = cart.filter((item) => WEDNESDAY_SPECIAL_DISH_IDS.includes(item.id));
    if (wedItems.length === 0) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Giỏ hàng chưa có món ưu đãi Thứ Tư (Cơm gà sốt tiêu, Cơm sườn nướng, Cơm đậu hũ nấm).',
      };
    }
    const wedSubtotal = wedItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = Math.round(wedSubtotal * 0.2);
    return {
      eligible: true,
      discount,
    };
  }

  return { eligible: false, discount: 0 };
}

export const FREE_SHIPPING_DISTRICTS = [
  'quận 1', 'q1',
  'quận 2', 'q2',
  'quận 3', 'q3',
  'quận 4', 'q4',
  'quận 5', 'q5',
  'quận 10', 'q10',
  'quận 12', 'q12',
  'bình thạnh',
  'gò vấp',
  'thủ đức',
  'tân bình',
  'tân phú'
];

export function getDayOptions(): { value: string; label: string; isWed: boolean; dateObj: Date }[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i + 3); // Announced 3 days in advance
    const value = d.toISOString().slice(0, 10);
    const isWed = d.getDay() === 3;
    const label = d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
    return { value, label, isWed, dateObj: d };
  });
}

export function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
}

export function calculateShipping(address: string): number {
  if (!address.trim()) return 0;
  const lower = address.toLowerCase();
  const isFree = FREE_SHIPPING_DISTRICTS.some((district) => lower.includes(district));
  return isFree ? 0 : 15000;
}

export const I18N = {
  vi: {
    home: 'Trang chủ',
    menu: 'Thực đơn',
    orders: 'Đơn hàng của tôi',
    member: 'Gói suất ăn',
    account: 'Tài khoản',
    settings: 'Cài đặt',
    checkout: 'Giỏ hàng',
    admin: 'Quản trị',
    brandTag: 'Trưa tới, ăn chưa?',
    heroEyebrow: 'Đặt trước thông minh · Giao nóng đúng giờ',
    heroTitle: 'Buổi trưa chưa tới,\ncơm đã tới rồi!',
    heroDesc: 'Chọn món yêu thích, đặt trước thật nhanh. Tới Trưa chuẩn bị vừa đủ và giao bữa trưa nóng hổi đến bạn đúng giờ.',
    exploreMenu: 'Khám phá thực đơn →',
    stat1Title: 'Trước 3 ngày',
    stat1Desc: 'Menu được công bố sớm',
    stat2Title: '09:00 – 11:30',
    stat2Desc: 'Khung giờ giao dự kiến',
    stat3Title: 'Chuẩn bị vừa đủ',
    stat3Desc: 'Hạn chế lãng phí thực phẩm',
    popularTitle: 'Món được yêu thích',
    popularDesc: 'Bữa trưa ngon miệng, giá cả hợp lý.',
    viewAll: 'Xem tất cả →',
    freeShippingNoticeTitle: 'Quy định phí giao hàng tại TP. Hồ Chí Minh',
    freeShippingNoticeHover: 'Miễn phí giao hàng tại: Bình Thạnh, TP. Thủ Đức, Gò Vấp, Quận 1, Quận 2, Quận 3, Quận 4, Quận 5, Quận 10, Quận 12, Tân Bình và Tân Phú. Các khu vực khác áp dụng phí giao hàng 15.000 ₫.',
  },
  en: {
    home: 'Home',
    menu: 'Menu',
    orders: 'My Orders',
    member: 'Meal Packages',
    account: 'Account',
    settings: 'Settings',
    checkout: 'Cart',
    admin: 'Admin',
    brandTag: 'Trưa tới, ăn chưa?',
    heroEyebrow: 'Smart Pre-order · On-time Delivery',
    heroTitle: 'Lunch arrives\nbefore noon!',
    heroDesc: 'Pick your favorite meal and pre-order in seconds. We cook with care and deliver warm meals on time.',
    exploreMenu: 'Explore Menu →',
    stat1Title: '3 Days Ahead',
    stat1Desc: 'Early announced weekly menu',
    stat2Title: '09:00 – 11:30',
    stat2Desc: 'Expected delivery window',
    stat3Title: 'Just-in-time Prep',
    stat3Desc: 'Zero food waste approach',
    popularTitle: 'Popular Dishes',
    popularDesc: 'Delicious lunches at friendly prices.',
    viewAll: 'View All →',
    freeShippingNoticeTitle: 'Shipping policy in Ho Chi Minh City',
    freeShippingNoticeHover: 'Free delivery in: Binh Thanh, Thu Duc City, Go Vap, Districts 1, 2, 3, 4, 5, 10, 12, Tan Binh and Tan Phu. Other districts have a 15,000 ₫ delivery fee.',
  },
};
