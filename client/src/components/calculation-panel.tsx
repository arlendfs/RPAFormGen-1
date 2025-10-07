import { TaxCalculation } from '@/types/rpa';
import { formatCurrency } from '@/lib/tax-calculator';
import { Calculator, Info } from 'lucide-react';

interface CalculationPanelProps {
  calculations: TaxCalculation;
  issPercent: number;
}

export function CalculationPanel({ calculations, issPercent }: CalculationPanelProps) {
  return (
    <section className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg shadow-sm p-6 border-l-4 border-accent">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
          <Calculator className="text-accent w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Cálculo Automático</h2>
          <p className="text-sm text-muted-foreground">Valores atualizados em tempo real</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm font-medium text-card-foreground">Valor Bruto</span>
          <span className="text-base font-mono font-semibold text-card-foreground" data-testid="display-valor-bruto">
            {formatCurrency(calculations.valorBruto)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">(-) INSS (11%)</span>
          <span className="text-sm font-mono text-destructive" data-testid="display-inss">
            {formatCurrency(calculations.inss)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">
            (-) ISS (<span data-testid="display-iss-percent">{issPercent}</span>%)
          </span>
          <span className="text-sm font-mono text-destructive" data-testid="display-iss">
            {formatCurrency(calculations.iss)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">(-) IRRF</span>
          <span className="text-sm font-mono text-destructive" data-testid="display-irrf">
            {formatCurrency(calculations.irrf)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 bg-accent/10 -mx-3 px-3 rounded-md mt-3">
          <span className="text-base font-bold text-card-foreground">Valor Líquido</span>
          <span className="text-xl font-mono font-bold text-accent" data-testid="display-valor-liquido">
            {formatCurrency(calculations.valorLiquido)}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/20">
        <p className="text-xs text-muted-foreground">
          <Info className="w-3 h-3 text-primary mr-1 inline" />
          IRRF isento para valores até R$ 2.640,00. Cálculo conforme tabela progressiva da Receita Federal.
        </p>
      </div>
    </section>
  );
}
