export interface ServiceProvider {
  nome: string;
  cpf: string;
  endereco: string;
  email?: string;
  telefone?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: 'Corrente' | 'Poupança' | '';
  chavePix?: string;
}

export interface Contractor {
  nome: string;
  cnpjCpf: string;
  endereco: string;
  email?: string;
}

export interface Service {
  descricao: string;
  data: string;
  local: string;
  valorBruto: number;
  issPercentual: number;
}

export interface Payment {
  valorPago: number;
  data: string;
  metodo: string;
  observacao?: string;
}

export interface RPAFormData {
  prestador: ServiceProvider;
  tomador: Contractor;
  servico: Service;
  pagamento: Payment;
  observacoes?: string;
  signatures?: {
    prestador?: string;
    tomador?: string;
  };
}

export interface TaxCalculation {
  valorBruto: number;
  inss: number;
  iss: number;
  irrf: number;
  valorLiquido: number;
}
