// backend/src/database.ts

import sql from 'mssql';
import { PizzariaEntrada } from './types.js';

export const sqlConfig: sql.config = {
  user: 'sa',
  password: 'SuaSenhaForte123!', 
  database: 'PizzariaDB',
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let appPool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (appPool && appPool.connected) {
    return appPool;
  }
  try {
    appPool = await sql.connect(sqlConfig);
    return appPool;
  } catch (err) {
    console.error('Erro ao conectar ao pool:', err);
    throw err;
  }
}

export async function initializeDatabase() {
  try {
    // 1. Verifica/Cria o Banco (Master)
    const masterConfig = { ...sqlConfig, database: 'master' };
    const poolMaster = await new sql.ConnectionPool(masterConfig).connect();
    
    const dbCheck = await poolMaster.request().query(`
      SELECT name FROM master.dbo.sysdatabases WHERE name = '${sqlConfig.database}'
    `);

    if (dbCheck.recordset.length === 0) {
      console.log(`Banco ${sqlConfig.database} não encontrado. Criando...`);
      await poolMaster.request().query(`CREATE DATABASE ${sqlConfig.database}`);
    }
    await poolMaster.close();

    // 2. Conecta no Banco Correto
    const pool = await getPool();
    console.log('Conectado ao SQL Server com sucesso.');

    await criarTabelaPedidos(pool);

  } catch (err) {
    console.error('Erro ao inicializar o SQL Server:', err);
    throw err;
  }
}

async function criarTabelaPedidos(pool: sql.ConnectionPool) {
  try {
    const queryCreate = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pedidos' AND xtype='U')
      CREATE TABLE Pedidos (
        idPedido INT IDENTITY(1,1) PRIMARY KEY,
        cliente NVARCHAR(100),
        telefone NVARCHAR(20),
        pedidoPizza NVARCHAR(MAX),
        pedidoBebida NVARCHAR(MAX),
        tamanhoPizza NVARCHAR(50),
        quantidadePizza INT,
        bordaRecheada BIT,
        quantidadeBebidas INT,
        sobremesa NVARCHAR(MAX),
        quantidadeSobremesa INT,
        enderecoEntrega NVARCHAR(255),
        horaPedido DATETIME,
        formaPagamento NVARCHAR(50),
        itemExtra NVARCHAR(MAX),
        precoItemExtra DECIMAL(10,2),
        precoTotal DECIMAL(10,2),
        cpfNota NVARCHAR(20) DEFAULT NULL,
        nfeUrl NVARCHAR(255) DEFAULT NULL,
        nfeStatus NVARCHAR(20) DEFAULT 'Pendente'
      )
    `;
    await pool.request().query(queryCreate);

    // Migrações
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'endereco' AND Object_ID = Object_ID(N'Pedidos'))
      ALTER TABLE Pedidos ADD endereco NVARCHAR(255);
    `);
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'cpf' AND Object_ID = Object_ID(N'Pedidos'))
      ALTER TABLE Pedidos ADD cpf NVARCHAR(20);
    `);
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'observacao' AND Object_ID = Object_ID(N'Pedidos'))
      ALTER TABLE Pedidos ADD observacao NVARCHAR(MAX);
    `);
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'nomeItem' AND Object_ID = Object_ID(N'Pedidos'))
      ALTER TABLE Pedidos ADD nomeItem NVARCHAR(100);
    `);
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'categoria' AND Object_ID = Object_ID(N'Pedidos'))
      ALTER TABLE Pedidos ADD categoria NVARCHAR(50);
    `);
    
    console.log('Tabela Pedidos verificada e atualizada.');
  } catch (err) {
    console.error('Erro ao criar/atualizar tabela:', err);
  }
}

// --- MÉTODOS ---

