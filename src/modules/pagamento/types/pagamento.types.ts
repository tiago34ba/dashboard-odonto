// Tipos de planos disponíveis
export type PlanoType = 'basico' | 'profissional' | 'premium';

// Tipos de forma de pagamento
export type FormaPagamento = 'pix' | 'cartao' | 'boleto';

// Status possíveis do pagamento
export type StatusPagamento = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado' | 'erro';

// Interface do plano
export interface Plano {
  id: PlanoType;
  nome: string;
  preco: number;
  descricao: string;
  recursos: string[];
  popular?: boolean;
  icone: string;
  cor: string;
}

// Interface do pagamento PIX
export interface PagamentoPix {
  id: string;
  codigo_pix: string;
  qr_code: string;
  valor: number;
  descricao: string;
  status: StatusPagamento;
  plano: PlanoType;
  chave_pix: string;
  data_criacao: Date;
  data_expiracao: Date;
  data_aprovacao?: Date;
}

// Interface para dados do pagamento
export interface DadosPagamento {
  plano: Plano;
  valor: number;
  descricao: string;
  email?: string;
  nome?: string;
  telefone?: string;
}

// Interface para resposta da API
export interface RespostaApiPix {
  sucesso: boolean;
  dados?: PagamentoPix;
  erro?: string;
  codigo_erro?: string;
}

// Interface para notificação
export interface NotificacaoPagamento {
  id: string;
  tipo: 'pagamento_aprovado' | 'pagamento_rejeitado' | 'pagamento_expirado';
  mensagem: string;
  timestamp: Date;
  pagamento_id: string;
}

// Tipos e interfaces para pagamento com cartão
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
  status: StatusPagamento;
  dadosCartao: Partial<DadosCartao>;
  planoId: string;
  transactionId?: string;
  dataTransacao: Date;
  taxaProcessamento: number;
  valorLiquido: number;
}

export interface OpcoesParcelamento {
  parcelas: number;
  valor: number;
  taxa: number;
  valorTotal: number;
}