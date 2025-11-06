import React, { useState } from 'react';
import './CaixaPage.css';

interface MovimentoCaixa {
  id: number;
  tipo: 'Entrada' | 'Saída';
  valor: number;
  operador: string;
  dataHora: string;
  observacoes?: string;
  categoria: string;
  formaPagamento: string;
  paciente?: string;
}

interface Caixa {
  id: number;
  operador: string;
  valorAbertura: number;
  dataAbertura: string;
  dataFechamento?: string;
  valorFechamento?: number;
  status: 'Aberto' | 'Fechado';
  movimentos: MovimentoCaixa[];
}

const CaixaPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMovimentoModal, setShowMovimentoModal] = useState(false);
  const [dataInicio, setDataInicio] = useState('06/11/2025');
  const [dataFim, setDataFim] = useState('06/11/2025');
  const [operadorSelecionado, setOperadorSelecionado] = useState('Selecionar Operador');

  // Dados fake para demonstração
  const [caixas] = useState<Caixa[]>([
    {
      id: 1,
      operador: 'Hugo Freitas',
      valorAbertura: 50.00,
      dataAbertura: '06/11/2025 08:00',
      dataFechamento: '06/11/2025 18:00',
      valorFechamento: 1285.50,
      status: 'Fechado',
      movimentos: [
        {
          id: 1,
          tipo: 'Entrada',
          valor: 350.00,
          operador: 'Hugo Freitas',
          dataHora: '06/11/2025 09:30',
          categoria: 'Consulta',
          formaPagamento: 'Dinheiro',
          paciente: 'Maria Silva',
          observacoes: 'Consulta de rotina'
        },
        {
          id: 2,
          tipo: 'Entrada',
          valor: 500.00,
          operador: 'Hugo Freitas',
          dataHora: '06/11/2025 11:15',
          categoria: 'Procedimento',
          formaPagamento: 'PIX',
          paciente: 'João Carlos',
          observacoes: 'Limpeza dental'
        },
        {
          id: 3,
          tipo: 'Saída',
          valor: 45.50,
          operador: 'Hugo Freitas',
          dataHora: '06/11/2025 14:20',
          categoria: 'Material',
          formaPagamento: 'Dinheiro',
          observacoes: 'Compra de luvas'
        }
      ]
    },
    {
      id: 2,
      operador: 'Ana Paula',
      valorAbertura: 25.00,
      dataAbertura: '05/11/2025 08:30',
      dataFechamento: '05/11/2025 17:30',
      valorFechamento: 890.75,
      status: 'Fechado',
      movimentos: [
        {
          id: 4,
          tipo: 'Entrada',
          valor: 280.00,
          operador: 'Ana Paula',
          dataHora: '05/11/2025 10:00',
          categoria: 'Consulta',
          formaPagamento: 'Cartão',
          paciente: 'Pedro Santos',
          observacoes: 'Avaliação ortodôntica'
        },
        {
          id: 5,
          tipo: 'Entrada',
          valor: 650.00,
          operador: 'Ana Paula',
          dataHora: '05/11/2025 15:45',
          categoria: 'Procedimento',
          formaPagamento: 'Dinheiro',
          paciente: 'Luciana Costa',
          observacoes: 'Restauração'
        }
      ]
    },
    {
      id: 3,
      operador: 'Carlos Mendes',
      valorAbertura: 100.00,
      dataAbertura: '04/11/2025 09:00',
      dataFechamento: '04/11/2025 19:00',
      valorFechamento: 1450.25,
      status: 'Fechado',
      movimentos: [
        {
          id: 6,
          tipo: 'Entrada',
          valor: 1200.00,
          operador: 'Carlos Mendes',
          dataHora: '04/11/2025 16:30',
          categoria: 'Implante',
          formaPagamento: 'Transferência',
          paciente: 'Roberto Lima',
          observacoes: 'Implante unitário'
        }
      ]
    },
    {
      id: 4,
      operador: 'Marina Costa',
      valorAbertura: 75.00,
      dataAbertura: '03/11/2025 08:00',
      dataFechamento: '03/11/2025 18:30',
      valorFechamento: 620.00,
      status: 'Fechado',
      movimentos: [
        {
          id: 7,
          tipo: 'Entrada',
          valor: 180.00,
          operador: 'Marina Costa',
          dataHora: '03/11/2025 11:30',
          categoria: 'Limpeza',
          formaPagamento: 'PIX',
          paciente: 'Fernanda Silva',
          observacoes: 'Profilaxia'
        },
        {
          id: 8,
          tipo: 'Entrada',
          valor: 365.00,
          operador: 'Marina Costa',
          dataHora: '03/11/2025 14:15',
          categoria: 'Clareamento',
          formaPagamento: 'Cartão',
          paciente: 'Marcos Oliveira',
          observacoes: 'Clareamento dental'
        }
      ]
    },
    {
      id: 5,
      operador: 'Rafael Santos',
      valorAbertura: 30.00,
      dataAbertura: '02/11/2025 09:30',
      status: 'Aberto',
      movimentos: [
        {
          id: 9,
          tipo: 'Entrada',
          valor: 450.00,
          operador: 'Rafael Santos',
          dataHora: '02/11/2025 10:45',
          categoria: 'Cirurgia',
          formaPagamento: 'Dinheiro',
          paciente: 'Camila Rocha',
          observacoes: 'Extração de siso'
        }
      ]
    }
  ]);

  // Estado do formulário do modal de abertura
  const [formData, setFormData] = useState({
    operador: 'Hugo Freitas',
    valorAbertura: '',
    dataAbertura: '06/11/2025',
    observacoes: ''
  });

  // Estado do formulário do modal de movimento
  const [movimentoData, setMovimentoData] = useState({
    tipo: 'Entrada',
    valor: '',
    categoria: 'Consulta',
    formaPagamento: 'Dinheiro',
    paciente: '',
    observacoes: ''
  });

  const operadores = [
    'Hugo Freitas',
    'Ana Paula',
    'Carlos Mendes',
    'Marina Costa',
    'Rafael Santos'
  ];

  const categorias = [
    'Consulta',
    'Procedimento',
    'Limpeza',
    'Clareamento',
    'Implante',
    'Cirurgia',
    'Material',
    'Equipamento',
    'Outros'
  ];

  const formasPagamento = [
    'Dinheiro',
    'PIX',
    'Cartão',
    'Transferência',
    'Boleto'
  ];

  const filteredCaixas = caixas.filter(caixa => {
    const matchOperador = operadorSelecionado === 'Selecionar Operador' || 
                         caixa.operador === operadorSelecionado;
    return matchOperador;
  });

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      operador: 'Hugo Freitas',
      valorAbertura: '',
      dataAbertura: '06/11/2025',
      observacoes: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenMovimentoModal = () => {
    setShowMovimentoModal(true);
    setMovimentoData({
      tipo: 'Entrada',
      valor: '',
      categoria: 'Consulta',
      formaPagamento: 'Dinheiro',
      paciente: '',
      observacoes: ''
    });
  };

  const handleCloseMovimentoModal = () => {
    setShowMovimentoModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMovimentoChange = (field: string, value: string) => {
    setMovimentoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da abertura de caixa:', formData);
    alert('Caixa aberto com sucesso!');
    setShowModal(false);
  };

  const handleMovimentoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do movimento:', movimentoData);
    alert('Movimento registrado com sucesso!');
    setShowMovimentoModal(false);
  };

  const handleGenerateReport = () => {
    const totalEntradas = filteredCaixas.reduce((total, caixa) => {
      return total + caixa.movimentos
        .filter(mov => mov.tipo === 'Entrada')
        .reduce((sum, mov) => sum + mov.valor, 0);
    }, 0);

    const totalSaidas = filteredCaixas.reduce((total, caixa) => {
      return total + caixa.movimentos
        .filter(mov => mov.tipo === 'Saída')
        .reduce((sum, mov) => sum + mov.valor, 0);
    }, 0);

    const content = `
RELATÓRIO DE CAIXA - ${new Date().toLocaleDateString('pt-BR')}

Período: ${dataInicio} a ${dataFim}
Operador: ${operadorSelecionado}

═══════════════════════════════════════════════════════════════

RESUMO GERAL:
- Total de Caixas: ${filteredCaixas.length}
- Caixas Abertos: ${filteredCaixas.filter(c => c.status === 'Aberto').length}
- Caixas Fechados: ${filteredCaixas.filter(c => c.status === 'Fechado').length}

MOVIMENTAÇÃO FINANCEIRA:
- Total de Entradas: R$ ${totalEntradas.toFixed(2).replace('.', ',')}
- Total de Saídas: R$ ${totalSaidas.toFixed(2).replace('.', ',')}
- Saldo Líquido: R$ ${(totalEntradas - totalSaidas).toFixed(2).replace('.', ',')}

═══════════════════════════════════════════════════════════════

DETALHES POR CAIXA:

${filteredCaixas.map(caixa => {
  const entradas = caixa.movimentos.filter(m => m.tipo === 'Entrada').reduce((s, m) => s + m.valor, 0);
  const saidas = caixa.movimentos.filter(m => m.tipo === 'Saída').reduce((s, m) => s + m.valor, 0);
  
  return `
CAIXA #${caixa.id} - ${caixa.operador}
───────────────────────────────────────────────────────────────
• Status: ${caixa.status}
• Abertura: ${caixa.dataAbertura} - R$ ${caixa.valorAbertura.toFixed(2).replace('.', ',')}
${caixa.dataFechamento ? `• Fechamento: ${caixa.dataFechamento} - R$ ${caixa.valorFechamento?.toFixed(2).replace('.', ',')}` : '• Caixa ainda aberto'}
• Movimentos: ${caixa.movimentos.length}
• Total Entradas: R$ ${entradas.toFixed(2).replace('.', ',')}
• Total Saídas: R$ ${saidas.toFixed(2).replace('.', ',')}

MOVIMENTOS:
${caixa.movimentos.map(mov => `
  → ${mov.tipo}: R$ ${mov.valor.toFixed(2).replace('.', ',')} 
    ${mov.dataHora} | ${mov.categoria} | ${mov.formaPagamento}
    ${mov.paciente ? `Paciente: ${mov.paciente}` : ''}
    ${mov.observacoes ? `Obs: ${mov.observacoes}` : ''}
`).join('')}
`;
}).join('\n')}

═══════════════════════════════════════════════════════════════

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
Sistema de Gestão Odontológica
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-caixa-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório de caixa baixado com sucesso!');
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const calcularSaldo = (caixa: Caixa) => {
    const entradas = caixa.movimentos.filter(m => m.tipo === 'Entrada').reduce((total, m) => total + m.valor, 0);
    const saidas = caixa.movimentos.filter(m => m.tipo === 'Saída').reduce((total, m) => total + m.valor, 0);
    return caixa.valorAbertura + entradas - saidas;
  };

  const handleFecharCaixa = (caixaId: number) => {
    const caixa = caixas.find(c => c.id === caixaId);
    if (caixa) {
      const saldoFinal = calcularSaldo(caixa);
      alert(`Caixa fechado com saldo final de ${formatCurrency(saldoFinal)}`);
    }
  };

  return (
    <div className="caixa-page">
      <div className="caixa-header">
        <div className="header-controls">
          <button className="btn-abrir-caixa" onClick={handleOpenModal}>
            + Abrir Caixa
          </button>
          
          <div className="date-controls">
            <input
              type="text"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="date-input"
            />
            
            <input
              type="text"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="date-input"
            />
            
            <div className="operador-select">
              <select 
                value={operadorSelecionado}
                onChange={(e) => setOperadorSelecionado(e.target.value)}
                className="select-operador"
              >
                <option value="Selecionar Operador">Selecionar Operador</option>
                {operadores.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            
            <button className="btn-relatorio" onClick={handleGenerateReport}>
              📄
            </button>
          </div>
        </div>

        <div className="actions-bar">
          <button className="btn-movimento" onClick={handleOpenMovimentoModal}>
            💰 Registrar Movimento
          </button>
          <button className="btn-relatorio-detalhado" onClick={handleGenerateReport}>
            📊 Relatório de Caixa
          </button>
        </div>
      </div>

      <div className="caixa-content">
        {filteredCaixas.length === 0 ? (
          <div className="empty-state">
            <p>Não possui nenhum registro!</p>
            <small>Abra um caixa para começar a registrar movimentações</small>
          </div>
        ) : (
          <div className="caixas-grid">
            {filteredCaixas.map(caixa => (
              <div key={caixa.id} className={`caixa-card ${caixa.status.toLowerCase()}`}>
                <div className="card-header">
                  <h3>Caixa #{caixa.id}</h3>
                  <span className={`status-badge ${caixa.status.toLowerCase()}`}>
                    {caixa.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Operador:</span>
                    <span className="value">{caixa.operador}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Abertura:</span>
                    <span className="value">{caixa.dataAbertura}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Valor Inicial:</span>
                    <span className="value price">{formatCurrency(caixa.valorAbertura)}</span>
                  </div>
                  
                  {caixa.dataFechamento && (
                    <div className="info-row">
                      <span className="label">Fechamento:</span>
                      <span className="value">{caixa.dataFechamento}</span>
                    </div>
                  )}
                  
                  <div className="info-row">
                    <span className="label">Saldo Atual:</span>
                    <span className="value price-large">{formatCurrency(calcularSaldo(caixa))}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Movimentos:</span>
                    <span className="value">{caixa.movimentos.length}</span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button className="btn-action view" title="Ver Detalhes">👁️</button>
                  <button className="btn-action edit" title="Editar">✏️</button>
                  {caixa.status === 'Aberto' && (
                    <button 
                      className="btn-action close" 
                      title="Fechar Caixa"
                      onClick={() => handleFecharCaixa(caixa.id)}
                    >
                      🔒
                    </button>
                  )}
                  <button className="btn-action print" title="Imprimir">🖨️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Abertura de Caixa */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-caixa" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inserir Registro</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Operador</label>
                  <select 
                    value={formData.operador}
                    onChange={(e) => handleInputChange('operador', e.target.value)}
                    className="form-select"
                    required
                  >
                    {operadores.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Valor Abertura</label>
                  <input
                    type="number"
                    value={formData.valorAbertura}
                    onChange={(e) => handleInputChange('valorAbertura', e.target.value)}
                    className="form-input"
                    placeholder="25,00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Data Abertura</label>
                  <input
                    type="text"
                    value={formData.dataAbertura}
                    onChange={(e) => handleInputChange('dataAbertura', e.target.value)}
                    className="form-input"
                    placeholder="06/11/2025"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="form-textarea"
                  placeholder="Observações"
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Salvar ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Movimento */}
      {showMovimentoModal && (
        <div className="modal-overlay" onClick={handleCloseMovimentoModal}>
          <div className="modal-content-movimento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registrar Movimento de Caixa</h2>
              <button className="btn-close" onClick={handleCloseMovimentoModal}>×</button>
            </div>
            
            <form onSubmit={handleMovimentoSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    value={movimentoData.tipo}
                    onChange={(e) => handleMovimentoChange('tipo', e.target.value)}
                    className="form-select"
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="number"
                    value={movimentoData.valor}
                    onChange={(e) => handleMovimentoChange('valor', e.target.value)}
                    className="form-input"
                    placeholder="100,00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={movimentoData.categoria}
                    onChange={(e) => handleMovimentoChange('categoria', e.target.value)}
                    className="form-select"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Forma de Pagamento</label>
                  <select 
                    value={movimentoData.formaPagamento}
                    onChange={(e) => handleMovimentoChange('formaPagamento', e.target.value)}
                    className="form-select"
                  >
                    {formasPagamento.map(forma => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Paciente (opcional)</label>
                  <input
                    type="text"
                    value={movimentoData.paciente}
                    onChange={(e) => handleMovimentoChange('paciente', e.target.value)}
                    className="form-input"
                    placeholder="Nome do paciente"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Observações</label>
                <textarea
                  value={movimentoData.observacoes}
                  onChange={(e) => handleMovimentoChange('observacoes', e.target.value)}
                  className="form-textarea"
                  placeholder="Descrição do movimento..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Registrar Movimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaixaPage;