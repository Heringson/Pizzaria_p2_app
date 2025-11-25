import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="product-card">
      <div className="card-image-container">
        <img 
          src={product.img} 
          alt={product.nome} 
          className="card-image"
        />
        <div className="card-overlay"></div>
        <div className="card-badge">
          {product.categoria}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">
          {product.nome}
        </h3>
        
        {product.ingredientes.length > 0 && (
          <p className="card-ingredients">
            {product.ingredientes.join(', ')}
          </p>
        )}
        
        <div className="card-footer">
          <span className="card-price">
            {formatCurrency(product.preco)}
          </span>
          
          <button
            onClick={() => onAdd(product)}
            className="add-btn"
          >
            <Plus size={16} />
            Pedir
          </button>
        </div>
      </div>
    </div>
  );
};