export async function insertPedido(pedido: PizzariaEntrada): Promise<PizzariaEntrada> {
  const pool = await getPool();
  const horaPedido = new Date();
  const request = pool.request();

  request.input('cliente', sql.NVarChar, pedido.cliente);
  request.input('telefone', sql.NVarChar, pedido.telefone);
  request.input('endereco', sql.NVarChar, pedido.endereco || pedido.enderecoEntrega || '');
  request.input('cpf', sql.NVarChar, pedido.cpf || pedido.cpfNota || null);
  request.input('observacao', sql.NVarChar, pedido.observacao || '');
  request.input('nomeItem', sql.NVarChar, pedido.nomeItem || pedido.pedidoPizza || '');
  request.input('categoria', sql.NVarChar, pedido.categoria || 'pizza');
  
  // Legado
  request.input('pedidoPizza', sql.NVarChar, pedido.pedidoPizza || '');
  request.input('tamanhoPizza', sql.NVarChar, pedido.tamanhoPizza || '');
  request.input('quantidadePizza', sql.Int, pedido.quantidadePizza || 0);
  request.input('itemExtra', sql.NVarChar, pedido.itemExtra || '');
  request.input('precoTotal', sql.Decimal(10, 2), pedido.precoTotal);
  request.input('horaPedido', sql.DateTime, horaPedido);
  request.input('formaPagamento', sql.NVarChar, pedido.formaPagamento || 'Dinheiro');

  const query = `
    INSERT INTO Pedidos (
      cliente, telefone, endereco, cpf, observacao, nomeItem, categoria,
      pedidoPizza, tamanhoPizza, quantidadePizza, itemExtra, precoTotal, horaPedido, formaPagamento
    ) 
    OUTPUT INSERTED.idPedido
    VALUES (
      @cliente, @telefone, @endereco, @cpf, @observacao, @nomeItem, @categoria,
      @pedidoPizza, @tamanhoPizza, @quantidadePizza, @itemExtra, @precoTotal, @horaPedido, @formaPagamento
    );
  `;

  const result = await request.query(query);

  return { 
    idPedido: result.recordset[0].idPedido, 
    horaPedido: horaPedido.toISOString(), 
    ...pedido 
  };
}

export async function updatePedido(id: number, dados: Partial<PizzariaEntrada>): Promise<PizzariaEntrada | null> {
  const pool = await getPool();
  const request = pool.request();
  request.input('id', sql.Int, id);

  let updates = [];
  
  if (dados.cliente !== undefined) {
    request.input('cliente', sql.NVarChar, dados.cliente);
    updates.push("cliente = @cliente");
  }
  if (dados.telefone !== undefined) {
    request.input('telefone', sql.NVarChar, dados.telefone);
    updates.push("telefone = @telefone");
  }
  if (dados.endereco !== undefined) {
    request.input('endereco', sql.NVarChar, dados.endereco);
    updates.push("endereco = @endereco");
  }
  if (dados.quantidadePizza !== undefined) {
    request.input('qtd', sql.Int, dados.quantidadePizza);
    updates.push("quantidadePizza = @qtd");
  }
  if (dados.tamanhoPizza !== undefined) {
    request.input('tam', sql.NVarChar, dados.tamanhoPizza);
    updates.push("tamanhoPizza = @tam");
  }
  if (dados.observacao !== undefined) {
    request.input('obs', sql.NVarChar, dados.observacao);
    updates.push("observacao = @obs");
  }
  if (dados.itemExtra !== undefined) {
    request.input('extra', sql.NVarChar, dados.itemExtra);
    updates.push("itemExtra = @extra");
  }
  if (dados.precoTotal !== undefined) {
    request.input('total', sql.Decimal(10, 2), dados.precoTotal);
    updates.push("precoTotal = @total");
  }

  if (updates.length === 0) return null;

  const query = `UPDATE Pedidos SET ${updates.join(', ')} WHERE idPedido = @id`;
  await request.query(query);

  return getPedidoById(id);
}

export async function getAllPedidos(): Promise<PizzariaEntrada[]> {
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT * FROM Pedidos ORDER BY horaPedido DESC
  `);
  return result.recordset as PizzariaEntrada[];
}

export async function getPedidoById(id: number) {
  const pool = await getPool();
  const request = pool.request();
  request.input('idPedido', sql.Int, id);
  const result = await request.query(`
    SELECT * FROM Pedidos WHERE idPedido = @idPedido
  `);
  return result.recordset[0];
}

export async function deletePedido(id: number) {
  const pool = await getPool();
  const request = pool.request();
  request.input('idPedido', sql.Int, id);
  await request.query(`DELETE FROM Pedidos WHERE idPedido = @idPedido`);
}

export function calcularPrecoTotal(dados: any): number {
  return dados.precoTotal || 0;
}