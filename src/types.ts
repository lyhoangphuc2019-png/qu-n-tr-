export type CategoryType = 'Tất cả' | 'Món nước' | 'Món khô' | 'Cơm' | 'Món chay' | 'Món thêm';

export interface FoodItem {
  id: number;
  name: string;
  cat: string;
  price: number;
  emoji: string;
  desc: string;
  bg?: string;
  tag?: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CartItem extends FoodItem {
  qty: number;
}

export type PortalType = 'customer' | 'admin';

export type AdminTab =
  | 'overview'
  | 'kitchen'
  | 'orders'
  | 'menu'
  | 'customers'
  | 'vouchers'
  | 'reports'
  | 'settings';

export interface StoreConfig {
  storeName: string;
  orderCutoffTime: string;
  deliverySlots: string[];
  hotline: string;
  announcementText: string;
  isKitchenAcceptingOrders: boolean;
}

export type OrderStatus =
  | 'Chờ xác nhận'
  | 'Đã xác nhận'
  | 'Đang chuẩn bị'
  | 'Đang giao'
  | 'Đã giao'
  | 'Đã hủy'
  | 'Giao thất bại';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  badge: string;
  discountType: 'first_order' | 'group_order' | 'wednesday';
  percent: number;
  maxDiscount?: number;
  minQuantity?: number;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  day: string;
  time: string;
  note: string;
  payment: string;
  customerId: string | null;
  memberCode: string | null;
  packageId: string | null;
  packageCharge: number;
  packageQty: number;
  refundProcessed: boolean;
  items: CartItem[];
  subtotal: number;
  discount: number;
  voucherCode?: string | null;
  voucherDiscount?: number;
  foodTotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payStatus: string;
  created: string;
}

export interface Customer {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  avatar?: string;
}

export interface PackageCatalogItem {
  id: string;
  count: number;
  price: number;
  title: string;
  tag: string;
  desc: string;
  image: string;
}

export interface UserPackage {
  id: string;
  customerId: string;
  memberCode: string;
  title: string;
  count: number;
  used: number;
  price: number;
  balance: number;
  tag: string;
  datePurchased: string;
}

export type PageId =
  | 'home'
  | 'menu'
  | 'orders'
  | 'member'
  | 'account'
  | 'settings'
  | 'checkout'
  | 'admin';

export type Language = 'vi' | 'en';
