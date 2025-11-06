import React, { useState } from 'react';
import './OrcamentosPage.css';

interface Procedimento {
  id: number;
  nome: string;
  quantidade: number;
  valorUnit: number;
  total: number;
}

interface Orcamento {
  id: number;
  numero: string;
  tipo: string;
  valor: number;
  cliente: string;
  status: 'Concluído' | 'Pendente' | 'Aprovado' | 'Rejeitado';
  data: string;
  diasValidade: number;
  procedimentos: Procedimento[];
  desconto: number;
  formaPagamento: string;
  profissional: string;
  odontograma?: string;
  observacoes?: string;
}

const OrcamentosPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');
  const [showResultsPerPage, setShowResultsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados fake para demonstração
  const [orcamentos] = useState<Orcamento[]>([
    {
      id: 1,
      numero: 'Orçamento Nº 10',
      tipo: 'Orçamento Completo',
      valor: 2500.00,
      cliente: 'Maria Silva Santos',
      status: 'Concluído',
      data: '06/11/2025',
      diasValidade: 30,
      desconto: 0,
      formaPagamento: 'Dinheiro',
      profissional: 'Dr. Hugo Freitas',
      procedimentos: [
        {
          id: 1,
          nome: 'Implante Dentário',
          quantidade: 1,
          valorUnit: 1500.00,
          total: 1500.00
        },
        {
          id: 2,
          nome: 'Coroa Porcelana',
          quantidade: 1,
          valorUnit: 1000.00,
          total: 1000.00
        }
      ],
      observacoes: 'Paciente apresentou boa evolução'
    },
    {
      id: 2,
      numero: 'Orçamento Nº 11',
      tipo: 'Orçamento Ortodôntico',
      valor: 3200.00,
      cliente: 'João Carlos Oliveira',
      status: 'Pendente',
      data: '05/11/2025',
      diasValidade: 45,
      desconto: 10,
      formaPagamento: 'Cartão de Crédito',
      profissional: 'Dra. Ana Paula',
      procedimentos: [
        {
          id: 1,
          nome: 'Aparelho Ortodôntico',
          quantidade: 1,
          valorUnit: 2800.00,
          total: 2800.00
        },
        {
          id: 2,
          nome: 'Manutenções (12x)',
          quantidade: 12,
          valorUnit: 50.00,
          total: 600.00
        }
      ],
      observacoes: 'Tratamento estimado em 18 meses'
    },
    {
      id: 3,
      numero: 'Orçamento Nº 12',
      tipo: 'Orçamento Estético',
      valor: 1800.00,
      cliente: 'Ana Costa Lima',
      status: 'Aprovado',
      data: '04/11/2025',
      diasValidade: 30,
      desconto: 5,
      formaPagamento: 'PIX',
      profissional: 'Dr. Carlos Mendes',
      procedimentos: [
        {
          id: 1,
          nome: 'Clareamento Dental',
          quantidade: 1,
          valorUnit: 800.00,
          total: 800.00
        },
        {
          id: 2,
          nome: 'Facetas de Resina',
          quantidade: 4,
          valorUnit: 250.00,
          total: 1000.00
        }
      ],
      observacoes: 'Cliente solicitou procedimento urgente'
    },
    {
      id: 4,
      numero: 'Orçamento Nº 13',
      tipo: 'Orçamento Preventivo',
      valor: 450.00,
      cliente: 'Pedro Santos Silva',
      status: 'Pendente',
      data: '03/11/2025',
      diasValidade: 60,
      desconto: 0,
      formaPagamento: 'Dinheiro',
      profissional: 'Dra. Marina Costa',
      procedimentos: [
        {
          id: 1,
          nome: 'Limpeza Completa',
          quantidade: 1,
          valorUnit: 200.00,
          total: 200.00
        },
        {
          id: 2,
          nome: 'Aplicação de Flúor',
          quantidade: 1,
          valorUnit: 150.00,
          total: 150.00
        },
        {
          id: 3,
          nome: 'Radiografia Panorâmica',
          quantidade: 1,
          valorUnit: 100.00,
          total: 100.00
        }
      ],
      observacoes: 'Paciente com histórico de cáries'
    },
    {
      id: 5,
      numero: 'Orçamento Nº 14',
      tipo: 'Orçamento Cirúrgico',
      valor: 4200.00,
      cliente: 'Luciana Ferreira',
      status: 'Rejeitado',
      data: '02/11/2025',
      diasValidade: 15,
      desconto: 15,
      formaPagamento: 'Cartão de Débito',
      profissional: 'Dr. Rafael Santos',
      procedimentos: [
        {
          id: 1,
          nome: 'Cirurgia de Siso (4 dentes)',
          quantidade: 4,
          valorUnit: 600.00,
          total: 2400.00
        },
        {
          id: 2,
          nome: 'Enxerto Ósseo',
          quantidade: 1,
          valorUnit: 1800.00,
          total: 1800.00
        }
      ],
      observacoes: 'Cliente optou por buscar segunda opinião'
    }
  ]);

  // Estado do formulário do modal
  const [formData, setFormData] = useState({
    paciente: 'Selecionar Paciente',
    diasValidade: '',
    procedimento: 'Diagnóse e Vistoria',
    descricao: '',
    procedimentos: [] as Procedimento[],
    desconto: '',
    descontoTipo: '%',
    formaPagamento: 'Dinheiro',
    profissional: 'Hugo Freitas',
    odontograma: 'Selecionar Odontograma',
    observacoes: ''
  });

  const [novoProcedimento, setNovoProcedimento] = useState({
    nome: '',
    quantidade: 1,
    valorUnit: 0
  });

  const pacientes = [
    'Maria Silva Santos',
    'João Carlos Oliveira',
    'Ana Costa Lima',
    'Pedro Santos Silva',
    'Luciana Ferreira'
  ];

  const procedimentosDisponiveis = [
    'Diagnóse e Vistoria',
    'Limpeza Dental',
    'Restauração',
    'Implante Dentário',
    'Aparelho Ortodôntico',
    'Clareamento Dental',
    'Cirurgia',
    'Tratamento de Canal'
  ];

  const profissionais = [
    'Hugo Freitas',
    'Ana Paula Costa',
    'Carlos Mendes',
    'Marina Costa',
    'Rafael Santos'
  ];

  const formasPagamento = [
    'Dinheiro',
    'Cartão de Crédito',
    'Cartão de Débito',
    'PIX',
    'Transferência',
    'Boleto'
  ];

  const filteredOrcamentos = orcamentos.filter(orcamento =>
    orcamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orcamento.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      paciente: 'Selecionar Paciente',
      diasValidade: '',
      procedimento: 'Diagnóse e Vistoria',
      descricao: '',
      procedimentos: [],
      desconto: '',
      descontoTipo: '%',
      formaPagamento: 'Dinheiro',
      profissional: 'Hugo Freitas',
      odontograma: 'Selecionar Odontograma',
      observacoes: ''
    });
    setNovoProcedimento({
      nome: '',
      quantidade: 1,
      valorUnit: 0
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddProcedimento = () => {
    if (novoProcedimento.nome && novoProcedimento.valorUnit > 0) {
      const procedimento: Procedimento = {
        id: formData.procedimentos.length + 1,
        nome: novoProcedimento.nome,
        quantidade: novoProcedimento.quantidade,
        valorUnit: novoProcedimento.valorUnit,
        total: novoProcedimento.quantidade * novoProcedimento.valorUnit
      };

      setFormData(prev => ({
        ...prev,
        procedimentos: [...prev.procedimentos, procedimento]
      }));

      setNovoProcedimento({
        nome: '',
        quantidade: 1,
        valorUnit: 0
      });
    }
  };

  const handleRemoveProcedimento = (id: number) => {
    setFormData(prev => ({
      ...prev,
      procedimentos: prev.procedimentos.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.paciente === 'Selecionar Paciente') {
      alert('Por favor, selecione um paciente');
      return;
    }

    console.log('Dados do orçamento:', formData);
    alert('Orçamento criado com sucesso!');
    setShowModal(false);
  };

  const handleGenerateReport = () => {
    const content = `
Relatório de Orçamentos - ${new Date().toLocaleDateString('pt-BR')}

Período: ${dataInicio} a ${dataFim}

RESUMO:
- Total de orçamentos: ${filteredOrcamentos.length}
- Concluídos: ${filteredOrcamentos.filter(o => o.status === 'Concluído').length}
- Pendentes: ${filteredOrcamentos.filter(o => o.status === 'Pendente').length}
- Aprovados: ${filteredOrcamentos.filter(o => o.status === 'Aprovado').length}
- Rejeitados: ${filteredOrcamentos.filter(o => o.status === 'Rejeitado').length}

VALOR TOTAL: R$ ${filteredOrcamentos.reduce((total, o) => total + o.valor, 0).toFixed(2).replace('.', ',')}

DETALHES DOS ORÇAMENTOS:
${filteredOrcamentos.map(o => `
${o.numero}
- Cliente: ${o.cliente}
- Tipo: ${o.tipo}
- Valor: R$ ${o.valor.toFixed(2).replace('.', ',')}
- Status: ${o.status}
- Data: ${o.data}
- Profissional: ${o.profissional}
`).join('\n')}

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `relatorio-orcamentos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Relatório baixado com sucesso!');
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Concluído': 'status-concluido',
      'Pendente': 'status-pendente',
      'Aprovado': 'status-aprovado',
      'Rejeitado': 'status-rejeitado'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'status-pendente';
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const calcularSubtotal = () => {
    return formData.procedimentos.reduce((total, proc) => total + proc.total, 0);
  };

  return (
    <div className="orcamentos-page">
      <div className="orcamentos-header">
        <div className="header-controls">
          <button className="btn-novo-orcamento" onClick={handleOpenModal}>
            + Orçamento
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
            
            <button className="btn-relatorio" onClick={handleGenerateReport}>
              📄 Relatório
            </button>
          </div>
        </div>

        <div className="table-controls">
          <div className="results-control">
            <span>Exibir</span>
            <select 
              value={showResultsPerPage}
              onChange={(e) => setShowResultsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>resultados por página</span>
          </div>
          
          <div className="search-control">
            <span>Buscar:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              placeholder="Pesquisar..."
            />
          </div>
        </div>
      </div>

      <div className="orcamentos-content">
        <div className="table-container">
          <table className="orcamentos-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrcamentos.slice(0, showResultsPerPage).map(orcamento => (
                <tr key={orcamento.id}>
                  <td>
                    <div className="tipo-cell">
                      <span className="tipo-indicator">🔵</span>
                      {orcamento.numero}
                    </div>
                  </td>
                  <td className="valor-cell">{formatCurrency(orcamento.valor)}</td>
                  <td>{orcamento.cliente}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(orcamento.status)}`}>
                      {orcamento.status}
                    </span>
                  </td>
                  <td>{orcamento.data}</td>
                  <td className="acoes-cell">
                    <button className="btn-action edit" title="Editar">✏️</button>
                    <button className="btn-action delete" title="Excluir">🗑️</button>
                    <button className="btn-action copy" title="Copiar">📋</button>
                    <button className="btn-action print" title="Imprimir">🖨️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando 1 de {filteredOrcamentos.length} ({filteredOrcamentos.length} registros)</span>
          <div className="pagination">
            <button className="btn-pagination">Anterior</button>
            <button className="btn-pagination active">1</button>
            <button className="btn-pagination">Próximo</button>
          </div>
        </div>
      </div>

      {/* Modal de Novo Orçamento */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content-orcamento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inserir Registro</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row-top">
                <div className="form-group">
                  <label>Paciente</label>
                  <div className="input-with-button">
                    <select 
                      value={formData.paciente}
                      onChange={(e) => handleInputChange('paciente', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="Selecionar Paciente">Selecionar Paciente</option>
                      {pacientes.map(paciente => (
                        <option key={paciente} value={paciente}>{paciente}</option>
                      ))}
                    </select>
                    <button type="button" className="btn-add">+</button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Dias Validade</label>
                  <input
                    type="number"
                    value={formData.diasValidade}
                    onChange={(e) => handleInputChange('diasValidade', e.target.value)}
                    className="form-input"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Procedimentos</label>
                  <select 
                    value={formData.procedimento}
                    onChange={(e) => handleInputChange('procedimento', e.target.value)}
                    className="form-select"
                  >
                    {procedimentosDisponiveis.map(proc => (
                      <option key={proc} value={proc}>{proc}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Descrição se Houver</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={formData.descricao}
                      onChange={(e) => handleInputChange('descricao', e.target.value)}
                      className="form-input"
                      placeholder="Descrição para o procedimento"
                    />
                    <button type="button" className="btn-add-proc" onClick={handleAddProcedimento}>✓</button>
                  </div>
                </div>
              </div>

              {/* Tabela de Procedimentos */}
              <div className="procedimentos-section">
                <table className="procedimentos-table">
                  <thead>
                    <tr>
                      <th>Procedimento</th>
                      <th>Quantidade</th>
                      <th>Valor Unit</th>
                      <th>Total</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.procedimentos.map(proc => (
                      <tr key={proc.id}>
                        <td>{proc.nome}</td>
                        <td>{proc.quantidade}</td>
                        <td>{formatCurrency(proc.valorUnit)}</td>
                        <td>{formatCurrency(proc.total)}</td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-remove"
                            onClick={() => handleRemoveProcedimento(proc.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="add-procedimento">
                  <input
                    type="text"
                    value={novoProcedimento.nome}
                    onChange={(e) => setNovoProcedimento(prev => ({...prev, nome: e.target.value}))}
                    placeholder="Nome do procedimento"
                    className="proc-input"
                  />
                  <input
                    type="number"
                    value={novoProcedimento.quantidade}
                    onChange={(e) => setNovoProcedimento(prev => ({...prev, quantidade: Number(e.target.value)}))}
                    placeholder="Qtd"
                    className="proc-input-small"
                    min="1"
                  />
                  <input
                    type="number"
                    value={novoProcedimento.valorUnit}
                    onChange={(e) => setNovoProcedimento(prev => ({...prev, valorUnit: Number(e.target.value)}))}
                    placeholder="Valor unitário"
                    className="proc-input"
                    step="0.01"
                  />
                  <button type="button" className="btn-add-proc" onClick={handleAddProcedimento}>+</button>
                </div>
                
                <div className="subtotal">
                  <span>Itens: ({formData.procedimentos.length})</span>
                  <span>Subtotal: {formatCurrency(calcularSubtotal())}</span>
                </div>
              </div>

              <div className="form-row-bottom">
                <div className="form-group">
                  <label>Desc</label>
                  <div className="discount-group">
                    <input
                      type="number"
                      value={formData.desconto}
                      onChange={(e) => handleInputChange('desconto', e.target.value)}
                      className="form-input-small"
                      placeholder="Desconto"
                    />
                    <select 
                      value={formData.descontoTipo}
                      onChange={(e) => handleInputChange('descontoTipo', e.target.value)}
                      className="form-select-small"
                    >
                      <option value="%">%</option>
                      <option value="R$">R$</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Forma Pgto</label>
                  <select 
                    value={formData.formaPagamento}
                    onChange={(e) => handleInputChange('formaPagamento', e.target.value)}
                    className="form-select"
                  >
                    {formasPagamento.map(forma => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Profissional</label>
                  <select 
                    value={formData.profissional}
                    onChange={(e) => handleInputChange('profissional', e.target.value)}
                    className="form-select"
                  >
                    {profissionais.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Odontograma</label>
                  <select 
                    value={formData.odontograma}
                    onChange={(e) => handleInputChange('odontograma', e.target.value)}
                    className="form-select"
                  >
                    <option value="Selecionar Odontograma">Selecionar Odontograma</option>
                    <option value="Odontograma 1">Odontograma 1</option>
                    <option value="Odontograma 2">Odontograma 2</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="form-textarea"
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrcamentosPage;