import React, { useState } from 'react';
import './AnotacoesPage.css';

interface Anotacao {
  id: number;
  titulo: string;
  texto: string;
  dataCreacao: string;
  dataModificacao: string;
  autor: string;
  mostrarDashboard: boolean;
  privado: boolean;
  categoria: string;
  tags: string[];
}

const AnotacoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listar' | 'adicionar'>('listar');
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    texto: '',
    mostrarDashboard: false,
    privado: false,
    categoria: 'Geral',
    tags: ''
  });

  // Dados fake para demonstração
  const [anotacoes] = useState<Anotacao[]>([
    {
      id: 1,
      titulo: 'Protocolo de Esterilização',
      texto: `<p><strong>Protocolo atualizado para esterilização de instrumentos:</strong></p>
              <ul>
                <li>Lavar instrumentos com detergente enzimático</li>
                <li>Enxaguar com água destilada</li>
                <li>Secar completamente antes do empacotamento</li>
                <li>Autoclave a 121°C por 15 minutos</li>
                <li>Verificar indicadores químicos e biológicos</li>
              </ul>
              <p><em>Importante: Documentar todos os ciclos de esterilização.</em></p>`,
      dataCreacao: '02/11/2025',
      dataModificacao: '05/11/2025',
      autor: 'Dr. Hugo Freitas',
      mostrarDashboard: true,
      privado: false,
      categoria: 'Procedimentos',
      tags: ['esterilização', 'protocolo', 'segurança']
    },
    {
      id: 2,
      titulo: 'Lista de Pacientes Especiais',
      texto: `<p><strong>Pacientes que requerem atenção especial:</strong></p>
              <p>• <strong>Maria Silva</strong> - Alergia à lidocaína (usar articaína)</p>
              <p>• <strong>João Santos</strong> - Hipertensão controlada (verificar PA antes dos procedimentos)</p>
              <p>• <strong>Ana Costa</strong> - Ansiedade extrema (protocolo de sedação)</p>
              <p>• <strong>Pedro Lima</strong> - Diabético tipo 2 (cuidado com cicatrização)</p>
              <p><span style="color: #dc2626;"><strong>IMPORTANTE:</strong> Sempre verificar histórico médico atualizado!</span></p>`,
      dataCreacao: '01/11/2025',
      dataModificacao: '06/11/2025',
      autor: 'Dra. Marina Costa',
      mostrarDashboard: true,
      privado: true,
      categoria: 'Pacientes',
      tags: ['pacientes', 'cuidados especiais', 'alergias']
    },
    {
      id: 3,
      titulo: 'Novos Equipamentos - Novembro 2025',
      texto: `<p><strong>Equipamentos adquiridos este mês:</strong></p>
              <ol>
                <li><strong>Autoclave Digital</strong> - Instalada na sala de esterilização</li>
                <li><strong>Câmera Intraoral HD</strong> - Para documentação de casos</li>
                <li><strong>Ultrassom Piezoelétrico</strong> - Cirurgias mais precisas</li>
                <li><strong>LED Dentário</strong> - Melhor iluminação do campo operatório</li>
              </ol>
              <p>📋 <strong>Próximos passos:</strong></p>
              <p>- Treinamento da equipe agendado para 15/11/2025<br>
              - Calibração dos equipamentos<br>
              - Atualização dos protocolos de uso</p>`,
      dataCreacao: '03/11/2025',
      dataModificacao: '03/11/2025',
      autor: 'Carlos Mendes',
      mostrarDashboard: false,
      privado: false,
      categoria: 'Equipamentos',
      tags: ['equipamentos', 'novidades', 'treinamento']
    },
    {
      id: 4,
      titulo: 'Reunião Mensal - Pontos Importantes',
      texto: `<p><strong>Reunião da equipe - 06/11/2025</strong></p>
              <p><strong>Participantes:</strong> Toda a equipe clínica e administrativa</p>
              
              <p><strong>Pontos discutidos:</strong></p>
              <ul>
                <li>📈 Aumento de 15% no número de consultas</li>
                <li>💰 Meta de faturamento atingida em outubro</li>
                <li>🎓 Curso de atualização em implantodontia aprovado</li>
                <li>📅 Novo sistema de agendamento online em teste</li>
              </ul>
              
              <p><strong>Ações definidas:</strong></p>
              <ul>
                <li>Contratar auxiliar adicional até dezembro</li>
                <li>Implementar protocolo de follow-up pós-tratamento</li>
                <li>Revisar tabela de preços para 2026</li>
              </ul>`,
      dataCreacao: '06/11/2025',
      dataModificacao: '06/11/2025',
      autor: 'Dra. Ana Paula',
      mostrarDashboard: true,
      privado: false,
      categoria: 'Administrativo',
      tags: ['reunião', 'metas', 'equipe']
    },
    {
      id: 5,
      titulo: 'Casos Clínicos Interessantes',
      texto: `<p><strong>Caso 1 - Reabilitação Completa</strong></p>
              <p>Paciente: Roberto Silva, 45 anos<br>
              Diagnóstico: Perda dentária múltipla por doença periodontal<br>
              Tratamento: Implantes múltiplos + prótese protocol</p>
              
              <p><strong>Evolução:</strong></p>
              <p>✅ Fase cirúrgica concluída com sucesso<br>
              ⏳ Osseointegração em andamento (4 meses)<br>
              📅 Próxima consulta: 20/11/2025</p>
              
              <p><strong>Caso 2 - Ortodontia Estética</strong></p>
              <p>Paciente: Juliana Oliveira, 28 anos<br>
              Tratamento: Alinhadores transparentes<br>
              Duração prevista: 18 meses</p>
              
              <p><span style="color: #059669;"><strong>Resultado excelente!</strong> Paciente muito satisfeita com o progresso.</span></p>`,
      dataCreacao: '04/11/2025',
      dataModificacao: '06/11/2025',
      autor: 'Dr. Rafael Santos',
      mostrarDashboard: false,
      privado: true,
      categoria: 'Casos Clínicos',
      tags: ['casos clínicos', 'implantes', 'ortodontia']
    }
  ]);

  const categorias = [
    'Geral',
    'Procedimentos',
    'Pacientes',
    'Equipamentos',
    'Administrativo',
    'Casos Clínicos',
    'Protocolos',
    'Treinamento'
  ];

  // Filtrar anotações baseado na busca
  const anotacoesFiltradas = anotacoes.filter(anotacao =>
    anotacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anotacao.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anotacao.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anotacao.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da anotação:', formData);
    alert('Anotação salva com sucesso!');
    
    // Resetar formulário
    setFormData({
      titulo: '',
      texto: '',
      mostrarDashboard: false,
      privado: false,
      categoria: 'Geral',
      tags: ''
    });
    
    // Voltar para a aba de listagem
    setActiveTab('listar');
  };

  const handleTabChange = (tab: 'listar' | 'adicionar') => {
    setActiveTab(tab);
  };

  const formatarTexto = (texto: string) => {
    return { __html: texto };
  };

  const getStatusIcon = (anotacao: Anotacao) => {
    if (anotacao.privado) return '🔒';
    if (anotacao.mostrarDashboard) return '📌';
    return '📄';
  };

  const getCategoriaColor = (categoria: string) => {
    const cores: { [key: string]: string } = {
      'Geral': '#6b7280',
      'Procedimentos': '#3b82f6',
      'Pacientes': '#10b981',
      'Equipamentos': '#f59e0b',
      'Administrativo': '#8b5cf6',
      'Casos Clínicos': '#ef4444',
      'Protocolos': '#06b6d4',
      'Treinamento': '#84cc16'
    };
    return cores[categoria] || '#6b7280';
  };

  return (
    <div className="anotacoes-page">
      <div className="anotacoes-header">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'listar' ? 'active' : ''}`}
            onClick={() => handleTabChange('listar')}
          >
            Listar Anotações
          </button>
          <button 
            className={`tab-button ${activeTab === 'adicionar' ? 'active' : ''}`}
            onClick={() => handleTabChange('adicionar')}
          >
            + Adicionar Novo
          </button>
        </div>
      </div>

      <div className="anotacoes-content">
        {activeTab === 'listar' ? (
          <div className="listar-tab">
            <div className="search-section">
              <input
                type="text"
                placeholder="Buscar anotações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {anotacoesFiltradas.length === 0 ? (
              <div className="empty-state">
                <p>Não possui nenhuma anotação!</p>
                <small>Clique em "Adicionar Novo" para criar sua primeira anotação</small>
              </div>
            ) : (
              <div className="anotacoes-grid">
                {anotacoesFiltradas.map(anotacao => (
                  <div key={anotacao.id} className="anotacao-card">
                    <div className="card-header">
                      <div className="header-left">
                        <span className="status-icon">{getStatusIcon(anotacao)}</span>
                        <h3>{anotacao.titulo}</h3>
                      </div>
                      <span 
                        className="categoria-badge"
                        style={{ backgroundColor: getCategoriaColor(anotacao.categoria) }}
                      >
                        {anotacao.categoria}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <div 
                        className="texto-preview" 
                        dangerouslySetInnerHTML={formatarTexto(anotacao.texto)}
                      />
                    </div>
                    
                    <div className="card-footer">
                      <div className="meta-info">
                        <span className="autor">Por: {anotacao.autor}</span>
                        <span className="data">Criado: {anotacao.dataCreacao}</span>
                        {anotacao.dataModificacao !== anotacao.dataCreacao && (
                          <span className="data">Modificado: {anotacao.dataModificacao}</span>
                        )}
                      </div>
                      
                      <div className="tags">
                        {anotacao.tags.map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                      
                      <div className="card-actions">
                        <button className="btn-action view" title="Visualizar">👁️</button>
                        <button className="btn-action edit" title="Editar">✏️</button>
                        <button className="btn-action copy" title="Copiar">📋</button>
                        <button className="btn-action delete" title="Excluir">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="adicionar-tab">
            <form onSubmit={handleSubmit} className="anotacao-form">
              <div className="form-row">
                <div className="form-group title-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className="form-input"
                    placeholder="Título"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Mostrar no Dashboard</label>
                  <select 
                    value={formData.mostrarDashboard ? 'Sim' : 'Não'}
                    onChange={(e) => handleInputChange('mostrarDashboard', e.target.value === 'Sim')}
                    className="form-select"
                  >
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Privado?</label>
                  <select 
                    value={formData.privado ? 'Sim' : 'Não'}
                    onChange={(e) => handleInputChange('privado', e.target.value === 'Sim')}
                    className="form-select"
                  >
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className="form-select"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="form-input"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Texto</label>
                <div className="editor-toolbar">
                  <button type="button" className="toolbar-btn" title="Negrito"><strong>B</strong></button>
                  <button type="button" className="toolbar-btn" title="Itálico"><em>I</em></button>
                  <button type="button" className="toolbar-btn" title="Sublinhado"><u>U</u></button>
                  <button type="button" className="toolbar-btn" title="Lista">≡</button>
                  <button type="button" className="toolbar-btn" title="Lista Numerada">1.</button>
                  <button type="button" className="toolbar-btn" title="Link">🔗</button>
                  <select className="font-size-select">
                    <option>Font Size...</option>
                    <option>12px</option>
                    <option>14px</option>
                    <option>16px</option>
                    <option>18px</option>
                  </select>
                  <select className="font-family-select">
                    <option>Font Family...</option>
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                  </select>
                  <select className="font-format-select">
                    <option>Font Format</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                    <option>Paragraph</option>
                  </select>
                </div>
                <textarea
                  value={formData.texto}
                  onChange={(e) => handleInputChange('texto', e.target.value)}
                  className="form-textarea rich-editor"
                  placeholder="Digite o conteúdo da anotação..."
                  rows={12}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Salvar ✓
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnotacoesPage;