import axios from 'axios';
import { NotificationService } from '../../../services/NotificationService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Interfaces para pagamento com cartão
export interface DadosCartao {
  numero: string;
  nome: string;
  vencimento: string; // MM/YY
  cvv: string;
  documento: string;
  email: string;
}

export interface BandeiraCartao {
  id: string;
  nome: string;
  icone: string;
  regex: RegExp;
}

export interface PagamentoCartao {
  id: string;
  valor: number;
  parcelas: number;
  bandeira: string;
  status: StatusPagamentoCartao;
  dadosCartao: Partial<DadosCartao>;
  planoId: string;
  transactionId?: string;
  dataTransacao: Date;
  taxaProcessamento: number;
  valorLiquido: number;
}

export enum StatusPagamentoCartao {
  PENDENTE = 'pending',
  APROVADO = 'approved', 
  REJEITADO = 'rejected',
  PROCESSANDO = 'in_process',
  CANCELADO = 'cancelled'
}

export interface RespostaApiCartao {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  installments: number;
  payment_method_id: string;
  payment_type_id: string;
  card: {
    last_four_digits: string;
    first_six_digits: string;
    cardholder: {
      name: string;
    };
  };
  date_created: string;
  date_approved?: string;
}

export interface OpcoesParcelamento {
  parcelas: number;
  valor: number;
  taxa: number;
  valorTotal: number;
}

// Bandeiras de cartão suportadas pelo MercadoPago
export const BANDEIRAS_CARTAO: BandeiraCartao[] = [
  {
    id: 'visa',
    nome: 'Visa',
    icone: '🟦', // Azul representando Visa
    regex: /^4[0-9]{12}(?:[0-9]{3})?$/
  },
  {
    id: 'master',
    nome: 'Mastercard', 
    icone: '🔴', // Vermelho representando Mastercard
    regex: /^5[1-5][0-9]{14}$/
  },
  {
    id: 'amex',
    nome: 'American Express',
    icone: '🟢', // Verde representando Amex
    regex: /^3[47][0-9]{13}$/
  },
  {
    id: 'elo',
    nome: 'Elo',
    icone: '🟡', // Amarelo representando Elo
    regex: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/
  },
  {
    id: 'hipercard',
    nome: 'Hipercard',
    icone: '🟠', // Laranja representando Hipercard
    regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/
  },
  {
    id: 'diners',
    nome: 'Diners Club',
    icone: '⚫', // Preto representando Diners
    regex: /^3[0689][0-9]{13}$/
  }
];

class CartaoService {
  private readonly baseURL = `${API_BASE_URL}/payments/card`;
  private readonly isTestMode = process.env.REACT_APP_PAYMENT_MOCK === 'true';

  private getAuthHeaders() {
    const token =
      sessionStorage.getItem('auth_token') ||
      localStorage.getItem('auth_token') ||
      localStorage.getItem('userToken');

    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  }

  constructor() {
    console.log(`🔧 CartaoService inicializado em modo: ${this.isTestMode ? 'TESTE' : 'PRODUÇÃO'}`);
  }

