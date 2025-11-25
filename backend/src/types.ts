// backend/src/types.ts

export type Tamanho = "Pequena" | "Média" | "Grande" | "Família" | "Padrão";
export type FormaPagamento = "Dinheiro" | "Cartão" | "PIX";

export interface PizzariaEntrada {
  idPedido?: number;
  
  // Dados Cliente
  cliente: string;
  telefone: string;
  endereco?: string; // Novo
  cpf?: string;      // Novo
  enderecoEntrega?: string; // Legado
  cpfNota?: string; // Legado

  // Item
  nomeItem?: string; // Novo (Unificado)
  categoria?: string;
  tamanhoPizza?: string; // Usado para tamanho geral
  quantidadePizza?: number; // Usado para quantidade geral
  
  observacao?: string; // Novo
  itemExtra?: string; // Usado para "Sem ingredientes"

  // Legado (Mantido para evitar quebras se usar endpoints antigos)
  pedidoPizza?: string;
  pedidoBebida?: string;
  sobremesa?: string;
  bordaRecheada?: boolean;
  quantidadeBebidas?: number;
  quantidadeSobremesa?: number;
  
  // Financeiro
  precoTotal: number;
  precoItemExtra?: number; 
  formaPagamento?: string;
  
  // Sistema
  horaPedido?: string;
  horaSaida?: string;
  nfeStatus?: string;
  nfeUrl?: string;
}