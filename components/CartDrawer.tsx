import React from 'react';
import { X, Trash2, ShoppingBag, Pencil } from 'lucide-react';
import { OrderItem } from '../types';
import { formatCurrency } from '../utils';
import { Button } from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
  onEdit: (order: OrderItem) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, orders, onRemove, onUpdateQuantity, onEdit, onCheckout 
}) => {
  const subtotal = orders.reduce((acc, order) => acc + order.precoTotal, 0);

  return (
    <div className={`drawer-container ${isOpen ? 'open' : ''}`}>
      <div className="drawer-backdrop" onClick={onClose} />

      <div className="drawer-panel">
        
        {/* Header */}
        <div className="drawer-header">
          <h2 className="drawer-title">
            <ShoppingBag className="text-primary" size={24} />
            Seu Pedido
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="drawer-body custom-scrollbar">
          {orders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
              <div style={{ opacity: 0.5 }}>
                <ShoppingBag size={64} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }} />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.125rem' }}>Sua sacola está vazia</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>Adicione itens para começar seu pedido</p>
              <Button variant="secondary" onClick={onClose} style={{ marginTop: '1.5rem' }}>
                Voltar ao Cardápio
              </Button>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="cart-item">
                <div style={{ flex: 1 }}>
                  <div className="cart-item-header">
                    <h4 className="cart-item-name">{order.nome}</h4>
                    <span className="cart-item-price">{formatCurrency(order.precoTotal)}</span>
                  </div>
                  <p className="cart-item-details">
                    {order.tamanho} • {order.quantidade}x {formatCurrency(order.precoUnitario)}
                  </p>
                  
                  {order.ingredientesRemovidos && order.ingredientesRemovidos.length > 0 && (
                     <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem' }}>Sem: {order.ingredientesRemovidos.join(', ')}</p>
                  )}
                   {order.observacao && (
                     <p style={{ fontSize: '0.75rem', color: '#3b82f6', fontStyle: 'italic' }}>" {order.observacao} "</p>
                  )}

                  <div className="cart-controls">
                    <div className="qty-selector">
                      <button 
                        onClick={() => onUpdateQuantity(order.id, order.quantidade - 1)}
                        className="qty-btn"
                        disabled={order.quantidade <= 1}
                        style={{ opacity: order.quantidade <= 1 ? 0.3 : 1 }}
                      > - </button>
                      <span className="qty-value">{order.quantidade}</span>
                      <button 
                        onClick={() => onUpdateQuantity(order.id, order.quantidade + 1)}
                        className="qty-btn"
                      > + </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onEdit(order)}
                        className="edit-btn"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onRemove(order.id)}
                        className="remove-btn"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Total do Pedido</span>
              <span className="total-amount">{formatCurrency(subtotal)}</span>
            </div>
            <Button onClick={onCheckout} fullWidth>
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};