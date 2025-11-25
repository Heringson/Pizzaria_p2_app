export type Category = 'pizza' | 'sobremesa' | 'bebida';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: Category;
  img: string;
  ingredientes: string[];
}

export interface OrderItem {
  id: number;
  nome: string;
  quantidade: number;
  tamanho: string;
  observacao?: string;
  precoUnitario: number;
  precoTotal: number;
  categoria: Category;
  ingredientesRemovidos?: string[]; // Para lógica de "Sem: ..."
  criadoEm: string;
  
  // Dados do Cliente
  cliente: string;
  telefone: string;
  endereco: string;
  cpf?: string;
}

export interface StatsData {
  name: string;
  value: number;
}