  /**
   * Identifica a bandeira do cartão baseado no número
   */
  identificarBandeira(numeroCartao: string): BandeiraCartao | null {
    const numero = numeroCartao.replace(/\s/g, '');
    
    console.log('🔍 Tentando identificar bandeira para:', numero, 'Tamanho:', numero.length);
    
    // Não tentar identificar se houver menos de 4 dígitos
    if (numero.length < 4) {
      console.log('⚠️ Número muito curto para identificação');
      return null;
    }
    
    for (const bandeira of BANDEIRAS_CARTAO) {
      // Para detectar precocemente, vamos verificar padrões iniciais
      const numeroInicial = numero.substring(0, 6); // Primeiros 6 dígitos
      
      if (bandeira.id === 'visa' && numero.startsWith('4')) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      } else if (bandeira.id === 'master' && /^5[1-5]/.test(numero)) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      } else if (bandeira.id === 'amex' && /^3[47]/.test(numero)) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      } else if (bandeira.id === 'elo' && /^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(numeroInicial)) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      } else if (bandeira.id === 'hipercard' && /^(606282|3841)/.test(numeroInicial)) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      } else if (bandeira.id === 'diners' && /^3[0689]/.test(numero)) {
        console.log('✅ Bandeira detectada:', bandeira.nome);
        return bandeira;
      }
    }
    
    console.log('❌ Nenhuma bandeira detectada para:', numero);
    return null;
  }

  /**
   * Valida o número do cartão usando algoritmo de Luhn
   */
  validarNumeroCartao(numero: string): boolean {
    const numeroLimpo = numero.replace(/\s/g, '');
    
    if (!/^\d+$/.test(numeroLimpo)) {
      return false;
    }

    let soma = 0;
    let alternar = false;

    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
      let digito = parseInt(numeroLimpo.charAt(i), 10);

      if (alternar) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }

      soma += digito;
      alternar = !alternar;
    }

    return (soma % 10) === 0;
  }

  /**
   * Obtém opções de parcelamento para um valor
   */
  async obterOpcoesParcelamento(valor: number, bandeiraId: string): Promise<OpcoesParcelamento[]> {
    try {
      console.log(`💳 Obtendo opções de parcelamento para ${bandeiraId}: R$ ${valor}`);
      
      if (this.isTestMode) {
        // Dados mocados para teste
        const opcoesMock: OpcoesParcelamento[] = [
          { parcelas: 1, valor, taxa: 0, valorTotal: valor },
          { parcelas: 2, valor: valor / 2, taxa: 2.99, valorTotal: valor * 1.0299 },
          { parcelas: 3, valor: valor / 3, taxa: 3.99, valorTotal: valor * 1.0399 },
          { parcelas: 4, valor: valor / 4, taxa: 4.99, valorTotal: valor * 1.0499 },
          { parcelas: 6, valor: valor / 6, taxa: 6.99, valorTotal: valor * 1.0699 },
          { parcelas: 12, valor: valor / 12, taxa: 12.99, valorTotal: valor * 1.1299 }
        ];
        
        return opcoesMock;
      }

      const response = await axios.get(`${this.baseURL}/installments`, {
        headers: this.getAuthHeaders(),
        params: {
          amount: valor,
          payment_method_id: bandeiraId,
        }
      });

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data?.payer_costs || [];

      return payload.map((option: any) => ({
        parcelas: option.installments,
        valor: option.installment_amount,
        taxa: option.installment_rate,
        valorTotal: option.total_amount
      }));

    } catch (error) {
      console.error('❌ Erro ao obter opções de parcelamento:', error);
      throw new Error('Erro ao carregar opções de parcelamento');
    }
  }

  /**
   * Processa pagamento com cartão de crédito
   */
  async processarPagamentoCartao(
    dadosCartao: DadosCartao,
    valor: number,
    parcelas: number,
    planoId: string,
    bandeiraId: string
  ): Promise<PagamentoCartao> {
    try {
      console.log(`💳 Processando pagamento: R$ ${valor} em ${parcelas}x com ${bandeiraId}`);

      if (this.isTestMode) {
        return this.processarPagamentoMock(dadosCartao, valor, parcelas, planoId, bandeiraId);
      }

      // Preparar dados do pagamento para API real
      const dadosPagamento = {
        transaction_amount: valor,
        installments: parcelas,
        payment_method_id: bandeiraId,
        payer: {
          email: dadosCartao.email,
          identification: {
            type: 'CPF',
            number: dadosCartao.documento
          }
        },
        card: {
          number: dadosCartao.numero.replace(/\s/g, ''),
          expiration_month: dadosCartao.vencimento.split('/')[0],
          expiration_year: `20${dadosCartao.vencimento.split('/')[1]}`,
          security_code: dadosCartao.cvv,
          cardholder: {
            name: dadosCartao.nome
          }
        }
      };

      const response = await axios.post(
        `${this.baseURL}/process`,
        dadosPagamento,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return this.mapearRespostaApi(response.data, planoId, dadosCartao);

    } catch (error: any) {
      console.error('❌ Erro ao processar pagamento:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro no processamento do pagamento';
        NotificationService.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      throw new Error('Erro de conexão com o sistema de pagamento');
    }
  }

  /**
   * Simula processamento de pagamento para modo teste
   */
  private async processarPagamentoMock(
    dadosCartao: DadosCartao,
    valor: number,
    parcelas: number,
    planoId: string,
    bandeiraId: string
  ): Promise<PagamentoCartao> {
    console.log('🧪 Simulando pagamento em modo teste...');
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular diferentes cenários baseado no CVV
    let status = StatusPagamentoCartao.APROVADO;
    if (dadosCartao.cvv === '999') {
      status = StatusPagamentoCartao.REJEITADO;
    } else if (dadosCartao.cvv === '888') {
      status = StatusPagamentoCartao.PROCESSANDO;
    }

    const taxaProcessamento = valor * 0.0399; // 3.99% de taxa
    const valorLiquido = valor - taxaProcessamento;

    const pagamento: PagamentoCartao = {
      id: `cart_test_${Date.now()}`,
      valor,
      parcelas,
      bandeira: bandeiraId,
      status,
      dadosCartao: {
        nome: dadosCartao.nome,
        documento: dadosCartao.documento,
        email: dadosCartao.email
      },
      planoId,
      transactionId: `mp_test_${Date.now()}`,
      dataTransacao: new Date(),
      taxaProcessamento,
      valorLiquido
    };

    // Salvar no localStorage para persistência
    this.salvarPagamento(pagamento);

    // Enviar notificação
    if (status === StatusPagamentoCartao.APROVADO) {
      NotificationService.success(`💳 Pagamento aprovado! Valor: R$ ${valor.toFixed(2)}`);
    } else if (status === StatusPagamentoCartao.REJEITADO) {
      NotificationService.error('❌ Pagamento rejeitado. Verifique os dados do cartão.');
    } else {
      NotificationService.info('⏳ Pagamento em processamento...');
    }

    return pagamento;
  }

  /**
   * Mapeia resposta da API para objeto interno
   */
  private mapearRespostaApi(resposta: RespostaApiCartao, planoId: string, dadosCartao: DadosCartao): PagamentoCartao {
    const statusMap: { [key: string]: StatusPagamentoCartao } = {
      'approved': StatusPagamentoCartao.APROVADO,
      'pending': StatusPagamentoCartao.PENDENTE,
      'rejected': StatusPagamentoCartao.REJEITADO,
      'in_process': StatusPagamentoCartao.PROCESSANDO,
      'cancelled': StatusPagamentoCartao.CANCELADO
    };

    const taxaProcessamento = resposta.transaction_amount * 0.0399;
    const valorLiquido = resposta.transaction_amount - taxaProcessamento;

    return {
      id: `cart_${resposta.id}`,
      valor: resposta.transaction_amount,
      parcelas: resposta.installments,
      bandeira: resposta.payment_method_id,
      status: statusMap[resposta.status] || StatusPagamentoCartao.PENDENTE,
      dadosCartao: {
        nome: dadosCartao.nome,
        documento: dadosCartao.documento,
        email: dadosCartao.email
      },
      planoId,
      transactionId: resposta.id,
      dataTransacao: new Date(resposta.date_created),
      taxaProcessamento,
      valorLiquido
    };
  }

  /**
   * Consulta status de um pagamento
   */
  async consultarStatusPagamento(transactionId: string): Promise<StatusPagamentoCartao> {
    try {
      if (this.isTestMode) {
        const pagamentos = this.obterPagamentosSalvos();
        const pagamento = pagamentos.find(p => p.transactionId === transactionId);
        return pagamento?.status || StatusPagamentoCartao.PENDENTE;
      }

      const response = await axios.get(
        `${this.baseURL}/status/${transactionId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      const statusMap: { [key: string]: StatusPagamentoCartao } = {
        'approved': StatusPagamentoCartao.APROVADO,
        'pending': StatusPagamentoCartao.PENDENTE,
        'rejected': StatusPagamentoCartao.REJEITADO,
        'in_process': StatusPagamentoCartao.PROCESSANDO,
        'cancelled': StatusPagamentoCartao.CANCELADO
      };

      return statusMap[response.data.status] || StatusPagamentoCartao.PENDENTE;

    } catch (error) {
      console.error('❌ Erro ao consultar status:', error);
      throw new Error('Erro ao consultar status do pagamento');
    }
  }

  /**
   * Salva pagamento no localStorage
   */
  private salvarPagamento(pagamento: PagamentoCartao): void {
    const pagamentos = this.obterPagamentosSalvos();
    pagamentos.push(pagamento);
    localStorage.setItem('pagamentos_cartao', JSON.stringify(pagamentos));
  }

  /**
   * Obtém pagamentos salvos no localStorage
   */
  private obterPagamentosSalvos(): PagamentoCartao[] {
    const dados = localStorage.getItem('pagamentos_cartao');
    return dados ? JSON.parse(dados) : [];
  }

  /**
   * Formata número do cartão com espaços
   */
  formatarNumeroCartao(numero: string): string {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = numero.replace(/\D/g, '');
    
    // Limita a 16 dígitos
    const numeroLimitado = numeroLimpo.substring(0, 16);
    
    // Adiciona espaços a cada 4 dígitos
    return numeroLimitado.replace(/(.{4})/g, '$1 ').trim();
  }

  /**
   * Formata vencimento MM/YY
   */
  formatarVencimento(vencimento: string): string {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = vencimento.replace(/\D/g, '');
    
    // Limita a 4 dígitos
    const numeroLimitado = numeroLimpo.substring(0, 4);
    
    // Adiciona a barra após os 2 primeiros dígitos
    if (numeroLimitado.length >= 3) {
      return numeroLimitado.substring(0, 2) + '/' + numeroLimitado.substring(2);
    }
    
    return numeroLimitado;
  }

  /**
   * Obtém histórico de pagamentos
   */
  obterHistoricoPagamentos(): PagamentoCartao[] {
    return this.obterPagamentosSalvos().sort(
      (a, b) => new Date(b.dataTransacao).getTime() - new Date(a.dataTransacao).getTime()
    );
  }
}

export const cartaoService = new CartaoService();