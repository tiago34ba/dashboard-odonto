import React, { useState, useEffect } from "react";
import ModalGrupoAnamnese from "./ModalGrupoAnamnese";
import styled from "styled-components";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaList, 
  FaDownload, 
  FaFileExport,
  FaSearch,
  FaFilter,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

// Interfaces
interface GrupoAnamnese {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  total_perguntas: number;
  created_at: string;
}

// Dados fake para teste
const dadosFakeGruposAnamnese: GrupoAnamnese[] = [
  {
    id: 1,
    codigo: "GAM001",
    nome: "Histórico Médico",
    descricao: "Perguntas relacionadas ao histórico médico do paciente",
    cor: "#3498db",
    icone: "fa-heartbeat",
    ordem: 1,
    ativo: true,
    total_perguntas: 15,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "GAM002",
    nome: "Sintomas Atuais",
    descricao: "Perguntas sobre os sintomas que o paciente apresenta atualmente",
    cor: "#e74c3c",
    icone: "fa-exclamation-triangle",
    ordem: 2,
    ativo: true,
    total_perguntas: 8,
    created_at: "2025-10-02"
  },
  {
    id: 3,
    codigo: "GAM003",
    nome: "Alergias e Medicamentos",
    descricao: "Informações sobre alergias e medicamentos em uso",
    cor: "#f39c12",
    icone: "fa-pills",
    ordem: 3,
    ativo: true,
    total_perguntas: 12,
    created_at: "2025-10-03"
  },
  {
    id: 4,
    codigo: "GAM004",
    nome: "Hábitos e Estilo de Vida",
    descricao: "Perguntas sobre hábitos alimentares, exercícios e estilo de vida",
    cor: "#2ecc71",
    icone: "fa-dumbbell",
    ordem: 4,
    ativo: true,
    total_perguntas: 10,
    created_at: "2025-10-04"
  },
  {
    id: 5,
    codigo: "GAM005",
    nome: "Histórico Odontológico",
    descricao: "Histórico de tratamentos odontológicos anteriores",
    cor: "#9b59b6",
    icone: "fa-tooth",
    ordem: 5,
    ativo: true,
    total_perguntas: 18,
    created_at: "2025-10-05"
  },
  {
    id: 6,
    codigo: "GAM006",
    nome: "Dados Pessoais",
    descricao: "Informações pessoais e de contato do paciente",
    cor: "#34495e",
    icone: "fa-user",
    ordem: 6,
    ativo: false,
    total_perguntas: 7,
    created_at: "2025-10-06"
  }
];

const GruposAnamnesePage: React.FC = () => {
  const [grupos, setGrupos] = useState<GrupoAnamnese[]>(dadosFakeGruposAnamnese);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoAnamnese | null>(null);
  const [gruposFiltrados, setGruposFiltrados] = useState<GrupoAnamnese[]>(dadosFakeGruposAnamnese);

  // Filtrar grupos
  useEffect(() => {
    let result = grupos.filter(grupo => 
      grupo.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
      grupo.codigo.toLowerCase().includes(filtroNome.toLowerCase()) ||
      grupo.descricao.toLowerCase().includes(filtroNome.toLowerCase())
    );

    if (filtroStatus === "ativo") {
      result = result.filter(grupo => grupo.ativo);
    } else if (filtroStatus === "inativo") {
      result = result.filter(grupo => !grupo.ativo);
    }

    setGruposFiltrados(result);
  }, [grupos, filtroNome, filtroStatus]);

  const handleAbrirModal = (grupo?: GrupoAnamnese) => {
    setGrupoEditando(grupo || null);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setGrupoEditando(null);
  };

  const handleSalvarGrupo = (dadosGrupo: any) => {
    if (grupoEditando) {
      // Editando grupo existente
      setGrupos(prev => prev.map(g => 
        g.id === grupoEditando.id ? { ...g, ...dadosGrupo } : g
      ));
    } else {
      // Adicionando novo grupo
      const novoGrupo: GrupoAnamnese = {
        id: Math.max(...grupos.map(g => g.id)) + 1,
        ...dadosGrupo,
        total_perguntas: 0,
        created_at: new Date().toISOString().split('T')[0]
      };
      setGrupos(prev => [...prev, novoGrupo]);
    }
    handleFecharModal();
  };

  const handleExcluirGrupo = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este grupo de anamnese?")) {
      setGrupos(prev => prev.filter(g => g.id !== id));
    }
  };

  const estatisticas = {
    total: grupos.length,
    ativos: grupos.filter(g => g.ativo).length,
    inativos: grupos.filter(g => !g.ativo).length,
    totalPerguntas: grupos.reduce((acc, g) => acc + g.total_perguntas, 0)
  };

  return (
    <PageWrapper>
      <MainContent>
        <PageHeader>
          <HeaderTitle>
            <FaList />
            Grupos de Anamnese
          </HeaderTitle>
          <HeaderActions>
            <ActionButton
              variant="primary"
              onClick={() => handleAbrirModal()}
            >
              <FaPlus />
              Novo Grupo
            </ActionButton>
            <ActionButton variant="info">
              <FaDownload />
              Exportar
            </ActionButton>
          </HeaderActions>
        </PageHeader>

        {/* Estatísticas */}
        <StatsContainer>
          <StatCard color="linear-gradient(135deg, #3498db 0%, #2980b9 100%)">
            <StatNumber>{estatisticas.total}</StatNumber>
            <StatLabel>Total de Grupos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)">
            <StatNumber>{estatisticas.ativos}</StatNumber>
            <StatLabel>Grupos Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)">
            <StatNumber>{estatisticas.inativos}</StatNumber>
            <StatLabel>Grupos Inativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
            <StatNumber>{estatisticas.totalPerguntas}</StatNumber>
            <StatLabel>Total de Perguntas</StatLabel>
          </StatCard>
        </StatsContainer>

        {/* Filtros */}
        <FilterContainer>
          <FilterLabel>
            <FaSearch />
            Pesquisar:
          </FilterLabel>
          <FilterInput
            type="text"
            placeholder="Buscar por nome, código ou descrição..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          
          <FilterLabel>
            <FaFilter />
            Status:
          </FilterLabel>
          <FilterSelect
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </FilterSelect>
        </FilterContainer>

        {/* Tabela */}
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Cor</th>
                <th>Ordem</th>
                <th>Perguntas</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gruposFiltrados.map((grupo) => (
                <TableRow key={grupo.id}>
                  <td>{grupo.codigo}</td>
                  <td>
                    <GrupoInfo>
                      <ColorIndicator color={grupo.cor} />
                      <div>
                        <strong>{grupo.nome}</strong>
                        <IconeName>
                          <i className={`fas ${grupo.icone}`}></i>
                        </IconeName>
                      </div>
                    </GrupoInfo>
                  </td>
                  <td>
                    <Descricao>{grupo.descricao}</Descricao>
                  </td>
                  <td>
                    <ColorSample color={grupo.cor}>
                      {grupo.cor}
                    </ColorSample>
                  </td>
                  <td>
                    <OrdemBadge>{grupo.ordem}º</OrdemBadge>
                  </td>
                  <td>
                    <PerguntasBadge>{grupo.total_perguntas}</PerguntasBadge>
                  </td>
                  <td>
                    <StatusBadge ativo={grupo.ativo}>
                      {grupo.ativo ? (
                        <>
                          <FaCheckCircle />
                          Ativo
                        </>
                      ) : (
                        <>
                          <FaTimesCircle />
                          Inativo
                        </>
                      )}
                    </StatusBadge>
                  </td>
                  <td>{new Date(grupo.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <ActionsContainer>
                      <ActionButton
                        variant="warning"
                        onClick={() => handleAbrirModal(grupo)}
                        small
                      >
                        <FaEdit />
                        Editar
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleExcluirGrupo(grupo.id)}
                        small
                      >
                        <FaTrash />
                        Excluir
                      </ActionButton>
                    </ActionsContainer>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal */}
        <ModalGrupoAnamnese
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          onSave={handleSalvarGrupo}
          grupo={grupoEditando}
        />
      </MainContent>
    </PageWrapper>
  );
};

// Styled Components (seguindo o padrão estabelecido)
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
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
`;

const HeaderTitle = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #3498db;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: string; small?: boolean }>`
  padding: ${({ small }) => small ? '8px 12px' : '12px 20px'};
  border: none;
  border-radius: 6px;
  font-size: ${({ small }) => small ? '12px' : '14px'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${({ variant }) => {
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
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
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
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
  }
`;

const FilterLabel = styled.label`
  color: white;
  font-weight: 500;
  margin-right: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div<{ color?: string }>`
  padding: 20px;
  background: ${({ color = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }) => color};
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
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  tbody tr:hover {
    background-color: #f8f9fa;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #fbfbfb;
  }
`;

const GrupoInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorIndicator = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const IconeName = styled.small`
  color: #6c757d;
  display: block;
  margin-top: 2px;
`;

const Descricao = styled.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6c757d;
`;

const ColorSample = styled.div<{ color: string }>`
  display: inline-block;
  padding: 4px 8px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const OrdemBadge = styled.span`
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const PerguntasBadge = styled.span`
  background-color: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const StatusBadge = styled.span<{ ativo: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ ativo }) => ativo ? '#28a745' : '#dc3545'};
  color: white;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export default GruposAnamnesePage;