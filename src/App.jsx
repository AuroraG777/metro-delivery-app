import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  doc, 
  setDoc, 
  onSnapshot, 
  loginConGoogle, 
  cerrarSesion, 
  onAuthStateChanged 
} from './firebase';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_DELIVERIES, 
  METRO_STATIONS 
} from './constants/initialData';

// SVGs nativos para rendimiento máximo sin librerías pesadas
const IconPackage = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/>
    <path d="M12 22V12"/>
  </svg>
);

const IconTrain = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="3" rx="2"/>
    <path d="M4 11h16"/>
    <path d="M12 3v8"/>
    <path d="m8 19-2 3"/>
    <path d="m18 22-2-3"/>
  </svg>
);

const IconDollar = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const IconMessage = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconSun = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const IconMoon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const IconSparkles = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>
  </svg>
);

const IconEye = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconCheck = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <path d="m9 11 3 3L22 4"/>
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14"/>
  </svg>
);

const IconLogOut = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const IconSend = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4ZM22 2 11 13"/>
  </svg>
);

const IconCopy = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Estados principales
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [salesHistory, setSalesHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');

  // Sistema de Temas (Girly / Clásico con Día / Noche / Auto)
  const [collection, setCollection] = useState(() => localStorage.getItem('theme_collection') || 'girly');
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('theme_light_mode') || 'auto');
  const [isNightTime, setIsNightTime] = useState(false);

  // Modales
  const [selectedVariantModal, setSelectedVariantModal] = useState(null);
  const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  // Formulario Producto Nuevo
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    price: '',
    cost: '',
    variantsInput: 'Rosa Pastel: 10, Blanco Perla: 5'
  });

  // Formulario Entrega Nueva
  const [newDeliveryForm, setNewDeliveryForm] = useState({
    clientName: '',
    phone: '',
    productId: '',
    variantId: '',
    station: METRO_STATIONS[0].name,
    meetingPoint: 'Torniquetes salida andén',
    time: '18:00',
    clientPaysWith: ''
  });

  // Autenticación Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Sincronización en tiempo real
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProducts(data.products || []);
        setDeliveries(data.deliveries || []);
        setSalesHistory(data.salesHistory || []);
      } else {
        // Inicializar documento limpio en la nube
        setDoc(userDocRef, {
          products: [],
          deliveries: [],
          salesHistory: []
        });
        setProducts([]);
        setDeliveries([]);
        setSalesHistory([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const syncWithFirebase = async (newProducts, newDeliveries, newHistory) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        products: newProducts !== undefined ? newProducts : products,
        deliveries: newDeliveries !== undefined ? newDeliveries : deliveries,
        salesHistory: newHistory !== undefined ? newHistory : salesHistory
      }, { merge: true });
    } catch (e) {
      console.error("Error al guardar en Firebase:", e);
    }
  };

  // Botón para purgar datos de prueba si quedaron guardados en Firebase
  const handleResetToZero = async () => {
    if (window.confirm("¿Segura que quieres dejar el inventario y entregas en blanco (0) para empezar de verdad?")) {
      setProducts([]);
      setDeliveries([]);
      setSalesHistory([]);
      await syncWithFirebase([], [], []);
    }
  };

  // Horario Santiago automático
  useEffect(() => {
    const checkTime = () => {
      const santiagoHour = new Date().toLocaleTimeString('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit',
        hour12: false
      });
      const hourNum = parseInt(santiagoHour, 10);
      setIsNightTime(hourNum < 7 || hourNum >= 19);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme_collection', collection);
    localStorage.setItem('theme_light_mode', lightMode);
  }, [collection, lightMode]);

  const isDark = lightMode === 'night' || (lightMode === 'auto' && isNightTime);

  // Paleta de Estilos
  const theme = {
    bg: collection === 'girly'
      ? (isDark ? 'bg-[#0E0916] text-[#F3E8FF]' : 'bg-[#FFF5F8] text-[#4A1D36]')
      : (isDark ? 'bg-[#090A0F] text-[#F1F5F9]' : 'bg-[#F8F9FB] text-[#0F172A]'),
    card: collection === 'girly'
      ? (isDark ? 'bg-[#180F29] border-[#3B1F63]' : 'bg-white border-[#FCE7F3] shadow-sm')
      : (isDark ? 'bg-[#12141F] border-[#242938]' : 'bg-white border-[#E2E8F0] shadow-sm'),
    accent: collection === 'girly'
      ? (isDark ? 'bg-[#9333EA] text-white hover:bg-[#A855F7]' : 'bg-[#EC4899] text-white hover:bg-[#F43F5E]')
      : (isDark ? 'bg-[#10B981] text-black hover:bg-[#34D399]' : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'),
    accentSoft: collection === 'girly'
      ? (isDark ? 'bg-[#3B1F63]/50 text-[#D8B4FE]' : 'bg-[#FDF2F8] text-[#DB2777]')
      : (isDark ? 'bg-[#1E293B] text-[#94A3B8]' : 'bg-[#F1F5F9] text-[#475569]'),
    pillActive: collection === 'girly'
      ? (isDark ? 'bg-[#A855F7] text-white' : 'bg-[#EC4899] text-white')
      : (isDark ? 'bg-[#10B981] text-black' : 'bg-[#0F172A] text-white')
  };

  // Auxiliares de Stock
  const getVariantReserved = (variantId) => deliveries.filter(d => d.status === 'Pendiente' && d.variantId === variantId).length;
  const getProductReserved = (productId) => deliveries.filter(d => d.status === 'Pendiente' && d.productId === productId).length;
  const getProductPhysicalStock = (product) => (product.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  // Crear Producto Nuevo
  const handleAddProduct = (e) => {
    e.preventDefault();
    const parts = newProductForm.variantsInput.split(',').map((item, idx) => {
      const [vName, vStock] = item.split(':');
      return {
        id: 'var-' + Date.now() + '-' + idx,
        name: (vName || 'Estándar').trim(),
        stock: Number((vStock || '0').trim()) || 0
      };
    });

    const newProd = {
      id: 'prod-' + Date.now(),
      name: newProductForm.name,
      price: Number(newProductForm.price) || 0,
      cost: Number(newProductForm.cost) || 0,
      variants: parts.length > 0 ? parts : [{ id: 'var-' + Date.now(), name: 'Único', stock: 1 }]
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    setShowNewProductModal(false);
    setNewProductForm({ name: '', price: '', cost: '', variantsInput: '' });
    syncWithFirebase(updated, deliveries, salesHistory);
  };

  // Acciones de Entrega
  const handleMarkAsDelivered = (deliveryId) => {
    const del = deliveries.find(d => d.id === deliveryId);
    if (!del) return;

    const updatedProducts = products.map(prod => {
      if (prod.id !== del.productId) return prod;
      return {
        ...prod,
        variants: prod.variants.map(v => {
          if (v.id !== del.variantId) return v;
          return { ...v, stock: Math.max(0, (Number(v.stock) || 0) - 1) };
        })
      };
    });

    const updatedDeliveries = deliveries.map(d => d.id === deliveryId ? { ...d, status: 'Entregado' } : d);
    const newSale = {
      id: 'sale-' + Date.now(),
      date: new Date().toISOString(),
      productName: del.productName,
      variantName: del.variantName,
      total: del.totalPrice
    };
    const updatedSales = [newSale, ...salesHistory];

    setProducts(updatedProducts);
    setDeliveries(updatedDeliveries);
    setSalesHistory(updatedSales);
    setSelectedVariantModal(null);
    syncWithFirebase(updatedProducts, updatedDeliveries, updatedSales);
  };

  const handleCancelDelivery = (deliveryId) => {
    const updatedDeliveries = deliveries.map(d => d.id === deliveryId ? { ...d, status: 'Cancelado' } : d);
    setDeliveries(updatedDeliveries);
    setSelectedVariantModal(null);
    syncWithFirebase(products, updatedDeliveries, salesHistory);
  };

  const handleAddDelivery = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newDeliveryForm.productId);
    const variant = prod?.variants.find(v => v.id === newDeliveryForm.variantId);

    const newDel = {
      id: 'del-' + Date.now(),
      clientName: newDeliveryForm.clientName,
      phone: newDeliveryForm.phone,
      productId: newDeliveryForm.productId,
      productName: prod?.name || 'Producto',
      variantId: newDeliveryForm.variantId,
      variantName: variant?.name || 'Estándar',
      station: newDeliveryForm.station,
      meetingPoint: newDeliveryForm.meetingPoint,
      time: newDeliveryForm.time,
      totalPrice: prod?.price || 0,
      clientPaysWith: Number(newDeliveryForm.clientPaysWith) || (prod?.price || 0),
      status: 'Pendiente'
    };

    const updatedDeliveries = [newDel, ...deliveries];
    setDeliveries(updatedDeliveries);
    setShowNewDeliveryModal(false);
    syncWithFirebase(products, updatedDeliveries, salesHistory);
  };

  // Finanzas: 3 Sobres
  const totalRecaudado = salesHistory.reduce((acc, curr) => acc + curr.total, 0);
  const sobreReposicion = Math.round(totalRecaudado * 0.45);
  const sobreTransporte = Math.round(totalRecaudado * 0.10);
  const sobreGananciaLiquida = totalRecaudado - sobreReposicion - sobreTransporte;

  if (loadingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="flex items-center gap-3">
          <IconSparkles className="w-6 h-6 animate-spin text-pink-500" />
          <span className="font-medium text-base">Iniciando sistema...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme.bg}`}>
        <div className={`w-full max-w-sm rounded-3xl p-8 border text-center ${theme.card}`}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-pink-500/10 text-pink-500 mb-4">
            <IconTrain className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Metro Delivery</h1>
          <p className="text-sm opacity-70 mb-6">
            Entregas en andén, stock multi-variante y cobro en efectivo.
          </p>

          <button
            onClick={loginConGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold bg-white text-slate-800 border border-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Ingresar con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col pb-24 ${theme.bg}`}>
      {/* Barra Superior */}
      <header className={`sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between ${theme.card}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500/15 text-pink-500">
            <IconTrain className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none">Metro Delivery</h1>
            <span className="text-[11px] opacity-60 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {user.displayName?.split(' ')[0] || 'Conectada'}
            </span>
          </div>
        </div>

        {/* Selector de Colección y Horario */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCollection(collection === 'girly' ? 'pro' : 'girly')}
            className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1 ${theme.accentSoft}`}
          >
            <IconSparkles className="w-3 h-3" />
            {collection === 'girly' ? 'Girly' : 'Clásico'}
          </button>

          <div className="flex items-center p-0.5 rounded-lg border border-inherit bg-black/5 dark:bg-white/5">
            <button
              onClick={() => setLightMode('day')}
              className={`p-1 rounded ${lightMode === 'day' ? theme.pillActive : 'opacity-60'}`}
              title="Día"
            >
              <IconSun className="w-3 h-3" />
            </button>
            <button
              onClick={() => setLightMode('auto')}
              className={`px-1 text-[9px] font-bold rounded ${lightMode === 'auto' ? theme.pillActive : 'opacity-60'}`}
              title="Automático Santiago"
            >
              AUTO
            </button>
            <button
              onClick={() => setLightMode('night')}
              className={`p-1 rounded ${lightMode === 'night' ? theme.pillActive : 'opacity-60'}`}
              title="Noche"
            >
              <IconMoon className="w-3 h-3" />
            </button>
          </div>

          <button onClick={cerrarSesion} className="p-1 rounded opacity-60 hover:text-red-500" title="Cerrar sesión">
            <IconLogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-6">

        {/* 1. SECCIÓN INVENTARIO */}
        {activeTab === 'inventory' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Inventario & Stock</h2>
                <p className="text-xs opacity-70">Control de variantes y stock en andén</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewProductModal(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-sm ${theme.accent}`}
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  Nuevo Producto
                </button>
                {products.length > 0 && (
                  <button
                    onClick={() => setShowNewDeliveryModal(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-inherit ${theme.accentSoft}`}
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    Agendar
                  </button>
                )}
              </div>
            </div>

            {products.length === 0 ? (
              <div className={`p-8 rounded-3xl border text-center space-y-3 ${theme.card}`}>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <IconPackage className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Tu inventario está completamente limpio</h3>
                  <p className="text-xs opacity-70 mt-1 max-w-xs mx-auto">
                    Comienza agregando los productos que vendes con sus variantes de color o modelo y su stock físico.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewProductModal(true)}
                  className={`inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl shadow-sm ${theme.accent}`}
                >
                  <IconPlus className="w-4 h-4" />
                  Agregar mi Primer Producto
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const physicalTotal = getProductPhysicalStock(product);
                  const reservedTotal = getProductReserved(product.id);
                  const realAvailable = Math.max(0, physicalTotal - reservedTotal);

                  return (
                    <div key={product.id} className={`p-4 rounded-2xl border space-y-3 ${theme.card}`}>
                      <div className="flex items-start justify-between border-b pb-2 border-inherit">
                        <div>
                          <h3 className="font-bold text-sm">{product.name}</h3>
                          <p className="text-[11px] opacity-70">
                            Venta: ${product.price.toLocaleString('es-CL')} | Costo: ${product.cost.toLocaleString('es-CL')}
                          </p>
                        </div>
                      </div>

                      {/* Métricas por Producto */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5">
                          <span className="block text-[10px] opacity-70">Stock Físico</span>
                          <span className="text-base font-extrabold">{physicalTotal}</span>
                        </div>
                        <div className="p-2 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <span className="block text-[10px]">Reservado</span>
                          <span className="text-base font-extrabold">{reservedTotal}</span>
                        </div>
                        <div className="p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <span className="block text-[10px]">Disponible</span>
                          <span className="text-base font-extrabold">{realAvailable}</span>
                        </div>
                      </div>

                      {/* Lista de Variantes */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-semibold opacity-60 uppercase tracking-wider block">
                          Variantes & Modelos
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(product.variants || []).map(variant => {
                            const varReserved = getVariantReserved(variant.id);
                            const varReal = Math.max(0, (Number(variant.stock) || 0) - varReserved);

                            return (
                              <div key={variant.id} className="p-2.5 rounded-xl border border-inherit bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                                <div>
                                  <span className="font-semibold text-xs block">{variant.name}</span>
                                  <span className="text-[10px] opacity-60">Físico: {variant.stock} u.</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <span className="text-xs font-bold block text-emerald-500">{varReal} disp</span>
                                    {varReserved > 0 && (
                                      <span className="text-[10px] text-amber-500 font-medium block">({varReserved} res)</span>
                                    )}
                                  </div>

                                  {varReserved > 0 && (
                                    <button
                                      onClick={() => setSelectedVariantModal({ product, variant })}
                                      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${theme.accentSoft}`}
                                    >
                                      <IconEye className="w-3 h-3" />
                                      Ver clienta
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Botón de Purga si aún quedan datos previos de prueba */}
            {(products.length > 0 || deliveries.length > 0 || salesHistory.length > 0) && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleResetToZero}
                  className="text-xs opacity-50 hover:opacity-100 text-red-500 underline transition-opacity"
                >
                  Restablecer toda la base de datos a cero (0)
                </button>
              </div>
            )}
          </section>
        )}

        {/* 2. SECCIÓN METRO */}
        {activeTab === 'metro' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Ruta & Entregas Metro</h2>
                <p className="text-xs opacity-70">Agenda en andén y cálculo de vueltos</p>
              </div>
              {products.length > 0 && (
                <button
                  onClick={() => setShowNewDeliveryModal(true)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-sm ${theme.accent}`}
                >
                  <IconPlus className="w-4 h-4" />
                  Nueva Entrega
                </button>
              )}
            </div>

            <div className="space-y-3">
              {deliveries.filter(d => d.status === 'Pendiente').length === 0 ? (
                <div className={`p-8 rounded-3xl border text-center opacity-75 ${theme.card}`}>
                  <IconCheck className="w-8 h-8 mx-auto mb-2 opacity-50 text-emerald-500" />
                  <p className="text-xs font-medium">No tienes entregas pendientes en el Metro.</p>
                  <p className="text-[11px] opacity-60 mt-1">
                    Cuando una clienta te pida por WhatsApp, agenda aquí su estación y la app reservará el stock automáticamente.
                  </p>
                </div>
              ) : (
                deliveries
                  .filter(d => d.status === 'Pendiente')
                  .map(delivery => {
                    const vueltoNecesario = Math.max(0, delivery.clientPaysWith - delivery.totalPrice);

                    return (
                      <div key={delivery.id} className={`p-4 rounded-2xl border space-y-3 ${theme.card}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{delivery.clientName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold">
                                {delivery.time} hrs
                              </span>
                            </div>
                            <p className="text-[11px] opacity-70 mt-0.5">
                              {delivery.productName} ({delivery.variantName})
                            </p>
                          </div>
                          <span className="font-extrabold text-xs">${delivery.totalPrice.toLocaleString('es-CL')}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5">
                            <span className="opacity-60 block text-[9px]">Estación / Punto</span>
                            <span className="font-semibold block truncate">{delivery.station}</span>
                            <span className="opacity-70 text-[9px] block truncate">{delivery.meetingPoint}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <span className="opacity-70 block text-[9px]">Paga con</span>
                            <span className="font-bold block">${delivery.clientPaysWith.toLocaleString('es-CL')}</span>
                            <span className="text-[10px] font-semibold block">
                              Vuelto: ${vueltoNecesario.toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <a
                            href={`https://wa.me/${delivery.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`¡Hola ${delivery.clientName}! Voy saliendo a ${delivery.station} para nuestra entrega a las ${delivery.time} hrs. Recuerda que el cobro es en efectivo ($${delivery.totalPrice.toLocaleString('es-CL')}). ¡Nos vemos!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-500 flex items-center gap-1"
                          >
                            <IconSend className="w-3 h-3" />
                            WhatsApp
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCancelDelivery(delivery.id)}
                              className="px-2 py-1 text-[11px] rounded-lg text-red-500 bg-red-500/10 font-semibold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleMarkAsDelivered(delivery.id)}
                              className="px-3 py-1 text-[11px] rounded-lg bg-emerald-500 text-white font-bold"
                            >
                              Cobrado
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN FINANZAS: 3 SOBRES */}
        {activeTab === 'finance' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-base font-bold">Finanzas: Regla de los 3 Sobres</h2>
              <p className="text-xs opacity-70">Distribución de efectivo al cerrar la jornada</p>
            </div>

            <div className={`p-4 rounded-2xl border text-center ${theme.card}`}>
              <span className="text-xs opacity-70 block">Total Efectivo Cobrado</span>
              <span className="text-2xl font-black block mt-1">${totalRecaudado.toLocaleString('es-CL')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                <span className="text-[11px] font-bold text-blue-500 block">Sobre 1: Reposición (45%)</span>
                <span className="text-lg font-extrabold block mt-0.5">${sobreReposicion.toLocaleString('es-CL')}</span>
                <p className="text-[10px] opacity-70 mt-1">Para recomprar stock a proveedores.</p>
              </div>

              <div className="p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <span className="text-[11px] font-bold text-amber-500 block">Sobre 2: Bip! / Metro (10%)</span>
                <span className="text-lg font-extrabold block mt-0.5">${sobreTransporte.toLocaleString('es-CL')}</span>
                <p className="text-[10px] opacity-70 mt-1">Para pasajes y recargas de tarjeta.</p>
              </div>

              <div className="p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                <span className="text-[11px] font-bold text-emerald-500 block">Sobre 3: Ganancia (45%)</span>
                <span className="text-lg font-extrabold block mt-0.5">${sobreGananciaLiquida.toLocaleString('es-CL')}</span>
                <p className="text-[10px] opacity-70 mt-1">Tu ganancia personal líquida disponible.</p>
              </div>
            </div>
          </section>
        )}

        {/* 4. SECCIÓN RESPUESTAS RÁPIDAS */}
        {activeTab === 'responses' && (
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-bold">Plantillas de Respuesta</h2>
              <p className="text-xs opacity-70">Para copiar y pegar directo en WhatsApp</p>
            </div>

            {[
              {
                title: '¿Puedo pagar con transferencia en el andén?',
                body: '¡Hola! Para no atrasar las entregas ni bloquear torniquetes, el cobro en Metro es 100% en efectivo exacto. Por favor lleva el sencillo a mano para que sea súper rápido. ¡Muchas gracias!'
              },
              {
                title: 'Clienta pide rebaja o regateo',
                body: 'Hola, el precio publicado es fijo ya que contempla el costo del producto y el traslado seguro hasta tu estación de entrega. Te aseguro que la calidad te encantará.'
              },
              {
                title: 'Clienta avisa que viene atrasada',
                body: 'Hola, tengo un tiempo de espera de máximo 10 minutos en la estación por la ruta programada. Confírmame si alcanzas a llegar o si coordinamos la entrega para mañana.'
              }
            ].map((resp, i) => (
              <div key={i} className={`p-3 rounded-2xl border space-y-2 ${theme.card}`}>
                <h3 className="font-bold text-xs">{resp.title}</h3>
                <p className="text-xs opacity-80 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl">{resp.body}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(resp.body)}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${theme.accentSoft}`}
                >
                  <IconCopy className="w-3 h-3" />
                  Copiar Mensaje
                </button>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* MODAL AGREGAR PRODUCTO NUEVO */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-5 border space-y-3 ${theme.card}`}>
            <div className="flex items-center justify-between border-b pb-2 border-inherit">
              <h3 className="font-bold text-sm">Nuevo Producto al Inventario</h3>
              <button onClick={() => setShowNewProductModal(false)} className="opacity-60 hover:opacity-100">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  placeholder="Ej: Carcasa Silicona Soft"
                  className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    placeholder="6990"
                    className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Costo ($)</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={newProductForm.cost}
                    onChange={e => setNewProductForm({ ...newProductForm, cost: e.target.value })}
                    placeholder="2500"
                    className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Variantes & Stock Inicial</label>
                <p className="text-[10px] opacity-60 mb-1.5">Formato: Nombre: Stock, separados por coma</p>
                <textarea
                  rows="2"
                  required
                  value={newProductForm.variantsInput}
                  onChange={e => setNewProductForm({ ...newProductForm, variantsInput: e.target.value })}
                  placeholder="Rosa: 10, Negro: 5, Lavanda: 8"
                  className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md mt-1 ${theme.accent}`}
              >
                Guardar Producto en Base de Datos
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER CLIENTA */}
      {selectedVariantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-4 border space-y-3 ${theme.card}`}>
            <div className="flex items-center justify-between border-b pb-2 border-inherit">
              <div>
                <h3 className="font-bold text-xs">Entregas Asociadas</h3>
                <p className="text-[10px] opacity-70">
                  {selectedVariantModal.product.name} — {selectedVariantModal.variant.name}
                </p>
              </div>
              <button onClick={() => setSelectedVariantModal(null)} className="opacity-60 hover:opacity-100">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {deliveries
                .filter(d => d.status === 'Pendiente' && d.variantId === selectedVariantModal.variant.id)
                .map(del => (
                  <div key={del.id} className="p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{del.clientName}</span>
                      <span className="text-xs font-bold text-pink-500">${del.totalPrice.toLocaleString('es-CL')}</span>
                    </div>
                    <p className="text-[10px] opacity-70">
                      📍 {del.station} a las {del.time} hrs
                    </p>
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => handleCancelDelivery(del.id)}
                        className="px-2 py-0.5 text-[10px] rounded-lg text-red-500 bg-red-500/10 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleMarkAsDelivered(del.id)}
                        className="px-2.5 py-0.5 text-[10px] rounded-lg bg-emerald-500 text-white font-bold"
                      >
                        Cobrado
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL AGENDAR ENTREGA */}
      {showNewDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-4 border space-y-3 ${theme.card}`}>
            <div className="flex items-center justify-between border-b pb-2 border-inherit">
              <h3 className="font-bold text-sm">Nueva Entrega Metro</h3>
              <button onClick={() => setShowNewDeliveryModal(false)} className="opacity-60 hover:opacity-100">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDelivery} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-semibold mb-0.5">Nombre Clienta</label>
                <input
                  type="text"
                  required
                  value={newDeliveryForm.clientName}
                  onChange={e => setNewDeliveryForm({ ...newDeliveryForm, clientName: e.target.value })}
                  placeholder="Ej: Camila Silva"
                  className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-0.5">WhatsApp (+569...)</label>
                <input
                  type="tel"
                  required
                  value={newDeliveryForm.phone}
                  onChange={e => setNewDeliveryForm({ ...newDeliveryForm, phone: e.target.value })}
                  placeholder="+56912345678"
                  className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-0.5">Producto</label>
                  <select
                    required
                    value={newDeliveryForm.productId}
                    onChange={e => {
                      const pId = e.target.value;
                      const prod = products.find(p => p.id === pId);
                      setNewDeliveryForm({
                        ...newDeliveryForm,
                        productId: pId,
                        variantId: prod?.variants[0]?.id || ''
                      });
                    }}
                    className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none text-[11px]"
                  >
                    <option value="">Selecciona...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-0.5">Color / Modelo</label>
                  <select
                    required
                    value={newDeliveryForm.variantId}
                    onChange={e => setNewDeliveryForm({ ...newDeliveryForm, variantId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none text-[11px]"
                  >
                    <option value="">Selecciona...</option>
                    {products
                      .find(p => p.id === newDeliveryForm.productId)
                      ?.variants.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.stock} disp)</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-0.5">Estación Metro</label>
                  <select
                    value={newDeliveryForm.station}
                    onChange={e => setNewDeliveryForm({ ...newDeliveryForm, station: e.target.value })}
                    className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none text-[11px]"
                  >
                    {METRO_STATIONS.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-0.5">Hora</label>
                  <input
                    type="time"
                    required
                    value={newDeliveryForm.time}
                    onChange={e => setNewDeliveryForm({ ...newDeliveryForm, time: e.target.value })}
                    className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-0.5">Punto en Andén</label>
                <input
                  type="text"
                  required
                  value={newDeliveryForm.meetingPoint}
                  onChange={e => setNewDeliveryForm({ ...newDeliveryForm, meetingPoint: e.target.value })}
                  placeholder="Ej: Torniquetes salida norte"
                  className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-0.5">Paga con ($)</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={newDeliveryForm.clientPaysWith}
                  onChange={e => setNewDeliveryForm({ ...newDeliveryForm, clientPaysWith: e.target.value })}
                  placeholder="Ej: 10000"
                  className="w-full p-2 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md mt-1 ${theme.accent}`}
              >
                Confirmar y Reservar Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Barra Inferior */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-lg flex justify-around py-2 ${theme.card}`}>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold ${activeTab === 'inventory' ? theme.pillActive : 'opacity-60'}`}
        >
          <IconPackage className="w-4 h-4" />
          Inventario
        </button>

        <button
          onClick={() => setActiveTab('metro')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold ${activeTab === 'metro' ? theme.pillActive : 'opacity-60'}`}
        >
          <IconTrain className="w-4 h-4" />
          Metro
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold ${activeTab === 'finance' ? theme.pillActive : 'opacity-60'}`}
        >
          <IconDollar className="w-4 h-4" />
          Finanzas
        </button>

        <button
          onClick={() => setActiveTab('responses')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold ${activeTab === 'responses' ? theme.pillActive : 'opacity-60'}`}
        >
          <IconMessage className="w-4 h-4" />
          Respuestas
        </button>
      </nav>
    </div>
  );
}