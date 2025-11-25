// backend/src/server.ts

import * as nfeService from './nfeService.js';
import express from 'express';
import * as db from './database.js';
import { PizzariaEntrada } from './types.js';
import * as fs from 'fs';
import * as path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json() as any);
app.use(cors() as any);

// Configuração do CSV (Relative to project root)
const CSV_DIR = path.join(process.cwd(), 'csv');
if (!fs.existsSync(CSV_DIR)) {
  fs.mkdirSync(CSV_DIR, { recursive: true });
}

const ARQ = {
  ativos: path.join(CSV_DIR, 'ativos.csv'),
  historico: path.join(CSV_DIR, 'historico.csv')
};

function csvSafe(s: any): string {
  const str = String(s ?? '');
  return /,|"|\n/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// --- ROTAS ---

app.post('/api/pedidos', async (req, res) => {
  try {
    const d = req.body;
    const newPedidoDados: PizzariaEntrada = {
      cliente: d.cliente,
      telefone: d.telefone,
      endereco: d.endereco,
      cpf: d.cpf,
      nomeItem: d.nome,
      pedidoPizza: d.nome,
      categoria: d.categoria,
      tamanhoPizza: d.tamanho,
      quantidadePizza: d.quantidade,
      observacao: d.observacao,
      itemExtra: Array.isArray(d.ingredientesRemovidos) ? `Sem: ${d.ingredientesRemovidos.join(', ')}` : '',
      precoTotal: d.precoTotal,
      formaPagamento: 'Dinheiro'
    };

    const saved = await db.insertPedido(newPedidoDados);
    
    // Append to CSV
    const csvRow = [
      saved.idPedido,
      csvSafe(saved.cliente),
      csvSafe(saved.nomeItem),
      saved.precoTotal
    ].join(',') + '\n';
    await fs.promises.appendFile(ARQ.ativos, csvRow).catch(console.error);

    res.status(201).json(saved);
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.get('/api/pedidos', async (_req, res) => {
  try {
    const pedidos = await db.getAllPedidos();
    const pedidosFormatados = pedidos.map(p => ({
        id: p.idPedido,
        nome: p.nomeItem || p.pedidoPizza,
        cliente: p.cliente,
        telefone: p.telefone,
        endereco: p.endereco,
        precoTotal: p.precoTotal,
        quantidade: p.quantidadePizza,
        tamanho: p.tamanhoPizza,
        categoria: p.categoria,
        observacao: p.observacao,
        ingredientesRemovidos: p.itemExtra && p.itemExtra.startsWith('Sem:') 
            ? p.itemExtra.replace('Sem: ', '').split(', ') 
            : []
    }));
    res.json(pedidosFormatados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar' });
  }
});

app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const d = req.body;
    
    const updateData: Partial<PizzariaEntrada> = {};
    if (d.cliente) updateData.cliente = d.cliente;
    if (d.telefone) updateData.telefone = d.telefone;
    if (d.endereco) updateData.endereco = d.endereco;
    if (d.quantidade !== undefined) updateData.quantidadePizza = d.quantidade;
    if (d.tamanho) updateData.tamanhoPizza = d.tamanho;
    if (d.observacao !== undefined) updateData.observacao = d.observacao;
    if (d.ingredientesRemovidos !== undefined) {
         updateData.itemExtra = Array.isArray(d.ingredientesRemovidos) 
          ? `Sem: ${d.ingredientesRemovidos.join(', ')}` 
          : '';
    }
    if (d.precoTotal !== undefined) updateData.precoTotal = d.precoTotal;

    const updated = await db.updatePedido(id, updateData);
    
    // Return formatted for frontend
    if (updated) {
       const formatted = {
          id: updated.idPedido,
          nome: updated.nomeItem || updated.pedidoPizza,
          cliente: updated.cliente,
          telefone: updated.telefone,
          endereco: updated.endereco,
          precoTotal: updated.precoTotal,
          quantidade: updated.quantidadePizza,
          tamanho: updated.tamanhoPizza,
          categoria: updated.categoria,
          observacao: updated.observacao,
          ingredientesRemovidos: updated.itemExtra && updated.itemExtra.startsWith('Sem:') 
              ? updated.itemExtra.replace('Sem: ', '').split(', ') 
              : []
       };
       res.json(formatted);
    } else {
       res.status(404).json({error: 'Pedido não encontrado'});
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.deletePedido(id);
    res.json({ message: 'Deletado', id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar' });
  }
});

app.delete('/api/pedidos', async (req, res) => {
    try {
        const pool = await db.getPool();
        await pool.request().query("DELETE FROM Pedidos");
        res.json({ message: 'Limpo' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao limpar' });
    }
});

db.initializeDatabase().then(() => {
    app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
});