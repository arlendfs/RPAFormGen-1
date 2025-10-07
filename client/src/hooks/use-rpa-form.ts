import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RPAFormData } from '@/types/rpa';
import { calculateTaxes } from '@/lib/tax-calculator';
import { saveFormData, loadFormData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const rpaSchema = z.object({
  prestador: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().min(1, 'CPF é obrigatório'),
    endereco: z.string().min(1, 'Endereço é obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    telefone: z.string().optional(),
    banco: z.string().optional(),
    agencia: z.string().optional(),
    conta: z.string().optional(),
    tipoConta: z.enum(['Corrente', 'Poupança', '']).optional(),
    chavePix: z.string().optional(),
  }),
  tomador: z.object({
    nome: z.string().min(1, 'Nome/Razão Social é obrigatório'),
    cnpjCpf: z.string().min(1, 'CNPJ/CPF é obrigatório'),
    endereco: z.string().min(1, 'Endereço é obrigatório'),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  }),
  servico: z.object({
    descricao: z.string().min(1, 'Descrição do serviço é obrigatória'),
    data: z.string().min(1, 'Data da prestação é obrigatória'),
    local: z.string().min(1, 'Local é obrigatório'),
    valorBruto: z.number().min(0.01, 'Valor bruto deve ser maior que zero'),
    issPercentual: z.number().min(0).max(100).default(5),
  }),
  pagamento: z.object({
    valorPago: z.number().min(0.01, 'Valor pago deve ser maior que zero'),
    data: z.string().min(1, 'Data do pagamento é obrigatória'),
    metodo: z.string().min(1, 'Método de pagamento é obrigatório'),
    observacao: z.string().optional(),
  }),
  observacoes: z.string().optional(),
});

const defaultValues: RPAFormData = {
  prestador: {
    nome: '',
    cpf: '',
    endereco: '',
    email: '',
    telefone: '',
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: '',
    chavePix: '',
  },
  tomador: {
    nome: '',
    cnpjCpf: '',
    endereco: '',
    email: '',
  },
  servico: {
    descricao: '',
    data: '',
    local: '',
    valorBruto: 0,
    issPercentual: 5,
  },
  pagamento: {
    valorPago: 0,
    data: '',
    metodo: '',
    observacao: '',
  },
  observacoes: '',
};

export function useRPAForm() {
  const { toast } = useToast();
  
  const form = useForm<RPAFormData>({
    resolver: zodResolver(rpaSchema),
    defaultValues,
  });

  const watchedValues = form.watch();
  
  const calculations = useMemo(() => {
    return calculateTaxes(
      watchedValues.servico?.valorBruto || 0,
      watchedValues.servico?.issPercentual || 5
    );
  }, [watchedValues.servico?.valorBruto, watchedValues.servico?.issPercentual]);

  const autoFillObservations = () => {
    const dataPagamento = watchedValues.pagamento?.data;
    const metodoPagamento = watchedValues.pagamento?.metodo;

    if (!dataPagamento || !metodoPagamento) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha a data e o método de pagamento primeiro.',
        variant: 'destructive',
      });
      return;
    }

    const dataFormatada = new Date(dataPagamento + 'T00:00:00').toLocaleDateString('pt-BR');
    const texto = `O valor líquido foi pago integralmente em ${dataFormatada} via ${metodoPagamento}, sendo os tributos (INSS e ISS) de responsabilidade do tomador, a recolher posteriormente.`;
    
    form.setValue('observacoes', texto);
  };

  const saveDraft = () => {
    const formData = form.getValues();
    saveFormData(formData);
    toast({
      title: 'Rascunho salvo',
      description: 'Os dados foram salvos no navegador.',
    });
  };

  const loadDraft = () => {
    const savedData = loadFormData();
    if (savedData) {
      form.reset(savedData);
      toast({
        title: 'Rascunho carregado',
        description: 'Os dados salvos foram restaurados.',
      });
    } else {
      toast({
        title: 'Nenhum rascunho encontrado',
        description: 'Não há dados salvos para carregar.',
        variant: 'destructive',
      });
    }
  };

  const clearForm = () => {
    form.reset(defaultValues);
    toast({
      title: 'Formulário limpo',
      description: 'Todos os campos foram resetados.',
    });
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const formData = form.getValues();
      // Only save if there's actual data
      if (formData.prestador.nome || formData.tomador.nome || formData.servico.descricao) {
        saveFormData(formData);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [form]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadFormData();
    if (savedData) {
      // Check if user wants to load the draft
      const shouldLoad = window.confirm('Encontramos um rascunho salvo. Deseja carregá-lo?');
      if (shouldLoad) {
        form.reset(savedData);
      }
    }
  }, [form]);

  return {
    form,
    calculations,
    autoFillObservations,
    saveDraft,
    loadDraft,
    clearForm,
  };
}
