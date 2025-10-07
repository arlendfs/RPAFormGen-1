export function calculateIRRF(valorBruto: number): number {
  // Tabela progressiva IRRF 2024
  if (valorBruto <= 2640.00) return 0;
  if (valorBruto <= 2826.65) return Math.max(0, valorBruto * 0.075 - 198.00);
  if (valorBruto <= 3751.05) return Math.max(0, valorBruto * 0.15 - 410.28);
  if (valorBruto <= 4664.68) return Math.max(0, valorBruto * 0.225 - 691.02);
  return Math.max(0, valorBruto * 0.275 - 884.08);
}

export function calculateTaxes(valorBruto: number, issPercent: number = 5) {
  const inss = valorBruto * 0.11;
  const iss = valorBruto * (issPercent / 100);
  const irrf = calculateIRRF(valorBruto);
  const valorLiquido = valorBruto - inss - iss - irrf;

  return {
    valorBruto,
    inss,
    iss,
    irrf,
    valorLiquido
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
}
