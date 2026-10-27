import React from 'react';
import { Store, Plus, Lock, Clock, ShoppingBag } from 'lucide-react';

interface AdminHeaderProps {
  activeOrderCount: number;
  todayKitchenPortions: number;
  onOpenCreateOrderModal: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeOrderCount,
  todayKitchenPortions,
  onOpenCreateOrderModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#12201b]/95 backdrop-blur-md border-b border-[#1f372d] shadow-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#093c2b] border border-[#235843] flex items-center justify-center shadow-inner">
            <Store className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">
                TỚI TRƯA
              </span>
              <span className="bg-[#f59e0b] text-[#1f1604] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Trung Tâm Quản Trị & Bếp
              </span>
            </div>
            <p className="text-[11px] text-[#8ea79b] hidden sm:block">
              Phần mềm chuyên biệt quản trị đơn hàng, điều phối bếp và thẻ ăn thành viên
            </p>
          </div>
        </div>

        {/* Live Metrics Quick Pills */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-[#172c23] px-3 py-1.5 rounded-xl border border-[#213f32]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#a1b8ad]">Đơn đang xử lý:</span>
            <strong className="text-white font-black">{activeOrderCount}</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#172c23] px-3 py-1.5 rounded-xl border border-[#213f32]">
            <span className="text-[#a1b8ad]">Suất ăn nấu hôm nay:</span>
            <strong className="text-[#f59e0b] font-black">{todayKitchenPortions} suất</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Create Order (POS / Phone order) */}
          <button
            onClick={onOpenCreateOrderModal}
            className="px-3.5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-[#1b6b50]"
            title="Tạo đơn hàng mới (POS / Điện thoại)"
          >
            <Plus className="w-4 h-4 text-[#fed7aa]" />
            <span>+ Tạo Đơn Nhanh</span>
          </button>

          {/* Logout / Lock PIN */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-[#1b2f26] hover:bg-[#253e32] text-[#c2d7cc] hover:text-white transition-colors cursor-pointer border border-[#244235]"
            title="Khóa bảo mật phiên Quản trị"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
