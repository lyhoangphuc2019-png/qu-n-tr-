import React, { useState, useEffect } from 'react';
import { AdminApp } from './admin/AdminApp';
import { useRestaurantData } from './services/dataService';

export default function App() {
  // Centralized Business Data Service
  const data = useRestaurantData();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#0f1714] text-[#e3ece7]">
      {/* Pure Dedicated Admin & Kitchen Operations System */}
      <AdminApp
        foods={data.foods}
        orders={data.orders}
        customers={data.customers}
        packages={data.packages}
        vouchers={data.vouchers}
        storeConfig={data.storeConfig}
        onAddFood={data.addFood}
        onUpdateFood={data.updateFood}
        onRemoveFood={data.removeFood}
        onToggleFoodAvailability={data.toggleFoodAvailability}
        onAddOrder={data.addOrder}
        onUpdateOrderStatus={data.updateOrderStatus}
        onCancelOrder={data.cancelOrder}
        onUpdatePackageBalance={data.updatePackageBalance}
        onAddPackage={data.addPackage}
        onAddVoucher={data.addVoucher}
        onRemoveVoucher={data.removeVoucher}
        onUpdateStoreConfig={data.updateStoreConfig}
        onToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#093c2b] text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 toast-animate border border-[#cbe3d4]/30 ring-2 ring-[#f59e0b]/50">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
