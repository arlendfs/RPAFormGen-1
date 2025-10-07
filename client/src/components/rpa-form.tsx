import { useState } from 'react';
import { useRPAForm } from '@/hooks/use-rpa-form';
import { generateRPAPDF } from '@/lib/pdf-generator';
import { CalculationPanel } from './calculation-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Building, 
  Briefcase, 
  CreditCard, 
  FileText, 
  PenLine,
  Save,
  FolderOpen,
  Trash2,
  FileDown,
  Wand2
} from 'lucide-react';

export function RPAForm() {
  const { form, calculations, autoFillObservations, saveDraft, loadDraft, clearForm } = useRPAForm();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      generateRPAPDF(data, calculations);
      saveDraft();
      
      toast({
        title: 'PDF gerado com sucesso!',
        description: 'O recibo foi baixado automaticamente.',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearForm = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os campos?')) {
      clearForm();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Service Provider Section */}
      <Card data-testid="section-prestador">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Prestador de Serviço</CardTitle>
              <CardDescription>Dados do profissional autônomo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="prestador-nome">Nome Completo *</Label>
              <Input
                id="prestador-nome"
                {...form.register('prestador.nome')}
                data-testid="input-prestador-nome"
              />
              {form.formState.errors.prestador?.nome && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.prestador.nome.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prestador-cpf">CPF *</Label>
              <Input
                id="prestador-cpf"
                {...form.register('prestador.cpf')}
                placeholder="000.000.000-00"
                data-testid="input-prestador-cpf"
              />
              {form.formState.errors.prestador?.cpf && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.prestador.cpf.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prestador-email">E-mail</Label>
              <Input
                id="prestador-email"
                type="email"
                {...form.register('prestador.email')}
                data-testid="input-prestador-email"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="prestador-endereco">Endereço Completo *</Label>
              <Input
                id="prestador-endereco"
                {...form.register('prestador.endereco')}
                data-testid="input-prestador-endereco"
              />
              {form.formState.errors.prestador?.endereco && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.prestador.endereco.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="prestador-telefone">Telefone</Label>
              <Input
                id="prestador-telefone"
                {...form.register('prestador.telefone')}
                data-testid="input-prestador-telefone"
              />
            </div>

            <div>
              <Label htmlFor="prestador-chave-pix">Chave Pix</Label>
              <Input
                id="prestador-chave-pix"
                {...form.register('prestador.chavePix')}
                data-testid="input-prestador-chave-pix"
              />
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Dados Bancários</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prestador-banco">Banco</Label>
                <Input
                  id="prestador-banco"
                  {...form.register('prestador.banco')}
                  data-testid="input-prestador-banco"
                />
              </div>

              <div>
                <Label htmlFor="prestador-agencia">Agência</Label>
                <Input
                  id="prestador-agencia"
                  {...form.register('prestador.agencia')}
                  data-testid="input-prestador-agencia"
                />
              </div>

              <div>
                <Label htmlFor="prestador-conta">Conta</Label>
                <Input
                  id="prestador-conta"
                  {...form.register('prestador.conta')}
                  data-testid="input-prestador-conta"
                />
              </div>

              <div>
                <Label htmlFor="prestador-tipo-conta">Tipo de Conta</Label>
                <Select 
                  value={form.watch('prestador.tipoConta')} 
                  onValueChange={(value) => form.setValue('prestador.tipoConta', value as any)}
                >
                  <SelectTrigger data-testid="select-prestador-tipo-conta">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrente">Corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contractor Section */}
      <Card data-testid="section-tomador">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Tomador de Serviço</CardTitle>
              <CardDescription>Dados da empresa/pessoa contratante</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="tomador-nome">Nome / Razão Social *</Label>
              <Input
                id="tomador-nome"
                {...form.register('tomador.nome')}
                data-testid="input-tomador-nome"
              />
              {form.formState.errors.tomador?.nome && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.tomador.nome.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tomador-cnpj-cpf">CNPJ / CPF *</Label>
              <Input
                id="tomador-cnpj-cpf"
                {...form.register('tomador.cnpjCpf')}
                data-testid="input-tomador-cnpj-cpf"
              />
              {form.formState.errors.tomador?.cnpjCpf && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.tomador.cnpjCpf.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tomador-email">E-mail</Label>
              <Input
                id="tomador-email"
                type="email"
                {...form.register('tomador.email')}
                data-testid="input-tomador-email"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="tomador-endereco">Endereço Completo *</Label>
              <Input
                id="tomador-endereco"
                {...form.register('tomador.endereco')}
                data-testid="input-tomador-endereco"
              />
              {form.formState.errors.tomador?.endereco && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.tomador.endereco.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Details Section */}
      <Card data-testid="section-servico">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Serviço Prestado</CardTitle>
              <CardDescription>Descrição e valores do serviço</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="servico-descricao">Descrição Detalhada do Serviço *</Label>
            <Textarea
              id="servico-descricao"
              rows={3}
              {...form.register('servico.descricao')}
              data-testid="textarea-servico-descricao"
            />
            {form.formState.errors.servico?.descricao && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.servico.descricao.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servico-data">Data da Prestação *</Label>
              <Input
                id="servico-data"
                type="date"
                {...form.register('servico.data')}
                data-testid="input-servico-data"
              />
              {form.formState.errors.servico?.data && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.servico.data.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="servico-local">Local (Cidade/UF) *</Label>
              <Input
                id="servico-local"
                {...form.register('servico.local')}
                data-testid="input-servico-local"
              />
              {form.formState.errors.servico?.local && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.servico.local.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor-bruto">Valor Bruto (R$) *</Label>
              <Input
                id="valor-bruto"
                type="number"
                step="0.01"
                min="0"
                {...form.register('servico.valorBruto', { valueAsNumber: true })}
                data-testid="input-valor-bruto"
              />
              {form.formState.errors.servico?.valorBruto && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.servico.valorBruto.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="iss-percentual">ISS (%)</Label>
              <Input
                id="iss-percentual"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register('servico.issPercentual', { valueAsNumber: true })}
                data-testid="input-iss-percentual"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Panel */}
      <CalculationPanel 
        calculations={calculations} 
        issPercent={form.watch('servico.issPercentual') || 5} 
      />

      {/* Payment Section */}
      <Card data-testid="section-pagamento">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Informações de Pagamento</CardTitle>
              <CardDescription>Dados do pagamento realizado</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor-pago">Valor Efetivamente Pago (R$) *</Label>
              <Input
                id="valor-pago"
                type="number"
                step="0.01"
                min="0"
                {...form.register('pagamento.valorPago', { valueAsNumber: true })}
                data-testid="input-valor-pago"
              />
              {form.formState.errors.pagamento?.valorPago && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.pagamento.valorPago.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="data-pagamento">Data do Pagamento *</Label>
              <Input
                id="data-pagamento"
                type="date"
                {...form.register('pagamento.data')}
                data-testid="input-data-pagamento"
              />
              {form.formState.errors.pagamento?.data && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.pagamento.data.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="metodo-pagamento">Método de Pagamento *</Label>
              <Select 
                value={form.watch('pagamento.metodo')} 
                onValueChange={(value) => form.setValue('pagamento.metodo', value)}
              >
                <SelectTrigger data-testid="select-metodo-pagamento">
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                  <SelectItem value="Depósito">Depósito</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.pagamento?.metodo && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.pagamento.metodo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="observacao-pagamento">Observação (comprovante, transação)</Label>
              <Input
                id="observacao-pagamento"
                {...form.register('pagamento.observacao')}
                data-testid="input-observacao-pagamento"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observations Section */}
      <Card data-testid="section-observacoes">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Observações Finais</CardTitle>
              <CardDescription>Texto personalizado para o recibo</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="observacoes-finais">Observações</Label>
            <Textarea
              id="observacoes-finais"
              rows={4}
              {...form.register('observacoes')}
              data-testid="textarea-observacoes-finais"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={autoFillObservations}
            className="text-primary hover:text-primary/80"
            data-testid="button-auto-fill-observacoes"
          >
            <Wand2 className="w-4 h-4 mr-1" />
            Preencher automaticamente
          </Button>
        </CardContent>
      </Card>

      {/* Signature Lines Preview */}
      <Card data-testid="section-assinaturas">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <PenLine className="text-primary w-5 h-5" />
            </div>
            <div>
              <CardTitle>Assinaturas</CardTitle>
              <CardDescription>Linhas para assinatura manual após impressão</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center space-y-2">
              <div className="border-b-2 border-foreground/60 w-full mb-2" data-testid="signature-line-prestador"></div>
              <p className="text-sm font-medium text-foreground/80">Assinatura do Prestador de Serviço</p>
            </div>

            <div className="text-center space-y-2">
              <div className="border-b-2 border-foreground/60 w-full mb-2" data-testid="signature-line-tomador"></div>
              <p className="text-sm font-medium text-foreground/80">Assinatura do Tomador de Serviço</p>
            </div>
          </div>

          <div className="mt-12 pt-8">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/10">
              <p className="text-xs text-muted-foreground italic">
                Espaço reservado para selo ou carimbo de autenticação (Gov.br)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleClearForm}
          className="flex-1"
          data-testid="button-limpar-formulario"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpar Formulário
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={saveDraft}
          className="flex-1"
          data-testid="button-salvar-rascunho"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Rascunho
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={loadDraft}
          className="flex-1"
          data-testid="button-carregar-rascunho"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Carregar Rascunho
        </Button>
        
        <Button
          type="submit"
          disabled={isGenerating}
          className="flex-1 shadow-md"
          data-testid="button-gerar-pdf"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Gerando...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Gerar PDF
            </>
          )}
        </Button>
      </div>

      {/* Loading Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center" data-testid="loading-modal">
          <Card className="max-w-sm w-full mx-4">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Gerando PDF</h3>
                <p className="text-sm text-muted-foreground">Aguarde enquanto preparamos seu recibo...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}
