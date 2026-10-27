import React from 'react';
import {
  LayoutDashboard,
  CookingPot,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  Tag,
  BarChart3,
  Settings,
  Clock,
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingOrderCount: number;
  kitchenOrderCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingOrderCount,
  kitchenOrderCount,
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Tổng quan & Thống kê', icon: LayoutDashboard },
    {
      id: 'kitchen' as AdminTab,
      label: 'Điều hành Bếp (KDS)',
      icon: CookingPot,
      badge: kitchenOrderCount > 0 ? `${kitchenOrderCount} đơn` : undefined,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Quản lý Đơn hàng',
      icon: ShoppingBag,
      badge: pendingOrderCount > 0 ? `${pendingOrderCount} mới` : undefined,
      badgeColor: 'bg-amber-500 text-black',
    },
    { id: 'menu' as AdminTab, label: 'Quản lý Thực đơn', icon: UtensilsCrossed },
    { id: 'customers' as AdminTab, label: 'Khách & Thẻ ăn', icon: Users },
    { id: 'vouchers' as AdminTab, label: 'Mã giảm giá', icon: Tag },
    { id: 'reports' as AdminTab, label: 'Báo cáo & Doanh thu', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Cài đặt Bếp & Cửa hàng', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="bg-[#14261f] border border-[#213f32] rounded-2xl p-3 shadow-sm">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#739283]">
          Menu Nghiệp Vụ
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0e563f] text-white shadow-sm ring-1 ring-[#216b50]'
                    : 'text-[#9cb5a8] hover:text-white hover:bg-[#1a3329]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f59e0b]' : 'text-[#739283]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      item.badgeColor || 'bg-[#214b39] text-[#a7f3d0]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operation Notice */}
      <div className="bg-[#14261f] border border-[#213f32] rounded-2xl p-4 text-xs space-y-2 hidden lg:block">
        <div className="flex items-center gap-2 text-[#f59e0b] font-bold">
          <Clock className="w-4 h-4" />
          <span>Vận hành bếp thông minh</span>
        </div>
        <p className="text-[#8ea79b] text-[11px] leading-relaxed">
          Tối ưu chi phí và chống lãng phí: Menu công bố trước 3 ngày. Giờ chốt đơn <b>07:00 sáng</b> mỗi ngày để bếp chế biến vừa đủ.
        </p>
        <div className="pt-2 border-t border-[#1f372d] flex justify-between items-center text-[11px]">
          <span className="text-[#739283]">Trạng thái:</span>
          <span className="text-[#34d399] font-bold">● Đang vận hành</span>
        </div>
      </div>
    </aside>
  );
};
