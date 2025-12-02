import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces
interface Agendamento {
  id: number;
  paciente: string;
  dentista: string;
  procedimento: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado';
  telefone: string;
  observacoes?: string;
}

interface Consulta {
  id: number;
  data: string;
  hora: string;
  paciente: string;
  dentista: string;
  procedimento: string;
  valor: number;
  status: 'agendada' | 'confirmada' | 'finalizada' | 'cancelada';
  pagamento: 'pendente' | 'pago' | 'cancelado';
  telefone: string;
  observacoes?: string;
  agendamentoId?: number; // Para vincular com o agendamento original
}

interface AgendamentosContextType {
  agendamentos: Agendamento[];
  consultas: Consulta[];
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id'>) => void;
  atualizarAgendamento: (id: number, agendamento: Partial<Agendamento>) => void;
  removerAgendamento: (id: number) => void;
  converterAgendamentoParaConsulta: (agendamentoId: number, valor: number) => void;
  atualizarConsulta: (id: number, consulta: Partial<Consulta>) => void;
  limparTodosDados: () => void; // Nova função para limpar todos os dados se necessário
}

const AgendamentosContext = createContext<AgendamentosContextType | undefined>(undefined);

// Dados iniciais de agendamentos
const dadosIniciaisAgendamentos: Agendamento[] = [
  {
    id: 1,
    paciente: "Ana Paula Silva",
    dentista: "Dr. João Pereira",
    procedimento: "Limpeza e Profilaxia",
    data: "2025-11-13",
    hora: "08:00",
    status: "confirmado",
    telefone: "(11) 99999-1111",
    observacoes: "Primeira consulta"
  },
  {
    id: 2,
    paciente: "Marcos Antônio",
    dentista: "Dra. Ana Costa",
    procedimento: "Restauração",
    data: "2025-11-13",
    hora: "09:30",
    status: "agendado",
    telefone: "(11) 98888-2222"
  },
  {
    id: 3,
    paciente: "Beatriz Santos",
    dentista: "Dr. João Pereira",
    procedimento: "Canal",
    data: "2025-11-13",
    hora: "11:00",
    status: "em_atendimento",
    telefone: "(11) 97777-3333",
    observacoes: "Segunda sessão"
  }
];

// Consultas iniciais (algumas já existentes + convertidas de agendamentos)
const dadosIniciaisConsultas: Consulta[] = [
  {
    id: 1,
    data: "13/11/2025",
    hora: "08:00",
    paciente: "Ana Paula Silva",
    dentista: "Dr. João Pereira",
    procedimento: "Limpeza e Profilaxia",
    valor: 120.00,
    status: "confirmada",
    pagamento: "pendente",
    telefone: "(11) 99999-1111",
    observacoes: "Primeira consulta",
    agendamentoId: 1
  }
];

// Funções para persistência em localStorage
const salvarAgendamentosNoStorage = (agendamentos: Agendamento[]) => {
  try {
    localStorage.setItem('agendamentos_odonto', JSON.stringify(agendamentos));
  } catch (error) {
    console.warn('Erro ao salvar agendamentos no localStorage:', error);
  }
};

const carregarAgendamentosDoStorage = (): Agendamento[] => {
  try {
    const agendamentosStorados = localStorage.getItem('agendamentos_odonto');
    if (agendamentosStorados) {
      const agendamentos = JSON.parse(agendamentosStorados);
      // Combinar com dados iniciais se necessário
      const agendamentosUnicos = [...dadosIniciaisAgendamentos];
      
      agendamentos.forEach((agendamento: Agendamento) => {
        if (!agendamentosUnicos.find(a => a.id === agendamento.id)) {
          agendamentosUnicos.push(agendamento);
        }
      });
      
      return agendamentosUnicos;
    }
  } catch (error) {
    console.warn('Erro ao carregar agendamentos do localStorage:', error);
  }
  return dadosIniciaisAgendamentos;
};

const salvarConsultasNoStorage = (consultas: Consulta[]) => {
  try {
    localStorage.setItem('consultas_odonto', JSON.stringify(consultas));
  } catch (error) {
    console.warn('Erro ao salvar consultas no localStorage:', error);
  }
};

