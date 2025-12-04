import { PlanoType, PagamentoPix, StatusPagamento } from '../types/pagamento.types';

// Configurações da API PIX
const PIX_CONFIG = {
  CHAVE_PIX: process.env.REACT_APP_PIX_KEY || '',
  AGENCIA: process.env.REACT_APP_PIX_AGENCIA || '',
  CONTA: process.env.REACT_APP_PIX_CONTA || '',
  BANCO_NOME: process.env.REACT_APP_PIX_BANCO_NOME || '',
  BANCO_CODIGO: process.env.REACT_APP_PIX_BANCO_CODIGO || '',
  BANCO_API_URL: process.env.REACT_APP_MERCADOPAGO_API_URL || 'https://api.mercadopago.com/v1',
  MOCK_API_URL: process.env.REACT_APP_PIX_MOCK_API_URL || 'http://localhost:3001/api/pix',
  IS_PRODUCTION: process.env.REACT_APP_IS_PRODUCTION === 'true'
};

export class PixService {
  private static instance: PixService;
  
  public static getInstance(): PixService {
    if (!PixService.instance) {
      PixService.instance = new PixService();
    }
    return PixService.instance;
  }

  // Métodos públicos para acessar configurações bancárias
  public getChavePix(): string {
    return PIX_CONFIG.CHAVE_PIX;
  }

  public getDadosBancarios() {
    return {
      agencia: PIX_CONFIG.AGENCIA,
      conta: PIX_CONFIG.CONTA,
      bancoNome: PIX_CONFIG.BANCO_NOME,
      bancoCodigo: PIX_CONFIG.BANCO_CODIGO,
      chavePix: PIX_CONFIG.CHAVE_PIX
    };
  }

  /**
   * Gera um código PIX para pagamento
   */
  async gerarCodigoPix(plano: PlanoType, valor: number, descricao: string): Promise<PagamentoPix> {
    try {
      const transacaoId = this.gerarTransacaoId();
      
      // Dados do PIX
      const dadosPix = {
        chave_pix: PIX_CONFIG.CHAVE_PIX,
        valor: valor,
        descricao: descricao,
        transacao_id: transacaoId,
        plano: plano,
        timestamp: new Date().toISOString()
      };

      // Se estiver em produção, usar API real
      if (PIX_CONFIG.IS_PRODUCTION) {
        return await this.gerarPixProducao(dadosPix);
      } else {
        return await this.gerarPixMock(dadosPix);
      }
    } catch (error) {
      console.error('❌ Erro ao gerar código PIX:', error);
      throw new Error('Erro ao gerar código PIX. Tente novamente.');
    }
  }

