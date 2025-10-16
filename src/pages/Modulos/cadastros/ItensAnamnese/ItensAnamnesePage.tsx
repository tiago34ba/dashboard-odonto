import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import ModalItemAnamnese from "./ModalItemAnamnese";
import styled from "styled-components";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaClipboardList, 
  FaDownload, 
  FaFileExport,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

// Interfaces
interface ItemAnamnese {
  id: number;
  codigo: string;
  pergunta: string;
  tipo_resposta: string;
  grupo: string;
  obrigatorio: boolean;
  opcoes_resposta?: string[];
  observacoes: string;
  ativo: boolean;
  created_at: string;
}

// Dados fake para teste
const dadosFakeItensAnamnese: ItemAnamnese[] = [
  {
    id: 1,
    codigo: "ANAM001",
    pergunta: "Você tem alergia a algum medicamento?",
    tipo_resposta: "Sim/Não",
    grupo: "Alergias",
    obrigatorio: true,
    opcoes_resposta: ["Sim", "Não"],
    observacoes: "Fundamental para prescrição médica",
    ativo: true,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "ANAM002",
    pergunta: "Qual medicamento você tem alergia?",
    tipo_resposta: "Texto",
    grupo: "Alergias",
    obrigatorio: false,
    observacoes: "Detalhar medicamentos específicos",
    ativo: true,
    created_at: "2025-10-01"
  },
  {
    id: 3,
    codigo: "ANAM003",
    pergunta: "Você está grávida?",
    tipo_resposta: "Sim/Não",
    grupo: "Condições Especiais",
    obrigatorio: true,
    opcoes_resposta: ["Sim", "Não", "Não se aplica"],
    observacoes: "Importante para escolha de procedimentos",
    ativo: true,
    created_at: "2025-10-02"
  },
  {
    id: 4,
    codigo: "ANAM004",
    pergunta: "Tem diabetes?",
    tipo_resposta: "Múltipla Escolha",
    grupo: "Doenças Crônicas",
    obrigatorio: true,
    opcoes_resposta: ["Não", "Tipo 1", "Tipo 2", "Gestacional"],
    observacoes: "Afeta cicatrização e anestesia",
    ativo: true,
    created_at: "2025-10-03"
  },
  {
    id: 5,
    codigo: "ANAM005",
    pergunta: "Tem problemas cardíacos?",
    tipo_resposta: "Sim/Não",
    grupo: "Doenças Crônicas",
    obrigatorio: true,
    opcoes_resposta: ["Sim", "Não"],
    observacoes: "Importante para anestesia",
    ativo: true,
    created_at: "2025-10-04"
  },
  {
    id: 6,
    codigo: "ANAM006",
    pergunta: "Fuma quantos cigarros por dia?",
    tipo_resposta: "Número",
    grupo: "Hábitos",
    obrigatorio: false,
    observacoes: "Afeta cicatrização",
    ativo: true,
    created_at: "2025-10-05"
  },
  {
    id: 7,
    codigo: "ANAM007",
    pergunta: "Já fez tratamento ortodôntico?",
    tipo_resposta: "Sim/Não",
    grupo: "Histórico Odontológico",
    obrigatorio: false,
    opcoes_resposta: ["Sim", "Não"],
    observacoes: "Histórico de tratamentos anteriores",
    ativo: true,
    created_at: "2025-10-06"
  },
  {
    id: 8,
    codigo: "ANAM008",
    pergunta: "Sente dor nos dentes atualmente?",
    tipo_resposta: "Escala 1-10",
    grupo: "Sintomas Atuais",
    obrigatorio: true,
    observacoes: "Escala de dor de 1 a 10",
    ativo: true,
    created_at: "2025-10-07"
  }
];

// Estilos (mesmo padrão estabelecido)
const PageWrapper = styled.div`
  display: flex;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'success' | 'info' | 'warning' | 'danger' }>`
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'success':
        return `background-color: #28a745; color: white; &:hover { background-color: #218838; }`;
      case 'info':
        return `background-color: #17a2b8; color: white; &:hover { background-color: #138496; }`;
      case 'warning':
        return `background-color: #ffc107; color: #212529; &:hover { background-color: #e0a800; }`;
      case 'danger':
        return `background-color: #dc3545; color: white; &:hover { background-color: #c82333; }`;
      default:
        return `background-color: #007bff; color: white; &:hover { background-color: #0056b3; }`;
    }
  }}
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.25);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(142, 68, 173, 0.25);
  }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color = 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)' }) => color};
  border-radius: 10px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 2px solid #dee2e6;
  }

  tr:hover {
    background-color: #f1f3f4;
  }
`;

const StatusBadge = styled.span<{ ativo: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ ativo }) => ativo ? '#e8f5e8' : '#ffebee'};
  color: ${({ ativo }) => ativo ? '#2e7d32' : '#d32f2f'};
`;

