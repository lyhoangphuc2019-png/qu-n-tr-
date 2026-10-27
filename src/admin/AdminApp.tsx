import React, { useState, useMemo } from 'react';
import {
  AdminTab,
  FoodItem,
  Order,
  OrderStatus,
  UserPackage,
  Customer,
  Voucher,
  StoreConfig,
  CartItem,
} from '../types';
import { formatVND, getDayOptions } from '../data/initialData';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminLogin } from './components/AdminLogin';
import {
  Download,
  CookingPot,
  ShoppingBag,
  Clock,
  DollarSign,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Search,
  Printer,
  Eye,
  Plus,
  Trash2,
  Edit2,
  X,
  BarChart3,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminAppProps {
  foods: FoodItem[];
  orders: Order[];
  customers: Customer[];
  packages: UserPackage[];
  vouchers: Voucher[];
  storeConfig: StoreConfig;
  onAddFood: (newFood: Omit<FoodItem, 'id'>) => void;
  onUpdateFood: (foodId: number, patch: Partial<FoodItem>) => void;
  onRemoveFood: (foodId: number) => void;
  onToggleFoodAvailability: (foodId: number) => void;
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCancelOrder: (orderId: string) => { success: boolean; message: string };
  onUpdatePackageBalance: (pkgId: string, deltaBalance: number, deltaCount: number) => void;
  onAddPackage: (pkg: UserPackage) => void;
  onAddVoucher: (voucher: Voucher) => void;
  onRemoveVoucher: (id: string) => void;
  onUpdateStoreConfig: (config: Partial<StoreConfig>) => void;
  onToast: (msg: string) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  foods,
  orders,
  customers,
  packages,
  vouchers,
  storeConfig,
  onAddFood,
  onUpdateFood,
  onRemoveFood,
  onToggleFoodAvailability,
  onAddOrder,
  onUpdateOrderStatus,
  onCancelOrder,
  onUpdatePackageBalance,
  onAddPackage,
  onAddVoucher,
  onRemoveVoucher,
  onUpdateStoreConfig,
  onToast,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tt_admin_authenticated') === 'yes';
  });

  // Active Tab
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Filter & Search
  const [searchOrder, setSearchOrder] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  // Kitchen States
  const dayOptions = getDayOptions();
  const [kitchenDay, setKitchenDay] = useState<string>(dayOptions[0].value);
  const [cookedItems, setCookedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('tt_cooked_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Quick POS / Create Order Modal State
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posCustomerAddress, setPosCustomerAddress] = useState('');
  const [posOrderDay, setPosOrderDay] = useState(dayOptions[0].value);
  const [posOrderTime, setPosOrderTime] = useState('11:00 - 11:30');
  const [posOrderNote, setPosOrderNote] = useState('');
  const [posPayment, setPosPayment] = useState('Tiền mặt khi nhận (COD)');
  const [posSelectedItems, setPosSelectedItems] = useState<Record<number, number>>({});

  // Food Modal
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formCat, setFormCat] = useState('Cơm');
  const [formPrice, setFormPrice] = useState('55000');
  const [formEmoji, setFormEmoji] = useState('🍱');
  const [formDesc, setFormDesc] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formImg, setFormImg] = useState('/assets/images/com_ga_sot_tieu_1793112548727.jpg');

  // Inspect Order Modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  // Topup Customer Modal
  const [topupCust, setTopupCust] = useState<Customer | null>(null);
  const [topupMeals, setTopupMeals] = useState('5');
  const [topupMoney, setTopupMoney] = useState('275000');

  // New Voucher Form
  const [vCode, setVCode] = useState('');
  const [vTitle, setVTitle] = useState('');
  const [vPercent, setVPercent] = useState('10');
  const [vDesc, setVDesc] = useState('');

  // Local config edit
  const [cfgStoreName, setCfgStoreName] = useState(storeConfig.storeName);
  const [cfgCutoff, setCfgCutoff] = useState(storeConfig.orderCutoffTime);
  const [cfgHotline, setCfgHotline] = useState(storeConfig.hotline);
  const [cfgNotice, setCfgNotice] = useState(storeConfig.announcementText);
  const [newAdminPin, setNewAdminPin] = useState('');

  // Metrics
  const completedOrders = useMemo(() => orders.filter((o) => o.status === 'Đã giao'), [orders]);
  const activeOrders = useMemo(
    () => orders.filter((o) => !['Đã hủy', 'Đã giao'].includes(o.status)),
    [orders]
  );
  const totalRevenue = useMemo(
    () => completedOrders.reduce((s, o) => s + (Number(o.total) || 0), 0),
    [completedOrders]
  );
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'Chờ xác nhận'),
    [orders]
  );
  const cancelledOrders = useMemo(
    () => orders.filter((o) => o.status === 'Đã hủy'),
    [orders]
  );

  // Kitchen Aggregation
  const kitchenOrders = useMemo(() => {
    return orders.filter((o) => o.day === kitchenDay && o.status !== 'Đã hủy');
  }, [orders, kitchenDay]);

  const kitchenPortionsMap = useMemo(() => {
    const map: Record<string, { count: number; cat: string; emoji: string }> = {};
    kitchenOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { count: 0, cat: item.cat, emoji: item.emoji };
        }
        map[item.name].count += item.qty;
      });
    });
    return map;
  }, [kitchenOrders]);

  const toggleCooked = (name: string) => {
    const key = `${kitchenDay}_${name}`;
    const next = { ...cookedItems, [key]: !cookedItems[key] };
    setCookedItems(next);
    localStorage.setItem('tt_cooked_items', JSON.stringify(next));
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (filterDate !== 'all' && o.day !== filterDate) return false;
      if (searchOrder.trim()) {
        const q = searchOrder.toLowerCase();
        const m1 = o.id.toLowerCase().includes(q);
        const m2 = o.name.toLowerCase().includes(q);
        const m3 = o.phone.toLowerCase().includes(q);
        const m4 = o.address.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });
  }, [orders, filterStatus, filterDate, searchOrder]);

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Mã đơn', 'Khách hàng', 'SĐT', 'Ngày dùng', 'Khung giờ', 'Địa chỉ', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Chi tiết món'],
      ...orders.map((o) => [
        o.id,
        o.name,
        o.phone,
        o.day,
        o.time,
        o.address,
        o.total,
        o.status,
        o.payStatus,
        o.items.map((i) => `${i.name} (x${i.qty})`).join('; '),
      ]),
    ];

    const csvContent =
      '\ufeff' +
      rows
        .map((row) =>
          row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-toi-trua-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Đã xuất báo cáo CSV thành công!');
  };

  // Save Food
  const handleSaveFoodForm = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formPrice);
    if (!formName.trim() || isNaN(price) || price < 1000) {
      onToast('Vui lòng nhập tên món và giá bán hợp lệ!');
      return;
    }

    if (editingFoodId) {
      onUpdateFood(editingFoodId, {
        name: formName.trim(),
        cat: formCat,
        price,
        emoji: formEmoji.trim() || '🍱',
        desc: formDesc.trim(),
        tag: formTag.trim() || undefined,
        imageUrl: formImg,
      });
      onToast(`Đã lưu thay đổi món "${formName}"`);
      setEditingFoodId(null);
    } else {
      onAddFood({
        name: formName.trim(),
        cat: formCat,
        price,
        emoji: formEmoji.trim() || '🍱',
        desc: formDesc.trim() || 'Bữa trưa tươi ngon, dinh dưỡng.',
        tag: formTag.trim() || 'MỚI',
        imageUrl: formImg,
        isAvailable: true,
      });
      onToast(`Đã thêm món mới "${formName}" vào thực đơn!`);
    }

    setShowFoodModal(false);
  };

  // Create Voucher
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vCode.trim()) return;
    const item: Voucher = {
      id: 'v_' + Date.now(),
      code: vCode.trim().toUpperCase(),
      title: vTitle.trim() || `Ưu đãi ${vPercent}%`,
      description: vDesc.trim() || `Giảm ${vPercent}% cho đơn hàng`,
      badge: `-${vPercent}%`,
      discountType: 'group_order',
      percent: Number(vPercent) || 10,
    };
    onAddVoucher(item);
    setVCode('');
    setVTitle('');
    setVDesc('');
    onToast(`Đã tạo mã giảm giá "${item.code}"!`);
  };

  // Create Manual POS Order
  const handleCreatePOSOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posCustomerName.trim() || !posCustomerPhone.trim()) {
      onToast('Vui lòng nhập họ tên và số điện thoại khách hàng!');
      return;
    }

    const cartItems: CartItem[] = Object.entries(posSelectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([foodId, qty]) => {
        const food = foods.find((f) => f.id === Number(foodId))!;
        return { ...food, qty };
      });

    if (cartItems.length === 0) {
      onToast('Vui lòng chọn ít nhất 1 món ăn cho đơn hàng!');
      return;
    }

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = 0; // POS / in-store / local
    const total = subtotal + shipping;

    const newOrder: Order = {
      id: 'POS' + Date.now().toString().slice(-6),
      name: posCustomerName.trim(),
      phone: posCustomerPhone.trim(),
      address: posCustomerAddress.trim() || 'Nhận tại quầy bếp',
      day: posOrderDay,
      time: posOrderTime,
      note: posOrderNote.trim() ? `[Đơn POS] ${posOrderNote.trim()}` : '[Đơn tạo tại quầy/điện thoại]',
      payment: posPayment,
      customerId: null,
      memberCode: null,
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: cartItems,
      subtotal,
      discount: 0,
      foodTotal: subtotal,
      shipping,
      total,
      status: 'Đã xác nhận',
      payStatus: posPayment.includes('COD') ? 'Chưa thanh toán (COD)' : 'Đã thanh toán',
      created: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddOrder(newOrder);
    onToast(`Đã tạo đơn hàng thành công #${newOrder.id}!`);

    // Reset Form
    setPosCustomerName('');
    setPosCustomerPhone('');
    setPosCustomerAddress('');
    setPosOrderNote('');
    setPosSelectedItems({});
    setShowCreateOrderModal(false);
  };

  // Topup Package
  const handleConfirmTopup = () => {
    if (!topupCust) return;
    const meals = Number(topupMeals) || 0;
    const money = Number(topupMoney) || 0;

    const existing = packages.find(
      (p) => p.customerId === topupCust.id || p.memberCode === topupCust.memberCode
    );

    if (existing) {
      onUpdatePackageBalance(existing.id, money, meals);
      onToast(`Đã nạp ${meals} suất ăn (+${formatVND(money)}) cho thành viên ${topupCust.name}!`);
    } else {
      const newPkg: UserPackage = {
        id: 'GOI' + Date.now().toString().slice(-5),
        customerId: topupCust.id,
        memberCode: topupCust.memberCode,
        title: `Gói nạp thẻ ăn (${meals} suất)`,
        count: meals,
        used: 0,
        price: money,
        balance: money,
        tag: 'NẠP QUẢN TRỊ',
        datePurchased: new Date().toLocaleDateString('vi-VN'),
      };
      onAddPackage(newPkg);
      onToast(`Đã mở thẻ ăn mới ${meals} suất cho ${topupCust.name}!`);
    }
    setTopupCust(null);
  };

  // Save Config & PIN
  const handleSaveConfig = () => {
    if (newAdminPin.trim()) {
      localStorage.setItem('tt_admin_pin', newAdminPin.trim());
      onToast(`Đã cập nhật mã PIN quản trị mới: ${newAdminPin.trim()}`);
      setNewAdminPin('');
    }
    onUpdateStoreConfig({
      storeName: cfgStoreName,
      orderCutoffTime: cfgCutoff,
      hotline: cfgHotline,
      announcementText: cfgNotice,
    });
    onToast('Đã lưu cấu hình cửa hàng & bếp thành công!');
  };

  // If not logged in
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          setIsAuthenticated(true);
          onToast('Đăng nhập Quản trị viên thành công!');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1714] text-[#e3ece7] flex flex-col font-sans selection:bg-[#0e563f] selection:text-[#a7f3d0]">
      {/* Dedicated Admin Header */}
      <AdminHeader
        activeOrderCount={activeOrders.length}
        todayKitchenPortions={kitchenOrders.reduce(
          (s, o) => s + o.items.reduce((a, b) => a + b.qty, 0),
          0
        )}
        onOpenCreateOrderModal={() => setShowCreateOrderModal(true)}
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem('tt_admin_authenticated');
          onToast('Đã khóa phiên Quản trị.');
        }}
      />

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingOrderCount={pendingOrders.length}
          kitchenOrderCount={kitchenOrders.length}
        />

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ======================================================== */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Bảng Điều Khiển Tổng Quan
                  </h2>
                  <p className="text-xs text-[#8ea79b] mt-0.5">
                    Số liệu thực tế đơn hàng, doanh thu và suất cơm phục vụ thời gian thực.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl bg-[#172c23] hover:bg-[#203c30] text-[#c2d7cc] hover:text-white font-bold text-xs flex items-center gap-2 border border-[#213f32] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Xuất CSV</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('kitchen')}
                    className="px-3.5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CookingPot className="w-3.5 h-3.5 text-[#fed7aa]" />
                    <span>Vào Bếp Nấu ({kitchenOrders.length} đơn)</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#14261f] p-5 rounded-2xl border border-[#213f32]">
                  <div className="flex items-center justify-between text-xs text-[#8ea79b] font-bold mb-2">
                    <span>Tổng đơn hàng</span>
                    <ShoppingBag className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <strong className="text-2xl font-black text-white">{orders.length}</strong>
                  <div className="text-[11px] text-[#6b897b] mt-1">Đơn đặt trong hệ thống</div>
                </div>

                <div className="bg-[#14261f] p-5 rounded-2xl border border-[#213f32]">
                  <div className="flex items-center justify-between text-xs text-[#8ea79b] font-bold mb-2">
                    <span>Đơn cần xử lý</span>
                    <Clock className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <strong className="text-2xl font-black text-[#38bdf8]">{activeOrders.length}</strong>
                  <div className="text-[11px] text-[#6b897b] mt-1">Đang nấu hoặc đang giao</div>
                </div>

                <div className="bg-[#14261f] p-5 rounded-2xl border border-[#213f32]">
                  <div className="flex items-center justify-between text-xs text-[#8ea79b] font-bold mb-2">
                    <span>Doanh thu hoàn tất</span>
                    <DollarSign className="w-4 h-4 text-[#34d399]" />
                  </div>
                  <strong className="text-xl font-black text-[#34d399]">{formatVND(totalRevenue)}</strong>
                  <div className="text-[11px] text-[#6b897b] mt-1">{completedOrders.length} đơn đã giao thành công</div>
                </div>

                <div className="bg-[#14261f] p-5 rounded-2xl border border-[#213f32]">
                  <div className="flex items-center justify-between text-xs text-[#8ea79b] font-bold mb-2">
                    <span>Gói thẻ ăn đã bán</span>
                    <CreditCard className="w-4 h-4 text-[#e879f9]" />
                  </div>
                  <strong className="text-2xl font-black text-white">{packages.length}</strong>
                  <div className="text-[11px] text-[#6b897b] mt-1">Thành viên nạp gói</div>
                </div>
              </div>

              {/* Alert if pending */}
              {pendingOrders.length > 0 && (
                <div className="bg-[#292011] border border-[#593d14] rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#593d14] flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#fed7aa]">
                        Có {pendingOrders.length} đơn hàng mới đang chờ xác nhận!
                      </h4>
                      <p className="text-xs text-[#d9a86a] mt-0.5">
                        Xác nhận sớm để chuyển vào danh sách nấu của bếp kịp giờ giao trưa.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilterStatus('Chờ xác nhận');
                      setCurrentTab('orders');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs cursor-pointer shrink-0"
                  >
                    Xử lý ngay →
                  </button>
                </div>
              )}

              {/* Recent Orders + Top Dishes */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
                <div className="bg-[#14261f] rounded-2xl p-5 border border-[#213f32] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#f59e0b]" />
                      <span>Đơn hàng đặt gần đây</span>
                    </h3>
                    <button
                      onClick={() => setCurrentTab('orders')}
                      className="text-xs text-[#34d399] hover:underline font-bold cursor-pointer"
                    >
                      Xem tất cả ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#739283]">
                      Chưa có đơn hàng nào được ghi nhận. Bạn có thể bấm "+ Tạo Đơn Nhanh" phía trên.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#1d382c]">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <div className="font-extrabold text-white flex items-center gap-2">
                              <span>#{ord.id}</span>
                              <span className="text-[#8ea79b] font-normal">• {ord.name} ({ord.phone})</span>
                            </div>
                            <div className="text-[#739283] truncate mt-0.5">
                              Ngày: {ord.day} ({ord.time}) • {ord.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-[#34d399]">{formatVND(ord.total)}</div>
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                                ord.status === 'Đã giao'
                                  ? 'bg-[#103827] text-[#34d399]'
                                  : ord.status === 'Đã hủy'
                                  ? 'bg-[#3b1c1c] text-[#f87171]'
                                  : 'bg-[#332512] text-[#f59e0b]'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Dishes */}
                <div className="bg-[#14261f] rounded-2xl p-5 border border-[#213f32] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#34d399]" />
                      <span>Thực đơn nổi bật</span>
                    </h3>
                    <button
                      onClick={() => setCurrentTab('menu')}
                      className="text-xs text-[#34d399] hover:underline font-bold cursor-pointer"
                    >
                      Chỉnh sửa menu →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {foods.slice(0, 5).map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#172c23] border border-[#213f32]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl">{f.emoji}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-white truncate">{f.name}</div>
                            <div className="text-[11px] text-[#739283]">{f.cat}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-xs text-[#34d399]">{formatVND(f.price)}</div>
                          <span
                            className={`text-[10px] font-bold ${
                              f.isAvailable !== false ? 'text-[#34d399]' : 'text-[#f87171]'
                            }`}
                          >
                            {f.isAvailable !== false ? 'Đang bán' : 'Hết món'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: KITCHEN DISPLAY SYSTEM */}
          {/* ======================================================== */}
          {currentTab === 'kitchen' && (
            <div className="space-y-6">
              <div className="bg-[#14261f] rounded-2xl p-5 sm:p-6 border border-[#213f32] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f372d] pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <CookingPot className="w-6 h-6 text-[#f59e0b]" />
                      <span>Điều Hành Bếp & Bảng Tổng Hợp Suất Nấu</span>
                    </h2>
                    <p className="text-xs text-[#8ea79b] mt-1">
                      Tự động tính số lượng từng món cần chế biến theo ngày nhận cơm, loại bỏ đơn hủy.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-[#8ea79b] whitespace-nowrap">
                        Ngày nấu:
                      </label>
                      <select
                        value={kitchenDay}
                        onChange={(e) => setKitchenDay(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#172c23] border border-[#235843] text-xs font-bold text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                      >
                        {dayOptions.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label} ({d.value})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In Phiếu Bếp</span>
                    </button>
                  </div>
                </div>

                {/* Sub metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32]">
                    <span className="text-[#739283] block text-[11px]">Đơn nhận ngày này:</span>
                    <strong className="text-base font-black text-white">{kitchenOrders.length} đơn</strong>
                  </div>
                  <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32]">
                    <span className="text-[#739283] block text-[11px]">Suất cơm cần nấu:</span>
                    <strong className="text-base font-black text-[#f59e0b]">
                      {Object.values(kitchenPortionsMap).reduce((s, x) => s + x.count, 0)} suất
                    </strong>
                  </div>
                  <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32]">
                    <span className="text-[#739283] block text-[11px]">Khung giờ giao:</span>
                    <strong className="text-base font-black text-white">09:00 - 11:30</strong>
                  </div>
                  <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32]">
                    <span className="text-[#739283] block text-[11px]">Chốt đơn lúc:</span>
                    <strong className="text-base font-black text-[#34d399]">{storeConfig.orderCutoffTime} Sáng</strong>
                  </div>
                </div>
              </div>

              {/* Portions Grid */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center justify-between">
                  <span>Số lượng từng món ăn cần chuẩn bị (Ngày {kitchenDay}):</span>
                  <span className="text-xs text-[#739283] font-normal">
                    Bấm vào thẻ món để đánh dấu "Đã nấu xong"
                  </span>
                </h3>

                {Object.keys(kitchenPortionsMap).length === 0 ? (
                  <div className="bg-[#14261f] border border-[#213f32] rounded-2xl py-12 text-center text-[#739283]">
                    <div className="text-4xl mb-2">🍳</div>
                    <p className="font-bold text-sm text-white">
                      Chưa có phần ăn nào được đặt cho ngày {kitchenDay}
                    </p>
                    <p className="text-xs mt-1 text-[#8ea79b]">
                      Khi có đơn đặt cho ngày này, số lượng món sẽ tự động tổng hợp tại đây.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(kitchenPortionsMap).map(([name, data]) => {
                      const isCooked = !!cookedItems[`${kitchenDay}_${name}`];
                      return (
                        <div
                          key={name}
                          onClick={() => toggleCooked(name)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCooked
                              ? 'bg-[#103827] border-[#226746] opacity-80'
                              : 'bg-[#14261f] border-[#213f32] hover:border-[#f59e0b]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl">{data.emoji}</span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-white truncate">{name}</h4>
                              <span className="text-[11px] text-[#8ea79b]">{data.cat}</span>
                              {isCooked && (
                                <span className="block text-[10px] text-[#34d399] font-bold mt-0.5">
                                  ✓ Đã chuẩn bị xong
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-block px-3 py-1 rounded-xl bg-[#0e563f] text-[#fed7aa] font-black text-base border border-[#1d6b4f]">
                              {data.count} suất
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Delivery Window breakdown */}
              <div className="bg-[#14261f] rounded-2xl p-5 border border-[#213f32] space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f59e0b]" />
                  <span>Phân bổ đóng hộp theo khung giờ giao (Ngày {kitchenDay}):</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['09:00 - 10:00', '10:00 - 10:45', '11:00 - 11:30'].map((slot) => {
                    const slotOrders = kitchenOrders.filter((o) => o.time.includes(slot.slice(0, 5)));
                    const slotPortions = slotOrders.reduce(
                      (s, o) => s + o.items.reduce((a, b) => a + b.qty, 0),
                      0
                    );
                    return (
                      <div key={slot} className="p-4 rounded-xl bg-[#172c23] border border-[#213f32]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-white">{slot}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#234b3a] text-[#a7f3d0] font-black text-[11px]">
                            {slotOrders.length} đơn
                          </span>
                        </div>
                        <div className="text-sm font-black text-[#f59e0b] mb-2">
                          {slotPortions} phần cơm
                        </div>
                        <div className="text-[11px] text-[#8ea79b] space-y-1">
                          {slotOrders.slice(0, 3).map((o) => (
                            <div key={o.id} className="truncate">
                              • #{o.id} - {o.name} ({o.address})
                            </div>
                          ))}
                          {slotOrders.length > 3 && (
                            <div className="text-[#648575] italic">
                              + {slotOrders.length - 3} đơn khác...
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ORDERS MANAGEMENT */}
          {/* ======================================================== */}
          {currentTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-[#14261f] rounded-2xl p-4 sm:p-5 border border-[#213f32] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white">Quản Lý Đơn Hàng</h2>
                    <p className="text-xs text-[#8ea79b]">
                      Tổng cộng {orders.length} đơn • Đang lọc {filteredOrders.length} đơn
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCreateOrderModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#fed7aa]" />
                      <span>+ Thêm Đơn Thủ Công</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-1.5 rounded-xl bg-[#172c23] hover:bg-[#203c30] text-[#c2d7cc] font-bold text-xs flex items-center gap-1.5 border border-[#213f32] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>Xuất Excel / CSV</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1f372d]">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#739283]" />
                    <input
                      type="text"
                      placeholder="Tìm theo mã đơn, tên, SĐT..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white placeholder-[#5a7667] outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang chuẩn bị">Đang chuẩn bị (Bếp nấu)</option>
                    <option value="Đang giao">Đang giao (Shipper)</option>
                    <option value="Đã giao">Đã giao thành công</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>

                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    <option value="all">Tất cả các ngày nhận</option>
                    {dayOptions.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label} ({d.value})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#14261f] rounded-2xl border border-[#213f32] overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#739283]">
                    Không có đơn hàng nào khớp với tìm kiếm.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                      <thead>
                        <tr className="border-b border-[#1f372d] text-[#739283] uppercase tracking-wider text-[11px] bg-[#12221b]">
                          <th className="py-3 px-4">Mã đơn & Khách</th>
                          <th className="py-3 px-4">Lịch giao</th>
                          <th className="py-3 px-4">Địa chỉ giao</th>
                          <th className="py-3 px-4">Suất ăn</th>
                          <th className="py-3 px-4">Tổng tiền</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4">Cập nhật nhanh</th>
                          <th className="py-3 px-4 text-center">Hóa đơn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1d382c]">
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#172c23]/60 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono font-black text-white">#{o.id}</span>
                              <div className="font-bold text-[#c2d7cc] mt-0.5">{o.name}</div>
                              <div className="text-[11px] text-[#739283]">{o.phone}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{o.day}</div>
                              <div className="text-[11px] text-[#f59e0b] font-semibold">{o.time}</div>
                            </td>

                            <td className="py-3 px-4 max-w-[200px] truncate text-[#a3b8ad]" title={o.address}>
                              {o.address}
                              {o.note && (
                                <div className="text-[10px] text-[#f59e0b] italic truncate">
                                  {o.note}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-white">
                                {o.items.reduce((s, i) => s + i.qty, 0)} suất
                              </div>
                              <div className="text-[11px] text-[#8ea79b] max-w-[140px] truncate">
                                {o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-black text-[#34d399]">{formatVND(o.total)}</div>
                              <div className="text-[10px] text-[#8ea79b]">{o.payment}</div>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  o.status === 'Đã giao'
                                    ? 'bg-[#103827] text-[#34d399] border border-[#226746]'
                                    : o.status === 'Đã hủy'
                                    ? 'bg-[#3b1c1c] text-[#f87171] border border-[#6b2c2c]'
                                    : o.status === 'Đang giao'
                                    ? 'bg-[#1e3a5f] text-[#38bdf8] border border-[#2c5282]'
                                    : 'bg-[#3a2810] text-[#f59e0b] border border-[#6b4c1c]'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={o.status}
                                onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#172c23] border border-[#235843] text-xs font-bold text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                              >
                                <option value="Chờ xác nhận">Chờ xác nhận</option>
                                <option value="Đã xác nhận">Đã xác nhận</option>
                                <option value="Đang chuẩn bị">Đang chuẩn bị (Bếp)</option>
                                <option value="Đang giao">Đang giao</option>
                                <option value="Đã giao">Đã giao</option>
                                <option value="Giao thất bại">Giao thất bại</option>
                                <option value="Đã hủy">Đã hủy</option>
                              </select>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => setInspectOrder(o)}
                                className="p-1.5 rounded-lg bg-[#1f372d] hover:bg-[#2a4d3f] text-[#c2d7cc] hover:text-white cursor-pointer"
                                title="Xem chi tiết & in phiếu"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MENU MANAGEMENT */}
          {/* ======================================================== */}
          {currentTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Quản Lý Thực Đơn & Món Ăn</h2>
                  <p className="text-xs text-[#8ea79b] mt-0.5">
                    Thêm món mới, điều chỉnh giá bán, đổi ảnh và bật/tắt tình trạng Còn món / Hết món tức thì.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingFoodId(null);
                    setFormName('');
                    setFormPrice('55000');
                    setFormCat('Cơm');
                    setFormEmoji('🍱');
                    setFormDesc('');
                    setFormTag('');
                    setFormImg('/assets/images/com_ga_sot_tieu_1793112548727.jpg');
                    setShowFoodModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#fed7aa]" />
                  <span>+ Thêm món mới vào thực đơn</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className={`bg-[#14261f] border rounded-2xl overflow-hidden flex flex-col justify-between ${
                      food.isAvailable === false ? 'border-[#3b2424] opacity-75' : 'border-[#213f32]'
                    }`}
                  >
                    <div>
                      <div className="relative h-36 w-full bg-[#1b3329] overflow-hidden">
                        <img
                          src={food.imageUrl || '/assets/images/com_ga_sot_tieu_1793112548727.jpg'}
                          alt={food.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              '/assets/images/com_ga_sot_tieu_1793112548727.jpg';
                          }}
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#092017]/90 text-[10px] font-bold text-[#fed7aa] border border-[#213f32]">
                          {food.cat}
                        </span>
                        {food.tag && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#f59e0b] text-[10px] font-black text-black">
                            {food.tag}
                          </span>
                        )}
                        {food.isAvailable === false && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="px-3 py-1 rounded-lg bg-[#dc2626] text-white text-xs font-black tracking-wider uppercase">
                              Tạm hết món
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span>{food.emoji}</span>
                          <h4 className="font-bold text-sm text-white">{food.name}</h4>
                        </div>
                        <p className="text-xs text-[#8ea79b] line-clamp-2 min-h-[32px]">
                          {food.desc || 'Chế biến tươi sạch, phục vụ bữa trưa nóng hổi.'}
                        </p>
                        <div className="pt-2 font-black text-base text-[#34d399]">
                          {formatVND(food.price)}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#1f372d] mt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleFoodAvailability(food.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          food.isAvailable !== false
                            ? 'bg-[#103827] text-[#34d399] hover:bg-[#164d36]'
                            : 'bg-[#3b1c1c] text-[#f87171] hover:bg-[#4d2424]'
                        }`}
                      >
                        {food.isAvailable !== false ? '● Đang bán' : '○ Tạm hết'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingFoodId(food.id);
                            setFormName(food.name);
                            setFormCat(food.cat);
                            setFormPrice(String(food.price));
                            setFormEmoji(food.emoji);
                            setFormDesc(food.desc || '');
                            setFormTag(food.tag || '');
                            setFormImg(food.imageUrl || '');
                            setShowFoodModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#172c23] hover:bg-[#203c30] text-[#c2d7cc] cursor-pointer"
                          title="Sửa món"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa món "${food.name}" khỏi thực đơn?`)) {
                              onRemoveFood(food.id);
                              onToast(`Đã xóa món "${food.name}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#172c23] hover:bg-[#3b1c1c] text-[#f87171] cursor-pointer"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: CUSTOMERS & PACKAGES */}
          {/* ======================================================== */}
          {currentTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Khách Hàng & Thẻ Ăn Trả Trước</h2>
                <p className="text-xs text-[#8ea79b] mt-0.5">
                  Danh sách khách hàng, mã thành viên, quản lý số dư thẻ ăn và hỗ trợ nạp tiền/suất ăn tại quầy.
                </p>
              </div>

              <div className="bg-[#14261f] rounded-2xl border border-[#213f32] overflow-hidden">
                <div className="p-4 border-b border-[#1f372d] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Danh sách thành viên ({customers.length})</h3>
                </div>

                {customers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#739283]">
                    Chưa có tài khoản khách hàng nào được lưu.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-[#1f372d] text-[#739283] uppercase tracking-wider text-[11px] bg-[#12221b]">
                          <th className="py-3 px-4">Mã TV</th>
                          <th className="py-3 px-4">Họ và Tên</th>
                          <th className="py-3 px-4">Số điện thoại / Email</th>
                          <th className="py-3 px-4">Địa chỉ mặc định</th>
                          <th className="py-3 px-4">Thẻ ăn kích hoạt</th>
                          <th className="py-3 px-4 text-center">Nạp suất ăn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1d382c]">
                        {customers.map((c) => {
                          const userPkgs = packages.filter(
                            (p) => p.customerId === c.id || p.memberCode === c.memberCode
                          );
                          const totalBal = userPkgs.reduce(
                            (s, p) => s + (Number(p.balance) || 0),
                            0
                          );

                          return (
                            <tr key={c.id} className="hover:bg-[#172c23]/60 transition-colors">
                              <td className="py-3 px-4 font-mono font-black text-[#f59e0b]">
                                {c.memberCode}
                              </td>
                              <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                              <td className="py-3 px-4">
                                <div className="text-white">{c.phone}</div>
                                <div className="text-[11px] text-[#739283]">{c.email}</div>
                              </td>
                              <td className="py-3 px-4 max-w-[200px] truncate text-[#a3b8ad]">
                                {c.address || 'Chưa cập nhật'}
                              </td>
                              <td className="py-3 px-4">
                                {userPkgs.length > 0 ? (
                                  <span className="font-bold text-[#34d399]">
                                    {userPkgs.length} gói ({formatVND(totalBal)})
                                  </span>
                                ) : (
                                  <span className="text-[#648575] italic">Chưa nạp gói</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => setTopupCust(c)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs cursor-pointer"
                                >
                                  + Nạp suất ăn
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: VOUCHERS */}
          {/* ======================================================== */}
          {currentTab === 'vouchers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Mã Giảm Giá & Khuyến Mãi</h2>
                <p className="text-xs text-[#8ea79b] mt-0.5">
                  Phát hành và quản lý các chương trình ưu đãi giảm giá bữa trưa.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleCreateVoucher}
                className="bg-[#14261f] rounded-2xl p-5 border border-[#213f32] space-y-4"
              >
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#f59e0b]" />
                  <span>Phát hành mã giảm giá mới</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">Mã Voucher</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: TRUATUYETVOI"
                      value={vCode}
                      onChange={(e) => setVCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white uppercase font-mono font-bold outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">Tiêu đề hiển thị</label>
                    <input
                      type="text"
                      placeholder="VD: Rủ bạn cùng ăn trưa"
                      value={vTitle}
                      onChange={(e) => setVTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">% Giảm giá</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={vPercent}
                      onChange={(e) => setVPercent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8ea79b] mb-1">Mô tả điều kiện</label>
                  <input
                    type="text"
                    placeholder="VD: Áp dụng khi đặt từ 2 phần cơm trở lên"
                    value={vDesc}
                    onChange={(e) => setVDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs cursor-pointer"
                >
                  + Kích hoạt Voucher
                </button>
              </form>

              {/* List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="bg-[#14261f] border border-[#213f32] p-4 rounded-2xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-black text-sm text-[#f59e0b] bg-[#292010] px-2.5 py-1 rounded-lg border border-[#593d14]">
                          {v.code}
                        </span>
                        <span className="text-[11px] font-bold text-[#34d399]">{v.badge}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white">{v.title}</h4>
                      <p className="text-[11px] text-[#8ea79b] mt-1">{v.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1f372d] flex justify-between items-center text-xs">
                      <span className="text-[#648575]">Giảm: {v.percent}%</span>
                      <button
                        onClick={() => {
                          onRemoveVoucher(v.id);
                          onToast(`Đã xóa mã voucher "${v.code}"`);
                        }}
                        className="text-[#f87171] hover:underline cursor-pointer"
                      >
                        Xóa mã
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: REPORTS & ANALYTICS */}
          {/* ======================================================== */}
          {currentTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Báo Cáo Doanh Thu & Hiệu Quả Vận Hành</h2>
                  <p className="text-xs text-[#8ea79b] mt-0.5">
                    Thống kê chi tiết tài chính, số lượng suất ăn và phân tích đơn giao.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#fed7aa]" />
                  <span>Xuất File Báo Cáo CSV</span>
                </button>
              </div>

              {/* Numbers grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#14261f] border border-[#213f32]">
                  <span className="text-xs text-[#8ea79b] block">Tổng đơn hàng</span>
                  <strong className="text-2xl font-black text-white mt-1 block">{orders.length}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#14261f] border border-[#213f32]">
                  <span className="text-xs text-[#8ea79b] block">Giao thành công</span>
                  <strong className="text-2xl font-black text-[#34d399] mt-1 block">
                    {completedOrders.length}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#14261f] border border-[#213f32]">
                  <span className="text-xs text-[#8ea79b] block">Đơn đã hủy</span>
                  <strong className="text-2xl font-black text-[#f87171] mt-1 block">
                    {cancelledOrders.length}
                  </strong>
                </div>

                <div className="p-4 rounded-2xl bg-[#14261f] border border-[#213f32]">
                  <span className="text-xs text-[#8ea79b] block">Doanh thu giao thành công</span>
                  <strong className="text-xl font-black text-[#34d399] mt-1 block">
                    {formatVND(totalRevenue)}
                  </strong>
                </div>
              </div>

              {/* Breakdown list */}
              <div className="bg-[#14261f] rounded-2xl p-5 border border-[#213f32] space-y-3 text-xs">
                <h3 className="font-bold text-sm text-white border-b border-[#1f372d] pb-2">
                  Chi tiết cơ cấu số liệu
                </h3>
                <div className="flex justify-between py-1.5 border-b border-[#1d382c]">
                  <span className="text-[#8ea79b]">Tổng phí giao hàng phát sinh:</span>
                  <span className="font-bold text-white">
                    {formatVND(orders.reduce((sum, o) => sum + o.shipping, 0))}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1d382c]">
                  <span className="text-[#8ea79b]">Tổng số suất cơm phục vụ (đơn chưa hủy):</span>
                  <span className="font-bold text-[#f59e0b]">
                    {orders
                      .filter((o) => o.status !== 'Đã hủy')
                      .reduce((sum, o) => sum + o.items.reduce((a, b) => a + b.qty, 0), 0)}{' '}
                    suất
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1d382c]">
                  <span className="text-[#8ea79b]">Gói thẻ ăn trả trước đang hoạt động:</span>
                  <span className="font-bold text-white">{packages.length} gói</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8ea79b]">Giá trị trung bình mỗi đơn (AOV):</span>
                  <span className="font-bold text-[#34d399]">
                    {completedOrders.length > 0
                      ? formatVND(Math.round(totalRevenue / completedOrders.length))
                      : '0 ₫'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: SETTINGS */}
          {/* ======================================================== */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Cài Đặt Cửa Hàng & Vận Hành Bếp</h2>
                <p className="text-xs text-[#8ea79b] mt-0.5">
                  Cấu hình giờ chốt đơn, hotline tiếp nhận và đổi mã PIN bảo mật.
                </p>
              </div>

              <div className="bg-[#14261f] rounded-2xl p-5 sm:p-6 border border-[#213f32] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">
                      Tên Chi Nhánh / Bếp
                    </label>
                    <input
                      type="text"
                      value={cfgStoreName}
                      onChange={(e) => setCfgStoreName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">
                      Giờ chốt đơn cùng ngày (Cutoff Time)
                    </label>
                    <input
                      type="time"
                      value={cfgCutoff}
                      onChange={(e) => setCfgCutoff(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">
                      Hotline Tiếp Nhận & Hỗ Trợ
                    </label>
                    <input
                      type="text"
                      value={cfgHotline}
                      onChange={(e) => setCfgHotline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8ea79b] mb-1">
                      Đổi Mã PIN Quản Trị Mới (Để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      placeholder="Mã PIN hiện tại: 8888"
                      value={newAdminPin}
                      onChange={(e) => setNewAdminPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8ea79b] mb-1">
                    Thông Báo Vận Hành Bếp
                  </label>
                  <input
                    type="text"
                    value={cfgNotice}
                    onChange={(e) => setCfgNotice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-xs text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div className="pt-4 border-t border-[#1f372d] flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs cursor-pointer shadow-sm"
                  >
                    Lưu Thay Đổi Cấu Hình
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: CREATE ORDER (POS / PHONE ORDER) */}
      {/* ======================================================== */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#14261f] border border-[#235843] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1f372d] pb-3">
              <div>
                <span className="text-[11px] font-black text-[#f59e0b] uppercase tracking-wider">
                  POS & Đặt Bằng Điện Thoại
                </span>
                <h3 className="font-black text-lg text-white">Tạo Đơn Hàng Mới Tại Bếp</h3>
              </div>
              <button
                onClick={() => setShowCreateOrderModal(false)}
                className="p-1 rounded-lg text-[#8ea79b] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePOSOrder} className="space-y-4 text-xs">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Tên khách hàng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Anh Minh - VNG Campus"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0901234567"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  placeholder="VD: Tòa nhà FPT, Lầu 4, P. Tân Thuận Đông, Q7"
                  value={posCustomerAddress}
                  onChange={(e) => setPosCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              {/* Delivery Day & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Ngày nhận cơm</label>
                  <select
                    value={posOrderDay}
                    onChange={(e) => setPosOrderDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    {dayOptions.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label} ({d.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Khung giờ giao</label>
                  <select
                    value={posOrderTime}
                    onChange={(e) => setPosOrderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    <option value="09:00 - 10:00">09:00 - 10:00 (Sớm)</option>
                    <option value="10:00 - 10:45">10:00 - 10:45 (Chuẩn)</option>
                    <option value="11:00 - 11:30">11:00 - 11:30 (Trưa)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Thanh toán</label>
                  <select
                    value={posPayment}
                    onChange={(e) => setPosPayment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    <option value="Tiền mặt khi nhận (COD)">Tiền mặt (COD)</option>
                    <option value="Đã chuyển khoản ngân hàng">Đã chuyển khoản</option>
                    <option value="Thẻ thành viên Tới Trưa">Thẻ thành viên</option>
                  </select>
                </div>
              </div>

              {/* Select Dishes */}
              <div className="space-y-2">
                <label className="block font-bold text-[#8ea79b]">
                  Chọn món ăn và số lượng suất:
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-[#1f372d] bg-[#172c23] p-3 rounded-2xl border border-[#213f32]">
                  {foods.map((food) => {
                    const currentQty = posSelectedItems[food.id] || 0;
                    return (
                      <div key={food.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{food.emoji}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-white truncate block">{food.name}</span>
                            <span className="text-[11px] text-[#34d399] font-bold">
                              {formatVND(food.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setPosSelectedItems((prev) => ({
                                ...prev,
                                [food.id]: Math.max(0, (prev[food.id] || 0) - 1),
                              }))
                            }
                            className="w-7 h-7 rounded-lg bg-[#214334] hover:bg-[#2b5844] text-white font-black cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-sm text-white">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPosSelectedItems((prev) => ({
                                ...prev,
                                [food.id]: (prev[food.id] || 0) + 1,
                              }))
                            }
                            className="w-7 h-7 rounded-lg bg-[#0e563f] hover:bg-[#12694d] text-white font-black cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">Ghi chú bếp</label>
                <input
                  type="text"
                  placeholder="VD: Không cay, nhiều ớt chuông, gọi trước 10p"
                  value={posOrderNote}
                  onChange={(e) => setPosOrderNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-[#09291d] border border-[#1d4d38] flex items-center justify-between">
                <span className="text-[#a1b8ad]">Tổng tiền dự tính:</span>
                <strong className="text-lg font-black text-[#34d399]">
                  {formatVND(
                    Object.entries(posSelectedItems).reduce((sum, [id, qty]) => {
                      const f = foods.find((x) => x.id === Number(id));
                      return sum + (f ? f.price * qty : 0);
                    }, 0)
                  )}
                </strong>
              </div>

              <div className="pt-3 border-t border-[#1f372d] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateOrderModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#172c23] hover:bg-[#203c30] text-[#c2d7cc] font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold cursor-pointer shadow-sm"
                >
                  Tạo Đơn Hàng Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FOOD FORM */}
      {showFoodModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#14261f] border border-[#235843] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f372d] pb-3">
              <h3 className="font-black text-base text-white">
                {editingFoodId ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Mới Vào Thực Đơn'}
              </h3>
              <button
                onClick={() => setShowFoodModal(false)}
                className="p-1 rounded-lg text-[#8ea79b] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFoodForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">Tên món ăn</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cơm sườn bì chả nướng mật ong"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Nhóm món</label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b] cursor-pointer"
                  >
                    <option value="Cơm">Cơm</option>
                    <option value="Món nước">Món nước</option>
                    <option value="Món khô">Món khô</option>
                    <option value="Món chay">Món chay</option>
                    <option value="Món thêm">Món thêm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Emoji minh họa</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formEmoji}
                    onChange={(e) => setFormEmoji(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b] text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Tag nổi bật</label>
                  <input
                    type="text"
                    placeholder="VD: BÁN CHẠY, MỚI"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">Đường dẫn ảnh món (URL)</label>
                <input
                  type="text"
                  placeholder="https://... hoặc /assets/images/..."
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">Mô tả món ăn</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả hương vị, nguyên liệu ăn kèm..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="pt-3 border-t border-[#1f372d] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFoodModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#172c23] hover:bg-[#203c30] text-[#c2d7cc] font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold cursor-pointer"
                >
                  {editingFoodId ? 'Lưu Cập Nhật' : 'Thêm Vào Thực Đơn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT ORDER */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#14261f] border border-[#235843] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f372d] pb-3">
              <div>
                <span className="font-mono text-xs text-[#f59e0b] font-black">
                  #{inspectOrder.id}
                </span>
                <h3 className="font-black text-base text-white">Hóa Đơn & Chi Tiết Đơn Hàng</h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-1 rounded-lg text-[#8ea79b] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8ea79b]">Khách hàng:</span>
                  <strong className="text-white">{inspectOrder.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea79b]">Số điện thoại:</span>
                  <span className="text-white">{inspectOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea79b]">Địa chỉ:</span>
                  <span className="text-white text-right max-w-[200px]">{inspectOrder.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8ea79b]">Ngày & giờ giao:</span>
                  <span className="text-[#f59e0b] font-bold">
                    {inspectOrder.day} ({inspectOrder.time})
                  </span>
                </div>
                {inspectOrder.note && (
                  <div className="flex justify-between text-[#fed7aa] italic pt-1 border-t border-[#234537]">
                    <span>Ghi chú:</span>
                    <span>{inspectOrder.note}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#8ea79b]">Món ăn đã đặt:</span>
                <div className="divide-y divide-[#1f372d] bg-[#172c23] rounded-xl p-3 border border-[#213f32]">
                  {inspectOrder.items.map((it) => (
                    <div key={it.id} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">
                          {it.name} <span className="text-[#f59e0b]">× {it.qty}</span>
                        </div>
                        <div className="text-[10px] text-[#739283]">{formatVND(it.price)} / phần</div>
                      </div>
                      <span className="font-black text-[#34d399]">
                        {formatVND(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#1f372d]">
                <div className="flex justify-between text-[#8ea79b]">
                  <span>Tiền món:</span>
                  <span>{formatVND(inspectOrder.foodTotal || inspectOrder.subtotal)}</span>
                </div>
                {inspectOrder.discount > 0 && (
                  <div className="flex justify-between text-[#f59e0b]">
                    <span>Giảm giá / Voucher:</span>
                    <span>-{formatVND(inspectOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8ea79b]">
                  <span>Phí giao hàng:</span>
                  <span>{formatVND(inspectOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#34d399] pt-1 border-t border-[#1f372d]">
                  <span>Tổng thanh toán:</span>
                  <span>{formatVND(inspectOrder.total)}</span>
                </div>
                <div className="text-[11px] text-[#8ea79b] text-right">
                  Hình thức: {inspectOrder.payment} ({inspectOrder.payStatus})
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1f372d] flex justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#172c23] hover:bg-[#203c30] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Phiếu Giao / Hóa Đơn</span>
              </button>
              <button
                onClick={() => setInspectOrder(null)}
                className="px-4 py-2 rounded-xl bg-[#0e563f] text-white font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOP-UP MEALS */}
      {topupCust && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#14261f] border border-[#235843] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f372d] pb-3">
              <div>
                <span className="font-mono text-xs text-[#f59e0b] font-black">
                  Mã TV: {topupCust.memberCode}
                </span>
                <h3 className="font-black text-base text-white">Nạp Suất Ăn Cho Thành Viên</h3>
              </div>
              <button
                onClick={() => setTopupCust(null)}
                className="p-1 rounded-lg text-[#8ea79b] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#172c23] p-3 rounded-xl border border-[#213f32]">
                <div className="font-bold text-white">{topupCust.name}</div>
                <div className="text-[11px] text-[#8ea79b]">SĐT: {topupCust.phone}</div>
              </div>

              <div>
                <label className="block font-bold text-[#8ea79b] mb-1">
                  Chọn gói suất ăn cần nạp:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 5, price: 275000 },
                    { count: 10, price: 530000 },
                    { count: 20, price: 1040000 },
                  ].map((p) => (
                    <button
                      key={p.count}
                      type="button"
                      onClick={() => {
                        setTopupMeals(String(p.count));
                        setTopupMoney(String(p.price));
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        topupMeals === String(p.count)
                          ? 'bg-[#0e563f] border-[#34d399] text-white shadow-xs'
                          : 'bg-[#172c23] border-[#213f32] text-[#8ea79b]'
                      }`}
                    >
                      <div className="font-black text-sm">{p.count} suất</div>
                      <div className="text-[10px] mt-0.5">{formatVND(p.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Số suất nạp</label>
                  <input
                    type="number"
                    min="1"
                    value={topupMeals}
                    onChange={(e) => setTopupMeals(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white font-bold outline-none focus:border-[#f59e0b]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8ea79b] mb-1">Số tiền tương ứng (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={topupMoney}
                    onChange={(e) => setTopupMoney(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#172c23] border border-[#213f32] text-white font-bold outline-none focus:border-[#f59e0b]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1f372d] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTopupCust(null)}
                className="px-4 py-2 rounded-xl bg-[#172c23] text-[#c2d7cc] font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmTopup}
                className="px-5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                Xác Nhận Nạp Cho Thành Viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
