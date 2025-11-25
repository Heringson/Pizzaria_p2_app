import React, { useState, useEffect } from 'react';
import { X, Check, User, MapPin, Phone, FileText } from 'lucide-react';
import { Product, OrderItem } from '../types';
import { formatCurrency, calculateItemPrice } from '../utils';
import { Button } from './Button';

interface OrderModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (order: Omit<OrderItem, 'id' | 'criadoEm'>) => void;
  editingOrder?: OrderItem | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, product, onClose, onConfirm, editingOrder }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Médio');
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [obs, setObs] = useState('');

  // Estados dos Dados do Cliente
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingOrder) {
        setQuantity(editingOrder.quantidade);
        setSize(editingOrder.tamanho);
        setRemovedIngredients(editingOrder.ingredientesRemovidos || []);
        setObs(editingOrder.observacao || '');
        
        // Carrega dados do pedido em edição
        setCustomerName(editingOrder.cliente);
        setCustomerPhone(editingOrder.telefone);
        setCustomerAddress(editingOrder.endereco);
        setCustomerCpf(editingOrder.cpf || '');
      } else {
        setQuantity(1);
        setSize('Médio');
        setRemovedIngredients([]);
        setObs('');

        // Tenta carregar dados salvos anteriormente no LocalStorage para agilizar
        const savedCustomer = localStorage.getItem('last_customer_data');
        if (savedCustomer) {
            const parsed = JSON.parse(savedCustomer);
            setCustomerName(parsed.name || '');
            setCustomerPhone(parsed.phone || '');
            setCustomerAddress(parsed.address || '');
            setCustomerCpf(parsed.cpf || '');
        } else {
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setCustomerCpf('');
        }
      }
    }
  }, [isOpen, product, editingOrder]);

  if (!isOpen || !product) return null;

  const toggleIngredient = (ing: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const totalPrice = calculateItemPrice(product.preco, quantity, product.categoria, size);

  const handleConfirm = () => {
    if (!customerName || !customerPhone || !customerAddress) {
        alert("Por favor, preencha os dados obrigatórios do cliente (Nome, Telefone e Endereço).");
        return;
    }

    // Salva dados para o próximo pedido
    localStorage.setItem('last_customer_data', JSON.stringify({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        cpf: customerCpf
    }));

    onConfirm({
      nome: product.nome,
      quantidade: quantity,
      tamanho: size,
      precoUnitario: product.preco,
      precoTotal: totalPrice,
      categoria: product.categoria,
      ingredientesRemovidos: removedIngredients,
      observacao: obs,
      // Novos campos
      cliente: customerName,
      telefone: customerPhone,
      endereco: customerAddress,
      cpf: customerCpf
    });
  };

  return (
    <div className="modal-container">
      <div className="overlay" onClick={onClose} />
      
      <div className="modal-content">
        <div className="modal-header">
          <img src={product.img} alt={product.nome} className="modal-hero-image" />
          <div className="card-overlay" />
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
          <div className="modal-title">{product.nome}</div>
        </div>

        <div className="modal-body custom-scrollbar">
          
          {/* Tamanho */}
          <div className="form-group">
            <label className="form-label">Tamanho</label>
            <div className="options-grid">
              {['Pequena', 'Médio', 'Grande', 'Família'].map(s => {
                if (product.categoria !== 'pizza' && (s === 'Pequena' || s === 'Família')) return null;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`option-btn ${size === s ? 'selected' : ''}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredientes (Remoção) */}
          {product.ingredientes.length > 0 && (
            <div className="form-group">
              <label className="form-label">
                Ingredientes <span style={{ fontWeight: 'normal', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(Toque para remover)</span>
              </label>
              <div className="ingredients-flex">
                {product.ingredientes.map(ing => (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`ingredient-chip ${removedIngredients.includes(ing) ? 'removed' : 'included'}`}
                  >
                     {ing}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dados do Cliente - Seção Nova */}
          <div style={{ marginTop: '2rem', marginBottom: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} /> Dados do Cliente
            </h4>
            
            <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Seu nome"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            <div className="options-grid" style={{ marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Telefone *</label>
                    <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '1rem', color: 'var(--text-secondary)' }} />
                        <input 
                            type="tel" 
                            className="form-input" 
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="(00) 00000-0000"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                    </div>
                </div>
                 <div style={{ flex: 1 }}>
                    <label className="form-label">CPF (Opcional)</label>
                    <div style={{ position: 'relative' }}>
                        <FileText size={16} style={{ position: 'absolute', left: '0.75rem', top: '1rem', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            className="form-input" 
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Apenas números"
                            value={customerCpf}
                            onChange={(e) => setCustomerCpf(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Endereço de Entrega *</label>
                 <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '1rem', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        className="form-input" 
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Rua, Número, Bairro e Complemento"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                </div>
            </div>
          </div>

          {/* Observação */}
          <div className="form-group">
             <label className="form-label">Observação do Item</label>
             <textarea 
                className="text-area"
                rows={2}
                placeholder="Ex: Tocar a campainha, caprichar no orégano..."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
             />
          </div>

          {/* Quantidade */}
          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span className="form-label" style={{ marginBottom: 0 }}>Quantidade</span>
             <div className="qty-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="qty-btn"
                  style={{ color: 'var(--primary)' }}
                >
                  +
                </button>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <div className="price-tag">
            <span className="price-label">Total estimado</span>
            <span className="price-value">{formatCurrency(totalPrice)}</span>
          </div>
          <Button onClick={handleConfirm} style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
            {editingOrder ? 'Salvar' : 'Confirmar'} <Check size={18} />
          </Button>
        </div>

      </div>
    </div>
  );
};