const carregarConsultasDoStorage = (): Consulta[] => {
  try {
    const consultasStoradas = localStorage.getItem('consultas_odonto');
    if (consultasStoradas) {
      const consultas = JSON.parse(consultasStoradas);
      // Combinar com dados iniciais se necessário
      const consultasUnicas = [...dadosIniciaisConsultas];
      
      consultas.forEach((consulta: Consulta) => {
        if (!consultasUnicas.find(c => c.id === consulta.id)) {
          consultasUnicas.push(consulta);
        }
      });
      
      return consultasUnicas;
    }
  } catch (error) {
    console.warn('Erro ao carregar consultas do localStorage:', error);
  }
  return dadosIniciaisConsultas;
};

export function AgendamentosProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => carregarAgendamentosDoStorage());
  const [consultas, setConsultas] = useState<Consulta[]>(() => carregarConsultasDoStorage());

  // Salvar no localStorage sempre que agendamentos mudarem
  useEffect(() => {
    salvarAgendamentosNoStorage(agendamentos);
  }, [agendamentos]);

  // Salvar no localStorage sempre que consultas mudarem
  useEffect(() => {
    salvarConsultasNoStorage(consultas);
  }, [consultas]);

  // Função para adicionar novo agendamento
  const adicionarAgendamento = (novoAgendamento: Omit<Agendamento, 'id'>) => {
    // Gerar ID único baseado no timestamp para evitar conflitos
    const id = Date.now();
    const agendamentoCompleto = { ...novoAgendamento, id };
    
    setAgendamentos(prev => {
      const novosAgendamentos = [...prev, agendamentoCompleto];
      console.log('✅ Agendamento adicionado:', agendamentoCompleto);
      console.log('📋 Total de agendamentos:', novosAgendamentos.length);
      return novosAgendamentos;
    });
    
    // Automaticamente criar uma consulta correspondente
    converterAgendamentoParaConsultaInterna(agendamentoCompleto, 0); // Valor 0 será definido depois
  };

  // Função para atualizar agendamento existente
  const atualizarAgendamento = (id: number, agendamentoAtualizado: Partial<Agendamento>) => {
    setAgendamentos(prev => 
      prev.map(agendamento => 
        agendamento.id === id 
          ? { ...agendamento, ...agendamentoAtualizado }
          : agendamento
      )
    );

    // Atualizar consulta correspondente se existir
    const consultaExistente = consultas.find(c => c.agendamentoId === id);
    if (consultaExistente) {
      const agendamentoOriginal = agendamentos.find(a => a.id === id);
      if (agendamentoOriginal) {
        const agendamentoCompleto = { ...agendamentoOriginal, ...agendamentoAtualizado };
        atualizarConsultaFromAgendamento(consultaExistente.id, agendamentoCompleto);
      }
    }
  };

  // Função para remover agendamento
  const removerAgendamento = (id: number) => {
    setAgendamentos(prev => prev.filter(agendamento => agendamento.id !== id));
    
    // Remover consulta correspondente se existir
    setConsultas(prev => prev.filter(consulta => consulta.agendamentoId !== id));
  };

  // Função para converter agendamento em consulta com valor
  const converterAgendamentoParaConsulta = (agendamentoId: number, valor: number) => {
    const agendamento = agendamentos.find(a => a.id === agendamentoId);
    if (agendamento) {
      converterAgendamentoParaConsultaInterna(agendamento, valor);
    }
  };

  // Função interna para converter agendamento em consulta
  const converterAgendamentoParaConsultaInterna = (agendamento: Agendamento, valor: number) => {
    // Verificar se já existe uma consulta para este agendamento
    const consultaExistente = consultas.find(c => c.agendamentoId === agendamento.id);
    if (consultaExistente) {
      console.log('⚠️ Consulta já existe para este agendamento:', agendamento.id);
      return; // Não criar duplicata
    }

    const novaConsulta: Consulta = {
      id: Date.now() + Math.random(), // ID único baseado em timestamp + random para evitar conflitos
      data: formatarDataParaConsulta(agendamento.data),
      hora: agendamento.hora,
      paciente: agendamento.paciente,
      dentista: agendamento.dentista,
      procedimento: agendamento.procedimento,
      valor: valor || obterValorPadraoProcedimento(agendamento.procedimento),
      status: converterStatusAgendamentoParaConsulta(agendamento.status),
      pagamento: 'pendente',
      telefone: agendamento.telefone,
      observacoes: agendamento.observacoes,
      agendamentoId: agendamento.id
    };

    setConsultas(prev => {
      const novasConsultas = [...prev, novaConsulta];
      console.log('✅ Consulta criada automaticamente:', novaConsulta);
      console.log('📋 Total de consultas:', novasConsultas.length);
      return novasConsultas;
    });
  };

  // Função para atualizar consulta baseada em agendamento
  const atualizarConsultaFromAgendamento = (consultaId: number, agendamento: Agendamento) => {
    setConsultas(prev => 
      prev.map(consulta => 
        consulta.id === consultaId 
          ? {
              ...consulta,
              data: formatarDataParaConsulta(agendamento.data),
              hora: agendamento.hora,
              paciente: agendamento.paciente,
              dentista: agendamento.dentista,
              procedimento: agendamento.procedimento,
              status: converterStatusAgendamentoParaConsulta(agendamento.status),
              telefone: agendamento.telefone,
              observacoes: agendamento.observacoes
            }
          : consulta
      )
    );
  };

  // Função para limpar todos os dados (útil para desenvolvimento/teste)
  const limparTodosDados = () => {
    if (window.confirm('⚠️ Tem certeza que deseja limpar todos os agendamentos e consultas? Esta ação não pode ser desfeita.')) {
      setAgendamentos(dadosIniciaisAgendamentos);
      setConsultas(dadosIniciaisConsultas);
      localStorage.removeItem('agendamentos_odonto');
      localStorage.removeItem('consultas_odonto');
      console.log('🗑️ Todos os dados foram limpos e resetados para os dados iniciais');
    }
  };

  // Função para atualizar consulta
  const atualizarConsulta = (id: number, consultaAtualizada: Partial<Consulta>) => {
    setConsultas(prev => 
      prev.map(consulta => 
        consulta.id === id 
          ? { ...consulta, ...consultaAtualizada }
          : consulta
      )
    );
  };

  // Funções auxiliares
  const formatarDataParaConsulta = (data: string): string => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const converterStatusAgendamentoParaConsulta = (status: Agendamento['status']): Consulta['status'] => {
    switch (status) {
      case 'agendado': return 'agendada';
      case 'confirmado': return 'confirmada';
      case 'em_atendimento': return 'confirmada';
      case 'concluido': return 'finalizada';
      case 'cancelado': return 'cancelada';
      default: return 'agendada';
    }
  };

  const obterValorPadraoProcedimento = (procedimento: string): number => {
    const valores: { [key: string]: number } = {
      'Limpeza': 120,
      'Limpeza e Profilaxia': 120,
      'Restauração': 180,
      'Obturação': 180,
      'Canal': 450,
      'Extração': 200,
      'Clareamento': 350,
      'Aparelho': 800,
      'Ortodontia': 800,
      'Implante': 1200,
      'Consulta': 80
    };

    // Busca por palavras-chave no procedimento
    for (const [key, value] of Object.entries(valores)) {
      if (procedimento.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return 100; // Valor padrão
  };

  const contextValue: AgendamentosContextType = {
    agendamentos,
    consultas,
    adicionarAgendamento,
    atualizarAgendamento,
    removerAgendamento,
    converterAgendamentoParaConsulta,
    atualizarConsulta,
    limparTodosDados
  };

  return (
    <AgendamentosContext.Provider value={contextValue}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  const context = useContext(AgendamentosContext);
  if (context === undefined) {
    throw new Error('useAgendamentos deve ser usado dentro de um AgendamentosProvider');
  }
  return context;
}

export type { Agendamento, Consulta };