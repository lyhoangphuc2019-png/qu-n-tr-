import { useState, useEffect, useCallback } from 'react';
import {
  FoodItem,
  Order,
  OrderStatus,
  Customer,
  UserPackage,
  PackageCatalogItem,
  Voucher,
  StoreConfig,
} from '../types';
import {
  INITIAL_FOODS,
  DEFAULT_PACKAGES,
  DEFAULT_VOUCHERS,
} from '../data/initialData';

const SYNC_EVENT_NAME = 'tt_data_sync_event';

// Broadcast an update to all listeners and other components
export function broadcastDataChange(key: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: { key } }));
  }
}

// Default store configuration
export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Bếp Tới Trưa - Văn Phòng Trung Tâm',
  orderCutoffTime: '07:00',
  deliverySlots: ['09:00 - 10:00', '10:00 - 10:45', '11:00 - 11:30'],
  hotline: '1900 8821',
  announcementText: 'Bếp cam kết giao nóng hổi đúng hẹn trước 11:30!',
  isKitchenAcceptingOrders: true,
};

// Data service hook for both Admin and Customer codebases
export function useRestaurantData() {
  // Foods state
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_custom_menu');
      if (saved) {
        const parsed: FoodItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const fresh = INITIAL_FOODS.find((f) => f.id === item.id);
          return fresh ? { ...fresh, ...item } : item;
        });
      }
      return INITIAL_FOODS;
    } catch {
      return INITIAL_FOODS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('tt_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('tt_customers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Packages state
  const [packages, setPackages] = useState<UserPackage[]>(() => {
    try {
      const saved = localStorage.getItem('tt_packages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Package Catalog state
  const [packageCatalog, setPackageCatalog] = useState<PackageCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_package_catalog');
      if (saved) return JSON.parse(saved);
      return DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  });

  // Vouchers state
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    try {
      const saved = localStorage.getItem('tt_custom_vouchers');
      if (saved) return JSON.parse(saved);
      return DEFAULT_VOUCHERS;
    } catch {
      return DEFAULT_VOUCHERS;
    }
  });

  // Store Configuration state
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('tt_store_config');
      if (saved) return JSON.parse(saved);
      return DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  // Refresh data from localStorage when external or broadcast changes occur
  const reloadFromStorage = useCallback(() => {
    try {
      const f = localStorage.getItem('tt_custom_menu');
      if (f) setFoods(JSON.parse(f));

      const o = localStorage.getItem('tt_orders');
      if (o) setOrders(JSON.parse(o));

      const c = localStorage.getItem('tt_customers');
      if (c) setCustomers(JSON.parse(c));

      const p = localStorage.getItem('tt_packages');
      if (p) setPackages(JSON.parse(p));

      const cat = localStorage.getItem('tt_package_catalog');
      if (cat) setPackageCatalog(JSON.parse(cat));

      const v = localStorage.getItem('tt_custom_vouchers');
      if (v) setVouchers(JSON.parse(v));

      const sc = localStorage.getItem('tt_store_config');
      if (sc) setStoreConfig(JSON.parse(sc));
    } catch {
      // ignore parsing error
    }
  }, []);

  useEffect(() => {
    const handleSync = () => {
      reloadFromStorage();
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [reloadFromStorage]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tt_custom_menu', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('tt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tt_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('tt_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('tt_package_catalog', JSON.stringify(packageCatalog));
  }, [packageCatalog]);

  useEffect(() => {
    localStorage.setItem('tt_custom_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('tt_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  // ================= MUTATORS =================

  // Food Mutators
  const addFood = useCallback((newFoodData: Omit<FoodItem, 'id'>) => {
    setFoods((prev) => {
      const nextId = Math.max(0, ...prev.map((f) => f.id)) + 1;
      const created: FoodItem = {
        id: nextId,
        ...newFoodData,
        isAvailable: newFoodData.isAvailable ?? true,
      };
      const next = [...prev, created];
      localStorage.setItem('tt_custom_menu', JSON.stringify(next));
      broadcastDataChange('foods');
      return next;
    });
  }, []);

  const updateFood = useCallback((foodId: number, patch: Partial<FoodItem>) => {
    setFoods((prev) => {
      const next = prev.map((f) => (f.id === foodId ? { ...f, ...patch } : f));
      localStorage.setItem('tt_custom_menu', JSON.stringify(next));
      broadcastDataChange('foods');
      return next;
    });
  }, []);

  const removeFood = useCallback((foodId: number) => {
    setFoods((prev) => {
      const next = prev.filter((f) => f.id !== foodId);
      localStorage.setItem('tt_custom_menu', JSON.stringify(next));
      broadcastDataChange('foods');
      return next;
    });
  }, []);

  const toggleFoodAvailability = useCallback((foodId: number) => {
    setFoods((prev) => {
      const next = prev.map((f) =>
        f.id === foodId ? { ...f, isAvailable: f.isAvailable === false ? true : false } : f
      );
      localStorage.setItem('tt_custom_menu', JSON.stringify(next));
      broadcastDataChange('foods');
      return next;
    });
  }, []);

  // Order Mutators
  const addOrder = useCallback((newOrder: Order, updatedPackage?: UserPackage) => {
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      localStorage.setItem('tt_orders', JSON.stringify(next));
      broadcastDataChange('orders');
      return next;
    });

    if (updatedPackage) {
      setPackages((prev) => {
        const next = prev.map((p) => (p.id === updatedPackage.id ? updatedPackage : p));
        localStorage.setItem('tt_packages', JSON.stringify(next));
        broadcastDataChange('packages');
        return next;
      });
    }
  }, []);

  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id !== orderId) return o;
        let payStatus = o.payStatus;
        if (newStatus === 'Đã giao' && o.payment.includes('COD')) {
          payStatus = 'Đã thanh toán (COD)';
        }
        return {
          ...o,
          status: newStatus,
          payStatus,
        };
      });
      localStorage.setItem('tt_orders', JSON.stringify(next));
      broadcastDataChange('orders');
      return next;
    });
  }, []);

  const cancelOrder = useCallback((orderId: string): { success: boolean; message: string } => {
    let resultMessage = 'Đã hủy đơn hàng thành công';
    let wasSuccess = false;

    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (!target) return prev;

      wasSuccess = true;
      let payStatus = target.payStatus;

      if (!target.refundProcessed) {
        if (target.packageId) {
          // Refund to package
          setPackages((pkgList) => {
            const updatedPkgs = pkgList.map((pkg) => {
              if (pkg.id === target.packageId) {
                return {
                  ...pkg,
                  balance:
                    (Number(pkg.balance) || 0) +
                    (Number(target.packageCharge) || Number(target.foodTotal) || 0),
                  used: Math.max(0, (Number(pkg.used) || 0) - (Number(target.packageQty) || 0)),
                };
              }
              return pkg;
            });
            localStorage.setItem('tt_packages', JSON.stringify(updatedPkgs));
            broadcastDataChange('packages');
            return updatedPkgs;
          });
          payStatus = 'Đã hoàn tiền vào thẻ ăn';
          resultMessage = 'Đơn đã hủy; tiền/suất ăn đã được hoàn lại đầy đủ vào thẻ ăn của bạn!';
        } else if (target.payStatus.includes('Đã thanh toán')) {
          payStatus = 'Đã hoàn tiền (mô phỏng)';
          resultMessage = 'Đơn đã hủy; số tiền đã được ghi nhận hoàn lại!';
        }
      }

      const next = prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'Đã hủy' as OrderStatus, payStatus, refundProcessed: true }
          : ord
      );
      localStorage.setItem('tt_orders', JSON.stringify(next));
      broadcastDataChange('orders');
      return next;
    });

    return { success: wasSuccess, message: resultMessage };
  }, []);

  // Customer Mutators
  const saveCustomer = useCallback((customer: Customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id || c.email === customer.email);
      let next: Customer[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = customer;
      } else {
        next = [...prev, customer];
      }
      localStorage.setItem('tt_customers', JSON.stringify(next));
      broadcastDataChange('customers');
      return next;
    });
  }, []);

  const updateCustomer = useCallback((customerId: string, patch: Partial<Customer>) => {
    setCustomers((prev) => {
      const next = prev.map((c) => (c.id === customerId ? { ...c, ...patch } : c));
      localStorage.setItem('tt_customers', JSON.stringify(next));
      broadcastDataChange('customers');
      return next;
    });
  }, []);

  // Package Mutators
  const addPackage = useCallback((newPkg: UserPackage) => {
    setPackages((prev) => {
      const next = [newPkg, ...prev];
      localStorage.setItem('tt_packages', JSON.stringify(next));
      broadcastDataChange('packages');
      return next;
    });
  }, []);

  const updatePackageBalance = useCallback(
    (packageId: string, deltaBalance: number, deltaCount: number) => {
      setPackages((prev) => {
        const next = prev.map((p) =>
          p.id === packageId
            ? {
                ...p,
                balance: (Number(p.balance) || 0) + deltaBalance,
                count: (Number(p.count) || 0) + deltaCount,
              }
            : p
        );
        localStorage.setItem('tt_packages', JSON.stringify(next));
        broadcastDataChange('packages');
        return next;
      });
    },
    []
  );

  // Voucher Mutators
  const addVoucher = useCallback((newVoucher: Voucher) => {
    setVouchers((prev) => {
      const next = [newVoucher, ...prev];
      localStorage.setItem('tt_custom_vouchers', JSON.stringify(next));
      broadcastDataChange('vouchers');
      return next;
    });
  }, []);

  const removeVoucher = useCallback((voucherId: string) => {
    setVouchers((prev) => {
      const next = prev.filter((v) => v.id !== voucherId);
      localStorage.setItem('tt_custom_vouchers', JSON.stringify(next));
      broadcastDataChange('vouchers');
      return next;
    });
  }, []);

  // Store Config Mutator
  const updateStoreConfig = useCallback((newConfig: Partial<StoreConfig>) => {
    setStoreConfig((prev) => {
      const next = { ...prev, ...newConfig };
      localStorage.setItem('tt_store_config', JSON.stringify(next));
      broadcastDataChange('storeConfig');
      return next;
    });
  }, []);

  return {
    foods,
    orders,
    customers,
    packages,
    packageCatalog,
    vouchers,
    storeConfig,
    // Operations
    addFood,
    updateFood,
    removeFood,
    toggleFoodAvailability,
    addOrder,
    updateOrderStatus,
    cancelOrder,
    saveCustomer,
    updateCustomer,
    addPackage,
    updatePackageBalance,
    addVoucher,
    removeVoucher,
    updateStoreConfig,
  };
}