const TipoBadge = styled.span<{ tipo: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1976d2;
`;

const ObrigatorioBadge = styled.span<{ obrigatorio: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ obrigatorio }) => obrigatorio ? '#fff3e0' : '#f3e5f5'};
  color: ${({ obrigatorio }) => obrigatorio ? '#f57c00' : '#7b1fa2'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 0 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  ${({ variant = 'edit' }) => {
    switch (variant) {
      case 'delete':
        return `
          background-color: #dc3545;
          color: white;
          &:hover { background-color: #c82333; }
        `;
      default:
        return `
          background-color: #007bff;
          color: white;
          &:hover { background-color: #0056b3; }
        `;
    }
  }}
`;

export default function ItensAnamnesePage() {
  const [itens, setItens] = useState<ItemAnamnese[]>(dadosFakeItensAnamnese);
  const [filteredItens, setFilteredItens] = useState<ItemAnamnese[]>(dadosFakeItensAnamnese);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemAnamnese | null>(null);
  const [filtros, setFiltros] = useState({
    pergunta: '',
    grupo: '',
    tipo_resposta: '',
    ativo: 'todos'
  });

  // Função para filtrar itens
  useEffect(() => {
    let filtered = itens;

    if (filtros.pergunta) {
      filtered = filtered.filter(i => 
        i.pergunta.toLowerCase().includes(filtros.pergunta.toLowerCase()) ||
        i.codigo.toLowerCase().includes(filtros.pergunta.toLowerCase())
      );
    }

    if (filtros.grupo) {
      filtered = filtered.filter(i => i.grupo === filtros.grupo);
    }

    if (filtros.tipo_resposta) {
      filtered = filtered.filter(i => i.tipo_resposta === filtros.tipo_resposta);
    }

    if (filtros.ativo !== 'todos') {
      filtered = filtered.filter(i => i.ativo === (filtros.ativo === 'ativo'));
    }

    setFilteredItens(filtered);
  }, [filtros, itens]);

  // Estatísticas
  const stats = {
    total: itens.length,
    ativos: itens.filter(i => i.ativo).length,
    obrigatorios: itens.filter(i => i.obrigatorio).length,
    grupos: [...new Set(itens.map(i => i.grupo))].length
  };

  // Função para salvar item
  const handleSaveItem = (itemData: any) => {
    if (editingItem) {
      setItens(prev => 
        prev.map(i => i.id === editingItem.id ? { ...itemData, id: editingItem.id } : i)
      );
    } else {
      const novoItem: ItemAnamnese = {
        ...itemData,
        id: itens.length + 1,
        created_at: new Date().toISOString().split('T')[0]
      };
      setItens(prev => [...prev, novoItem]);
    }
    setEditingItem(null);
  };

  // Funções de ação
  const handleEdit = (item: ItemAnamnese) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setItens(prev => prev.filter(i => i.id !== id));
    }
  };

  // Função para exportar Excel
  const handleExportExcel = () => {
    alert('Funcionalidade de exportação Excel em desenvolvimento');
  };

  // Função para exportar XML
  const handleExportXML = () => {
    alert('Funcionalidade de exportação XML em desenvolvimento');
  };

  const grupos = [...new Set(itens.map(i => i.grupo))];
  const tiposResposta = [...new Set(itens.map(i => i.tipo_resposta))];

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <FaClipboardList />
            Itens de Anamnese
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
              Novo Item
            </StyledButton>
            <StyledButton variant="success" onClick={handleExportExcel}>
              <FaDownload />
              Exportar Excel
            </StyledButton>
            <StyledButton variant="info" onClick={handleExportXML}>
              <FaFileExport />
              Exportar XML
            </StyledButton>
          </Actions>
        </Header>

        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Itens</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatNumber>{stats.ativos}</StatNumber>
            <StatLabel>Itens Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatNumber>{stats.obrigatorios}</StatNumber>
            <StatLabel>Itens Obrigatórios</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #17a2b8 0%, #138496 100%)">
            <StatNumber>{stats.grupos}</StatNumber>
            <StatLabel>Grupos Diferentes</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Pergunta ou código..."
              value={filtros.pergunta}
              onChange={(e) => setFiltros({...filtros, pergunta: e.target.value})}
            />
          </div>
          <div>
            <FilterLabel>Grupo:</FilterLabel>
            <FilterSelect
              value={filtros.grupo}
              onChange={(e) => setFiltros({...filtros, grupo: e.target.value})}
            >
              <option value="">Todos os Grupos</option>
              {grupos.map(grupo => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Tipo:</FilterLabel>
            <FilterSelect
              value={filtros.tipo_resposta}
              onChange={(e) => setFiltros({...filtros, tipo_resposta: e.target.value})}
            >
              <option value="">Todos os Tipos</option>
              {tiposResposta.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </FilterSelect>
          </div>
        </FilterContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Pergunta</th>
                <th>Grupo</th>
                <th>Tipo Resposta</th>
                <th>Obrigatório</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItens.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.codigo}</strong></td>
                  <td>
                    <strong>{item.pergunta}</strong>
                    {item.observacoes && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {item.observacoes}
                      </div>
                    )}
                  </td>
                  <td>{item.grupo}</td>
                  <td>
                    <TipoBadge tipo={item.tipo_resposta}>
                      {item.tipo_resposta}
                    </TipoBadge>
                  </td>
                  <td>
                    <ObrigatorioBadge obrigatorio={item.obrigatorio}>
                      {item.obrigatorio ? (
                        <>
                          <FaExclamationTriangle size={10} />
                          Obrigatório
                        </>
                      ) : (
                        <>
                          <FaCheckCircle size={10} />
                          Opcional
                        </>
                      )}
                    </ObrigatorioBadge>
                  </td>
                  <td>
                    <StatusBadge ativo={item.ativo}>
                      {item.ativo ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton variant="edit" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton variant="delete" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal de Item de Anamnese */}
        <ModalItemAnamnese
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          item={editingItem}
        />
      </MainContent>
    </PageWrapper>
  );
}