  /**
   * Gera PIX usando API real (MercadoPago/Banco)
   */
  private async gerarPixProducao(dados: any): Promise<PagamentoPix> {
    // Implementação para API real
    const response = await fetch(`${PIX_CONFIG.BANCO_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_MERCADOPAGO_TOKEN}`
      },
      body: JSON.stringify({
        transaction_amount: dados.valor,
        description: dados.descricao,
        payment_method_id: 'pix',
        payer: {
          email: 'cliente@email.com'
        }
      })
    });

    const resultado = await response.json();

    return {
      id: dados.transacao_id,
      codigo_pix: resultado.point_of_interaction?.transaction_data?.qr_code || this.gerarCodigoPixMock(),
      qr_code: resultado.point_of_interaction?.transaction_data?.qr_code_base64 || this.gerarQRCodeMock(),
      valor: dados.valor,
      descricao: dados.descricao,
      status: 'pendente' as StatusPagamento,
      plano: dados.plano,
      chave_pix: dados.chave_pix,
      data_criacao: new Date(),
      data_expiracao: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  }

  /**
   * Gera PIX usando API mock para desenvolvimento
   */
  private async gerarPixMock(dados: any): Promise<PagamentoPix> {
    console.log('🔄 Gerando PIX Mock para:', dados);

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const codigoPix = this.gerarCodigoPixMock();
    const qrCode = this.gerarQRCodeMock();

    const pagamento: PagamentoPix = {
      id: dados.transacao_id,
      codigo_pix: codigoPix,
      qr_code: qrCode,
      valor: dados.valor,
      descricao: dados.descricao,
      status: 'pendente' as StatusPagamento,
      plano: dados.plano,
      chave_pix: dados.chave_pix,
      data_criacao: new Date(),
      data_expiracao: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };

    // Salvar no localStorage para simular persistência
    this.salvarPagamento(pagamento);

    console.log('✅ PIX gerado com sucesso:', pagamento);
    return pagamento;
  }

  /**
   * Verifica status de um pagamento PIX
   */
  async verificarStatusPagamento(transacaoId: string): Promise<StatusPagamento> {
    try {
      if (PIX_CONFIG.IS_PRODUCTION) {
        return await this.verificarStatusProducao(transacaoId);
      } else {
        return await this.verificarStatusMock(transacaoId);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      return 'erro';
    }
  }

  /**
   * Verifica status usando API real
   */
  private async verificarStatusProducao(transacaoId: string): Promise<StatusPagamento> {
    const response = await fetch(`${PIX_CONFIG.BANCO_API_URL}/payments/${transacaoId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_MERCADOPAGO_TOKEN}`
      }
    });

    const resultado = await response.json();
    
    switch (resultado.status) {
      case 'approved': return 'aprovado';
      case 'pending': return 'pendente';
      case 'rejected': return 'rejeitado';
      default: return 'erro';
    }
  }

  /**
   * Verifica status usando mock (simula aprovação após 10 segundos)
   */
  private async verificarStatusMock(transacaoId: string): Promise<StatusPagamento> {
    const pagamento = this.obterPagamento(transacaoId);
    if (!pagamento) return 'erro';

    const tempoDecorrido = Date.now() - pagamento.data_criacao.getTime();
    
    // Simular aprovação após 10 segundos (para teste)
    if (tempoDecorrido > 10000) {
      pagamento.status = 'aprovado';
      this.salvarPagamento(pagamento);
      await this.enviarNotificacaoAprovacao(pagamento);
      return 'aprovado';
    }

    return 'pendente';
  }

  /**
   * Envia notificação de pagamento aprovado
   */
  private async enviarNotificacaoAprovacao(pagamento: PagamentoPix): Promise<void> {
    try {
      console.log('📱 Enviando notificação de pagamento aprovado...');

      // Simular envio de notificação
      const notificacao = {
        telefone: PIX_CONFIG.CHAVE_PIX,
        mensagem: `✅ PIX RECEBIDO\n\nValor: R$ ${pagamento.valor.toFixed(2)}\nPlano: ${pagamento.plano}\nTransação: ${pagamento.id}\n\nPagamento aprovado com sucesso! 🎉`,
        tipo: 'pagamento_aprovado',
        timestamp: new Date().toISOString()
      };

      // Em produção, aqui enviaria SMS/WhatsApp via API
      console.log('📲 Notificação enviada:', notificacao);

      // Simular sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
    }
  }

  /**
   * Gera ID único para transação
   */
  private gerarTransacaoId(): string {
    return `PIX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gera código PIX mock para teste
   */
  private gerarCodigoPixMock(): string {
    const codigo = `00020126580014BR.GOV.BCB.PIX0136${PIX_CONFIG.CHAVE_PIX}520400005303986540${Math.random().toFixed(2).substring(2)}5802BR5925CONSULTORIO ODONTOLOGICO6009SAO PAULO62070503***6304`;
    return codigo + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  /**
   * Gera QR Code mock (base64)
   */
  private gerarQRCodeMock(): string {
    // QR Code base64 mock - em produção seria gerado pela API do banco
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  /**
   * Salva pagamento no localStorage
   */
  private salvarPagamento(pagamento: PagamentoPix): void {
    try {
      const pagamentos = this.obterTodosPagamentos();
      pagamentos[pagamento.id] = pagamento;
      localStorage.setItem('pagamentos_pix', JSON.stringify(pagamentos));
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
    }
  }

  /**
   * Obtém pagamento do localStorage
   */
  private obterPagamento(id: string): PagamentoPix | null {
    try {
      const pagamentos = this.obterTodosPagamentos();
      return pagamentos[id] || null;
    } catch (error) {
      console.error('Erro ao obter pagamento:', error);
      return null;
    }
  }

  /**
   * Obtém todos os pagamentos do localStorage
   */
  private obterTodosPagamentos(): { [key: string]: PagamentoPix } {
    try {
      const data = localStorage.getItem('pagamentos_pix');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Erro ao obter pagamentos:', error);
      return {};
    }
  }

  /**
   * Lista todos os pagamentos realizados
   */
  public listarPagamentos(): PagamentoPix[] {
    const pagamentos = this.obterTodosPagamentos();
    return Object.values(pagamentos).sort((a, b) => 
      new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
    );
  }
}

export const pixService = PixService.getInstance();