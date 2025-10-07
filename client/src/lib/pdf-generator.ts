import { jsPDF } from 'jspdf';
import { RPAFormData, TaxCalculation } from '@/types/rpa';
import { formatCurrency, formatDate } from './tax-calculator';

export function generateRPAPDF(formData: RPAFormData, calculations: TaxCalculation): void {
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RECIBO DE PAGAMENTO AUTÔNOMO (RPA)', 105, y, { align: 'center' });
  
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 105, y, { align: 'center' });

  // Prestador
  y += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PRESTADOR DE SERVIÇO', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${formData.prestador.nome}`, 20, y);
  y += 6;
  doc.text(`CPF: ${formData.prestador.cpf}`, 20, y);
  y += 6;
  doc.text(`Endereço: ${formData.prestador.endereco}`, 20, y);
  
  if (formData.prestador.email) {
    y += 6;
    doc.text(`E-mail: ${formData.prestador.email}`, 20, y);
  }
  
  if (formData.prestador.telefone) {
    y += 6;
    doc.text(`Telefone: ${formData.prestador.telefone}`, 20, y);
  }
  
  if (formData.prestador.banco) {
    y += 6;
    const bankInfo = `Banco: ${formData.prestador.banco}${formData.prestador.agencia ? ` | Ag: ${formData.prestador.agencia}` : ''}${formData.prestador.conta ? ` | Conta: ${formData.prestador.conta}` : ''}${formData.prestador.tipoConta ? ` (${formData.prestador.tipoConta})` : ''}`;
    doc.text(bankInfo, 20, y);
  }
  
  if (formData.prestador.chavePix) {
    y += 6;
    doc.text(`Chave Pix: ${formData.prestador.chavePix}`, 20, y);
  }

  // Tomador
  y += 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO TOMADOR DE SERVIÇO', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome/Razão Social: ${formData.tomador.nome}`, 20, y);
  y += 6;
  doc.text(`CNPJ/CPF: ${formData.tomador.cnpjCpf}`, 20, y);
  y += 6;
  doc.text(`Endereço: ${formData.tomador.endereco}`, 20, y);
  
  if (formData.tomador.email) {
    y += 6;
    doc.text(`E-mail: ${formData.tomador.email}`, 20, y);
  }

  // Serviço
  y += 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIÇÃO DO SERVIÇO', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descricaoLines = doc.splitTextToSize(formData.servico.descricao, 170);
  doc.text(descricaoLines, 20, y);
  y += descricaoLines.length * 6;
  
  y += 6;
  doc.text(`Data da Prestação: ${formatDate(formData.servico.data)}`, 20, y);
  y += 6;
  doc.text(`Local: ${formData.servico.local}`, 20, y);

  // Valores
  y += 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHAMENTO DOS VALORES', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Valor Bruto:', 20, y);
  doc.text(formatCurrency(calculations.valorBruto), 180, y, { align: 'right' });
  
  y += 6;
  doc.text('(-) INSS (11%):', 20, y);
  doc.text(formatCurrency(calculations.inss), 180, y, { align: 'right' });
  
  y += 6;
  doc.text(`(-) ISS (${formData.servico.issPercentual}%):`, 20, y);
  doc.text(formatCurrency(calculations.iss), 180, y, { align: 'right' });
  
  y += 6;
  doc.text('(-) IRRF:', 20, y);
  doc.text(formatCurrency(calculations.irrf), 180, y, { align: 'right' });
  
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Valor Líquido:', 20, y);
  doc.text(formatCurrency(calculations.valorLiquido), 180, y, { align: 'right' });

  // Pagamento
  y += 12;
  doc.setFontSize(12);
  doc.text('FORMA DE PAGAMENTO', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valor Pago: ${formatCurrency(formData.pagamento.valorPago)}`, 20, y);
  y += 6;
  doc.text(`Data: ${formatDate(formData.pagamento.data)}`, 20, y);
  y += 6;
  doc.text(`Método: ${formData.pagamento.metodo}`, 20, y);
  
  if (formData.pagamento.observacao) {
    y += 6;
    const obsLines = doc.splitTextToSize(`Obs: ${formData.pagamento.observacao}`, 170);
    doc.text(obsLines, 20, y);
    y += obsLines.length * 6;
  }

  // Observações
  if (formData.observacoes) {
    y += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES', 20, y);
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const obsLines = doc.splitTextToSize(formData.observacoes, 170);
    doc.text(obsLines, 20, y);
    y += obsLines.length * 6;
  }

  // Assinaturas
  y += 20;
  if (y > 250) {
    doc.addPage();
    y = 30;
  }
  
  doc.line(20, y, 90, y);
  doc.line(110, y, 180, y);
  y += 5;
  doc.setFontSize(9);
  doc.text('Assinatura do Prestador', 55, y, { align: 'center' });
  doc.text('Assinatura do Tomador', 145, y, { align: 'center' });

  // Rodapé
  y += 15;
  doc.setFontSize(8);
  doc.text(`Local e data: ${formData.servico.local}, ${formatDate(formData.pagamento.data)}`, 105, y, { align: 'center' });

  // Save PDF
  const fileName = `RPA_${formData.prestador.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
