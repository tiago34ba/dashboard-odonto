import { useState, useEffect, useCallback } from 'react';
import { pixService } from '../services/PixService';
import { PagamentoPix, StatusPagamento, Plano } from '../types/pagamento.types';

export const usePagamento = () => {
  const [loading, setLoading] = useState(false);
  const [pagamentoAtual, setPagamentoAtual] = useState<PagamentoPix | null>(null);
  const [historico, setHistorico] = useState<PagamentoPix[]>([]);
  const [erro, setErro] = useState<string>('');

  // Carregar histórico de pagamentos
  const carregarHistorico = useCallback(async () => {
    try {
      const pagamentos = pixService.listarPagamentos();
      setHistorico(pagamentos);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      setErro(error.message);
    }
  }, []);

  // Iniciar novo pagamento
  const iniciarPagamento = async (plano: Plano) => {
    try {
      setLoading(true);
      setErro('');
      
      const pagamento = await pixService.gerarCodigoPix(
        plano.id,
        plano.preco,
        `Assinatura ${plano.nome} - Consultório Odontológico`
      );

      setPagamentoAtual(pagamento);
      await carregarHistorico(); // Atualizar histórico
      
      return pagamento;
    } catch (error: any) {
      setErro(error.message || 'Erro ao iniciar pagamento');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verificar status de pagamento
  const verificarStatus = async (transacaoId: string): Promise<StatusPagamento> => {
    try {
      const status = await pixService.verificarStatusPagamento(transacaoId);
      
      // Atualizar pagamento atual se for o mesmo
      if (pagamentoAtual && pagamentoAtual.id === transacaoId) {
        setPagamentoAtual(prev => prev ? { ...prev, status } : null);
      }

      // Atualizar histórico
      await carregarHistorico();
      
      return status;
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      setErro(error.message);
      return 'erro';
    }
  };

  // Limpar estado atual
  const limparPagamentoAtual = () => {
    setPagamentoAtual(null);
    setErro('');
  };

  // Obter estatísticas dos pagamentos
  const estatisticas = {
    total: historico.length,
    aprovados: historico.filter(p => p.status === 'aprovado').length,
    pendentes: historico.filter(p => p.status === 'pendente').length,
    rejeitados: historico.filter(p => p.status === 'rejeitado').length,
    expirados: historico.filter(p => p.status === 'expirado').length,
    valorTotal: historico
      .filter(p => p.status === 'aprovado')
      .reduce((acc, p) => acc + p.valor, 0)
  };

  // Carregar histórico na inicialização
  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  return {
    // Estados
    loading,
    pagamentoAtual,
    historico,
    erro,
    estatisticas,

    // Ações
    iniciarPagamento,
    verificarStatus,
    carregarHistorico,
    limparPagamentoAtual,

    // Utilitários
    temPagamentoAtivo: !!pagamentoAtual,
    ultimoPagamento: historico[0] || null
  };
};