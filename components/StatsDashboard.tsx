import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { OrderItem } from '../types';

interface StatsDashboardProps {
  orders: OrderItem[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ orders }) => {
  
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = { pizza: 0, sobremesa: 0, bebida: 0 };
    orders.forEach(o => {
      if (counts[o.categoria] !== undefined) {
        counts[o.categoria] += o.quantidade;
      }
    });
    return [
      { name: 'Pizzas', value: counts.pizza, color: '#FF6B00' },
      { name: 'Sobremesas', value: counts.sobremesa, color: '#A855F7' },
      { name: 'Bebidas', value: counts.bebida, color: '#3B82F6' },
    ].filter(d => d.value > 0);
  }, [orders]);

  if (orders.length === 0) return null;

  return (
    <div className="stats-card">
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Resumo do Carrinho</h3>
      
      <div className="stats-grid">
        {/* Pie Chart - Distribution */}
        <div className="w-full" style={{ height: '100%' }}>
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={categoryData}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={5}
                 dataKey="value"
               >
                 {categoryData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.color} />
                 ))}
               </Pie>
               <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
               />
               <Legend verticalAlign="bottom" height={36}/>
             </PieChart>
           </ResponsiveContainer>
        </div>

        {/* Summary Numbers */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <div className="stat-box orange">
              <span className="stat-label">Total de Itens</span>
              <p className="stat-value">{orders.reduce((acc, o) => acc + o.quantidade, 0)}</p>
           </div>
           <div className="stat-box blue">
              <span className="stat-label">Variedade</span>
              <p className="stat-value">{categoryData.length} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>Categorias</span></p>
           </div>
        </div>
      </div>
    </div>
  );
};