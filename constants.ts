import { Product } from './types';

export const PIZZAS: Product[] = [
    { id: 'p1', nome: "4 Queijos", preco: 48, categoria: 'pizza', img: "/img/4queijos.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Parmesão", "Provolone", "Gorgonzola", "Orégano"] },
    { id: 'p2', nome: "Atum", preco: 42, categoria: 'pizza', img: "/img/atum.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Atum Sólido", "Cebola", "Orégano"] },
    { id: 'p3', nome: "Banana com Doce de Leite", preco: 44, categoria: 'pizza', img: "/img/banana-doce-leite.jpg", ingredientes: ["Muçarela", "Banana", "Doce de Leite", "Canela"] },
    { id: 'p4', nome: "Brócolis com Catupiry", preco: 42, categoria: 'pizza', img: "/img/brocolis-com-catupiry.jpeg", ingredientes: ["Molho de Tomate", "Muçarela", "Brócolis", "Catupiry", "Alho Frito"] },
    { id: 'p5', nome: "Calabresa", preco: 40, categoria: 'pizza', img: "/img/calabresa.jpg", ingredientes: ["Molho de Tomate", "Muçarela", "Calabresa Fatiada", "Cebola", "Azeitona"] },
    { id: 'p6', nome: "Camarão com Catupiry", preco: 55, categoria: 'pizza', img: "/img/camarao-c-catupiry.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Camarão", "Catupiry", "Salsinha"] },
    { id: 'p7', nome: "Chocolate", preco: 38, categoria: 'pizza', img: "/img/chocolate.jpg", ingredientes: ["Muçarela", "Chocolate ao Leite", "Granulado"] },
    { id: 'p8', nome: "Frango com Catupiry", preco: 45, categoria: 'pizza', img: "/img/frango-catupiry.jpg", ingredientes: ["Molho de Tomate", "Muçarela", "Frango Desfiado", "Catupiry", "Milho"] },
    { id: 'p9', nome: "Milho com Bacon", preco: 44, categoria: 'pizza', img: "/img/milho-com-bacon.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Milho Verde", "Bacon Crocante"] },
    { id: 'p10', nome: "Moda da Casa", preco: 48, categoria: 'pizza', img: "/img/moda-da-casa.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Presunto", "Ovo", "Ervilha", "Palmito", "Cebola"] },
    { id: 'p11', nome: "Muçarela", preco: 35, categoria: 'pizza', img: "/img/muçarella.png", ingredientes: ["Molho de Tomate", "Muçarela", "Rodelas de Tomate", "Orégano"] },
    { id: 'p12', nome: "Napolitana", preco: 40, categoria: 'pizza', img: "/img/napolitana.jpg", ingredientes: ["Molho de Tomate", "Muçarela", "Rodelas de Tomate", "Parmesão", "Alho"] },
    { id: 'p13', nome: "Pepperoni", preco: 48, categoria: 'pizza', img: "/img/pepperoni.webp", ingredientes: ["Molho de Tomate", "Muçarela", "Pepperoni", "Orégano"] },
    { id: 'p14', nome: "Portuguesa", preco: 50, categoria: 'pizza', img: "/img/portuguesa.jpg", ingredientes: ["Molho de Tomate", "Muçarela", "Presunto", "Ovo", "Cebola", "Ervilha", "Azeitona"] }
];

export const SOBREMESAS: Product[] = [
    { id: 's1', nome: "Brownie", preco: 12, categoria: 'sobremesa', img: "/img/sobremesas/brownie.jpg", ingredientes: [] },
    { id: 's2', nome: "Sorvete", preco: 10, categoria: 'sobremesa', img: "/img/sobremesas/sorvete.jpg", ingredientes: [] },
    { id: 's3', nome: "Pudim", preco: 8, categoria: 'sobremesa', img: "/img/sobremesas/pudim.jpg", ingredientes: [] },
    { id: 's4', nome: "Bolo de Chocolate", preco: 9, categoria: 'sobremesa', img: "/img/sobremesas/bolo.jpg", ingredientes: [] },
    { id: 's7', nome: "Brigadeiro", preco: 4, categoria: 'sobremesa', img: "/img/sobremesas/Brigadeiro.jpg", ingredientes: [] },
];

export const BEBIDAS: Product[] = [
    { id: 'b1', nome: "Coca-Cola Lata", preco: 6, categoria: 'bebida', img: "/img/bebidas/coca-cola.jpg", ingredientes: [] },
    { id: 'b5', nome: "Suco Natural", preco: 8, categoria: 'bebida', img: "/img/bebidas/suco-natural.jpg", ingredientes: ["Laranja", "Gelo"] },
    { id: 'b6', nome: "Água Mineral", preco: 4, categoria: 'bebida', img: "/img/bebidas/agua.jpg", ingredientes: [] },
];

export const CATALOGO: Product[] = [...PIZZAS, ...SOBREMESAS, ...BEBIDAS];