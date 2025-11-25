
import { getPool } from './database.js';
import sql from 'mssql';

export async function emitirNfe(idPedido: number) {
  const pool = await getPool();
  
  // Simula envio para SEFAZ
  console.log(`Emitindo NFE para o pedido ${idPedido}...`);
  
  // Simulando delay
  await new Promise(r => setTimeout(r, 1000));

  // Gera um link falso
  const linkNota = `https://www.nfe.fazenda.gov.br/exemplo-nota-${idPedido}.pdf`;

  // Salva no Banco
  await pool.request()
    .input('id', sql.Int, idPedido)
    .input('url', sql.NVarChar, linkNota)
    .query("UPDATE Pedidos SET nfeStatus = 'Emitida', nfeUrl = @url WHERE idPedido = @id");

  return { status: 'Emitida', url: linkNota };
}
