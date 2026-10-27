import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [rememberAdmin, setRememberAdmin] = useState(true);

  const handleVerify = (pinToTest?: string) => {
    const val = (pinToTest ?? pinInput).trim();
    const savedPin = localStorage.getItem('tt_admin_pin') || '8888';
    if (val === savedPin || val === '8888' || val === 'admin123') {
      if (rememberAdmin) {
        localStorage.setItem('tt_admin_authenticated', 'yes');
      }
      onSuccess();
    } else {
      setPinError('Mã PIN không chính xác (Mặc định: 8888 hoặc admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b241b] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#0e563f]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#f59e0b]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#112d22] border border-[#1b4333] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#093c2b] border border-[#216b50] flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-[#f59e0b]" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#0e563f] text-[#a7f3d0] text-xs font-bold tracking-wide uppercase">
            Hệ Thống Quản Trị & Điều Hành Bếp
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            TỚI TRƯA ADMIN
          </h1>
          <p className="text-xs text-[#a3b8ad] max-w-xs mx-auto">
            Phần mềm chuyên biệt dành cho Quản lý cửa hàng, Thu ngân và Bếp trưởng.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-[#c2d7cc] mb-1.5">
              Mã PIN Bảo Mật (Mặc định: 8888)
            </label>
            <input
              type="password"
              maxLength={10}
              autoFocus
              placeholder="Nhập 8888 hoặc admin123"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#092017] border border-[#1d4d39] text-white text-center text-lg tracking-widest outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/30 transition-all font-mono"
            />
            {pinError && (
              <p className="text-xs text-[#f87171] mt-1.5 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{pinError}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#a3b8ad]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberAdmin}
                onChange={(e) => setRememberAdmin(e.target.checked)}
                className="rounded text-[#0e563f] focus:ring-[#f59e0b]"
              />
              <span>Ghi nhớ phiên quản trị</span>
            </label>
            <span className="text-[11px] text-[#f59e0b] font-medium">Mã mẫu: 8888</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-[0.98] text-white font-extrabold text-sm transition-all shadow-lg shadow-[#093c2b]/50 cursor-pointer flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 text-[#fed7aa]" />
            <span>Mở Bảng Điều Khiển Quản Trị</span>
          </button>

          <button
            type="button"
            onClick={() => handleVerify('8888')}
            className="w-full py-2.5 rounded-xl bg-[#1b4333] hover:bg-[#235340] text-[#a7f3d0] font-bold text-xs transition-colors cursor-pointer border border-[#2b654e]"
          >
            ⚡ Đăng nhập nhanh Quản trị (1 Chạm)
          </button>
        </form>

        <div className="pt-3 border-t border-[#1d4d39] text-center text-[11px] text-[#6b897b] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
          <span>Phiên làm việc bảo mật độc lập · Tới Trưa Kitchen OS</span>
        </div>
      </div>
    </div>
  );
};
