import { OrderItem } from './types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateItemPrice = (
  precoBase: number, 
  quantidade: number, 
  categoria: string, 
  tamanho: string,
  extraCharge: number = 0
): number => {
  let unitPrice = precoBase;

  if (categoria === 'pizza') {
    if (tamanho === 'Pequena') unitPrice *= 0.8;
    if (tamanho === 'Grande') unitPrice *= 1.2;
    if (tamanho === 'Família') unitPrice *= 1.4;
  } 
  else if (categoria === 'bebida') {
    if (tamanho === 'Grande') unitPrice *= 1.5;
  }

  unitPrice += extraCharge;

  return unitPrice * quantidade;
};

// --- FUNÇÕES DE GERAÇÃO DE ARQUIVOS ---

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: mimeType});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generateTXT = (orders: OrderItem[]) => {
  const total = orders.reduce((acc, item) => acc + item.precoTotal, 0);
  const date = new Date().toLocaleString('pt-BR');
  const line = "==========================================\n";
  const thinLine = "------------------------------------------\n";

  let content = line;
  content += "                PIZZAONE                  \n";
  content += "            PREMIUM DELIVERY              \n";
  content += line;
  content += `DATA: ${date}\n`;
  content += thinLine;
  content += "ITEM                            VALOR (R$)\n";
  content += thinLine;

  orders.forEach(item => {
    content += `${item.quantidade}x ${item.nome} (${item.tamanho})\n`;
    if (item.ingredientesRemovidos && item.ingredientesRemovidos.length > 0) {
      content += `   Sem: ${item.ingredientesRemovidos.join(', ')}\n`;
    }
    if (item.observacao) {
      content += `   Obs: ${item.observacao}\n`;
    }
    content += `                                ${item.precoTotal.toFixed(2).padStart(10)}\n`;
    content += " - - - - - - - - - - - - - - - - - - - - -\n";
  });

  content += thinLine;
  content += `TOTAL:                          ${total.toFixed(2).padStart(10)}\n`;
  content += line;
  content += "        OBRIGADO PELA PREFERENCIA!        \n";
  content += line;

  downloadFile(`comprovante_${Date.now()}.txt`, content, 'text/plain');
};

export const generateCSV = (orders: OrderItem[]) => {
  const date = new Date().toLocaleString('pt-BR');
  // Header
  let content = "ID,Data,Item,Categoria,Tamanho,Quantidade,PrecoUnitario,PrecoTotal,Observacao,SemIngredientes\n";

  orders.forEach(item => {
    const semIngredientes = item.ingredientesRemovidos ? item.ingredientesRemovidos.join('; ') : '';
    const obs = item.observacao ? item.observacao.replace(/,/g, ' ') : ''; // Evita quebra de CSV
    
    const row = [
      item.id,
      date,
      item.nome,
      item.categoria,
      item.tamanho,
      item.quantidade,
      item.precoUnitario.toFixed(2),
      item.precoTotal.toFixed(2),
      obs,
      semIngredientes
    ].join(',');
    
    content += row + "\n";
  });

  downloadFile(`relatorio_pedidos_${Date.now()}.csv`, content, 'text/csv');
};

// Mantendo a função antiga caso queira usar a janela de impressão do navegador
export const generateReceipt = (orders: OrderItem[]) => {
  const total = orders.reduce((acc, item) => acc + item.precoTotal, 0);
  const date = new Date().toLocaleString('pt-BR');

  const receiptContent = `
    <html>
      <head>
        <title>Comprovante - PizzaOne</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; margin: 0; padding: 10px; color: #000; background: #fff; }
          .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
          .title { font-size: 16px; font-weight: bold; margin: 0; }
          .info { margin: 2px 0; }
          .items { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          .item-row { vertical-align: top; }
          .qty { width: 30px; font-weight: bold; }
          .name { text-align: left; }
          .price { text-align: right; white-space: nowrap; }
          .details { font-size: 10px; color: #444; margin-left: 30px; margin-bottom: 5px; display: block; font-style: italic; }
          .total { border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px; font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; border-top: 1px dotted #ccc; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">PizzaOne</h1>
          <p class="info">Premium Delivery</p>
          <p class="info">${date}</p>
        </div>
        <table class="items">
          ${orders.map(item => `
            <tr class="item-row">
              <td class="qty">${item.quantidade}x</td>
              <td class="name">
                ${item.nome} <br/>
                <span style="font-size: 10px;">(${item.tamanho})</span>
              </td>
              <td class="price">${formatCurrency(item.precoTotal)}</td>
            </tr>
            <tr>
              <td colspan="3">
                ${item.ingredientesRemovidos && item.ingredientesRemovidos.length > 0 ? `<span class="details">- Sem: ${item.ingredientesRemovidos.join(', ')}</span>` : ''}
                ${item.observacao ? `<span class="details">Obs: ${item.observacao}</span>` : ''}
              </td>
            </tr>
          `).join('')}
        </table>
        <div class="total">
          <span>TOTAL</span>
          <span>${formatCurrency(total)}</span>
        </div>
        <div class="footer">
          <p>Obrigado pela preferência!</p>
          <p>www.pizzaone.com.br</p>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 500); }
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=350,height=600');
  if (printWindow) {
    printWindow.document.write(receiptContent);
    printWindow.document.close();
  } else {
    alert("Pop-up bloqueado. Por favor, permita pop-ups para imprimir o comprovante.");
  }
};