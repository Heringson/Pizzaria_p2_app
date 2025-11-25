import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Moon, Sun, ShoppingCart, Pizza, LayoutGrid, X } from 'lucide-react';
import { CATALOGO } from './constants';
import { Category, OrderItem, Product } from './types';
import { ProductCard } from './components/ProductCard';
import { OrderModal } from './components/OrderModal';
import { CartDrawer } from './components/CartDrawer';
import { StatsDashboard } from './components/StatsDashboard';
import { api } from './services/api';
import { generateReceipt, generateCSV, generateTXT } from './utils';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // Mobile Search State

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  
  const [cartBump, setCartBump] = useState(false);
  const prevOrdersLength = useRef(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > prevOrdersLength.current) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 300);
      return () => clearTimeout(timer);
    }
    prevOrdersLength.current = orders.length;
  }, [orders.length]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await api.getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  const filteredCatalog = useMemo(() => {
    const terms = searchTerm.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
    return CATALOGO.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.categoria === activeCategory;
      if (!matchesCategory) return false;
      if (terms.length === 0) return true;
      const searchableText = `${item.nome} ${item.categoria} ${item.ingredientes ? item.ingredientes.join(' ') : ''}`.toLowerCase();
      return terms.every(term => searchableText.includes(term));
    });
  }, [activeCategory, searchTerm]);

  const handleAddClick = (product: Product) => {
    setSelectedProduct(product);
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleEditOrder = (order: OrderItem) => {
    const product = CATALOGO.find(p => p.nome === order.nome);
    if (product) {
      setSelectedProduct(product);
      setEditingOrder(order);
      setIsModalOpen(true);
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmOrder = async (orderData: Omit<OrderItem, 'id' | 'criadoEm'>) => {
    try {
      if (editingOrder) {
        const updated = await api.updateOrder(editingOrder.id, orderData);
        if (updated) {
          setOrders(prev => prev.map(o => o.id === editingOrder.id ? updated : o));
        }
      } else {
        const newOrder = await api.createOrder(orderData);
        if (newOrder) {
          setOrders(prev => [newOrder, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      alert("Erro ao salvar pedido.");
    }
  };

  const handleRemoveOrder = async (id: number) => {
    if (window.confirm('Remover este item do carrinho?')) {
      const success = await api.deleteOrder(id);
      if (success) {
        setOrders(prev => prev.filter(o => o.id !== id));
      }
    }
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
     if (newQuantity < 1) return;
     setOrders(prev => prev.map(o => o.id === id ? { ...o, quantidade: newQuantity } : o));
     await api.updateOrder(id, { quantidade: newQuantity });
  };

  const handleCheckout = async () => {
    if (orders.length === 0) return;
    if (window.confirm(`Finalizar ${orders.length} pedidos e baixar comprovantes?`)) {
      try {
        // Gerar Arquivos
        generateCSV(orders);
        generateTXT(orders);
        
        // Clear Backend/Local State
        await api.clearOrders();
        setOrders([]);
        setIsDrawerOpen(false);

        // Generate Receipt (Browser Print)
        generateReceipt(orders);

      } catch (error) {
        console.error(error);
        alert("Erro ao finalizar pedido.");
      }
    }
  };

  return (
    <div className="app-container">
      
      {/* Header */}
      <header className="app-header">
        <div className="container flex items-center justify-between w-full h-full relative">
          
          {/* Mobile Search Overlay Mode */}
          {isMobileSearchOpen ? (
            <div className="mobile-search-bar animate-in">
              <Search className="text-primary" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Buscar..." 
                className="mobile-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => setIsMobileSearchOpen(false)} className="action-btn">
                <X size={20} />
              </button>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div className="logo-container" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="logo-icon">
                  <Pizza color="white" size={24} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  Pizza<span className="text-primary">One</span>
                </h1>
              </div>

              {/* Desktop Search Bar */}
              <div className="search-container desktop-only">
                <div className="search-icon">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nome ou ingredientes..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Header Actions */}
              <div className="header-actions">
                {/* Mobile Search Trigger */}
                <button 
                  className="action-btn mobile-search-trigger" 
                  onClick={() => setIsMobileSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <button onClick={toggleTheme} className="action-btn" aria-label="Toggle Theme">
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className={`action-btn ${cartBump ? 'bump' : ''}`}
                  aria-label="Open Cart"
                >
                  <ShoppingCart size={22} />
                  {orders.length > 0 && (
                    <span className="badge">{orders.length}</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        
        <div className="hero">
          <h2 className="hero-title">
            O sabor que você <span className="text-primary">merece</span>
          </h2>
          <p className="hero-subtitle">
             {loading ? 'Carregando cardápio...' : 'Monte seu pedido ideal, com os ingredientes que você ama.'}
          </p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
           {['all', 'pizza', 'sobremesa', 'bebida'].map((cat) => (
             <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category | 'all')}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
             >
               {cat === 'all' && <LayoutGrid size={16} />}
               <span style={{ textTransform: 'capitalize' }}>{cat === 'all' ? 'Todos' : cat + 's'}</span>
             </button>
           ))}
        </div>

        {/* Product Grid */}
        {filteredCatalog.length > 0 ? (
          <div className="product-grid">
            {filteredCatalog.map(item => (
              <ProductCard key={item.id} product={item} onAdd={handleAddClick} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nenhum item encontrado</h3>
          </div>
        )}

        <StatsDashboard orders={orders} />

      </main>

      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        orders={orders}
        onRemove={handleRemoveOrder}
        onUpdateQuantity={handleUpdateQuantity}
        onEdit={handleEditOrder}
        onCheckout={handleCheckout}
      />

      <OrderModal 
        isOpen={isModalOpen}
        product={selectedProduct}
        editingOrder={editingOrder}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />

    </div>
  );
}

export default App;