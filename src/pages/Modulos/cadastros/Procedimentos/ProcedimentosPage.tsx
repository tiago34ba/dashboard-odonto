import React, { useState, useEffect } from "react";
import ModalProcedimento from "./ModalProcedimento";
import styled from "styled-components";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToolbox, 
  FaDownload, 
  FaFileExport,
  FaSearch,
  FaFilter,
  FaDollarSign,
  FaClock
} from "react-icons/fa";

// Interfaces
interface Procedimento {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  valor: number;
  duracao: number; // em minutos
  descricao: string;
  ativo: boolean;
  created_at: string;
}

// Dados fake para teste
const dadosFakeProcedimentos: Procedimento[] = [
  {
    id: 1,
    codigo: "PROC001",
    nome: "Limpeza e Profilaxia",
    categoria: "Preventivo",
    valor: 150.00,
    duracao: 45,
    descricao: "Limpeza completa dos dentes com remoção de tártaro e placa bacteriana",
    ativo: true,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "PROC002",
    nome: "Restauração em Resina",
    categoria: "Restaurador",
    valor: 250.00,
    duracao: 60,
    descricao: "Restauração de dente com resina composta",
    ativo: true,
    created_at: "2025-10-02"
  },
  {
    id: 3,
    codigo: "PROC003",
    nome: "Tratamento de Canal",
    categoria: "Endodontia",
    valor: 600.00,
    duracao: 90,
    descricao: "Tratamento endodôntico completo",
    ativo: true,
    created_at: "2025-10-03"
  },
  {
    id: 4,
    codigo: "PROC004",
    nome: "Extração Simples",
    categoria: "Cirúrgico",
    valor: 150.00,
    duracao: 30,
    descricao: "Extração de dente sem complicações",
    ativo: true,
    created_at: "2025-10-04"
  },
  {
    id: 5,
    codigo: "PROC005",
    nome: "Implante Dentário",
    categoria: "Cirúrgico",
    valor: 1500.00,
    duracao: 120,
    descricao: "Implante osseointegrado com parafuso",
    ativo: true,
    created_at: "2025-10-05"
  },
  {
    id: 6,
    codigo: "PROC006",
    nome: "Ortodontia - Consulta",
    categoria: "Ortodontia",
    valor: 600.00,
    duracao: 45,
    descricao: "Consulta ortodôntica com planejamento",
    ativo: true,
    created_at: "2025-10-06"
  },
  {
    id: 7,
    codigo: "PROC007",
    nome: "Prótese Total",
    categoria: "Protético",
    valor: 2000.00,
    duracao: 180,
    descricao: "Confecção de prótese total removível",
    ativo: true,
    created_at: "2025-10-07"
  },
  {
    id: 8,
    codigo: "PROC008",
    nome: "Clareamento Dental",
    categoria: "Estético",
    valor: 800.00,
    duracao: 60,
    descricao: "Clareamento dental em consultório",
    ativo: true,
    created_at: "2025-10-08"
  },
  {
    id: 9,
    codigo: "PROC009",
    nome: "Aplicação de Flúor",
    categoria: "Preventivo",
    valor: 50.00,
    duracao: 15,
    descricao: "Aplicação tópica de flúor",
    ativo: true,
    created_at: "2025-10-09"
  },
  {
    id: 10,
    codigo: "PROC010",
    nome: "Cirurgia de Siso",
    categoria: "Cirúrgico",
    valor: 400.00,
    duracao: 45,
    descricao: "Extração de terceiro molar incluso",
    ativo: false,
    created_at: "2025-10-10"
  }
];

// Estilos (reutilizando o padrão já estabelecido)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
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
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
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
  background: ${({ color = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }) => color};
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

export default function ProcedimentosPage() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>(dadosFakeProcedimentos);
  const [filteredProcedimentos, setFilteredProcedimentos] = useState<Procedimento[]>(dadosFakeProcedimentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedimento, setEditingProcedimento] = useState<Procedimento | null>(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    ativo: 'todos'
  });

  // Função para filtrar procedimentos
  useEffect(() => {
    let filtered = procedimentos;

    if (filtros.nome) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(filtros.nome.toLowerCase()) ||
        p.codigo.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    if (filtros.categoria) {
      filtered = filtered.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.ativo !== 'todos') {
      filtered = filtered.filter(p => p.ativo === (filtros.ativo === 'ativo'));
    }

    setFilteredProcedimentos(filtered);
  }, [filtros, procedimentos]);

  // Estatísticas
  const stats = {
    total: procedimentos.length,
    ativos: procedimentos.filter(p => p.ativo).length,
    inativos: procedimentos.filter(p => !p.ativo).length,
    valorMedio: procedimentos.reduce((acc, p) => acc + p.valor, 0) / procedimentos.length
  };

  // Função para salvar procedimento
  const handleSaveProcedimento = (procedimentoData: any) => {
    if (editingProcedimento) {
      // Editar
      setProcedimentos(prev => 
        prev.map(p => p.id === editingProcedimento.id ? { ...procedimentoData, id: editingProcedimento.id } : p)
      );
    } else {
      // Criar novo
      const novoProcedimento: Procedimento = {
        ...procedimentoData,
        id: procedimentos.length + 1,
        created_at: new Date().toISOString().split('T')[0]
      };
      setProcedimentos(prev => [...prev, novoProcedimento]);
    }
    setEditingProcedimento(null);
  };

  // Função para editar
  const handleEdit = (procedimento: Procedimento) => {
    setEditingProcedimento(procedimento);
    setIsModalOpen(true);
  };

  // Função para deletar
  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este procedimento?')) {
      setProcedimentos(prev => prev.filter(p => p.id !== id));
    }
  };

  // Função para exportar Excel
  const handleExportExcel = () => {
    const data = filteredProcedimentos.map(p => ({
      Código: p.codigo,
      Nome: p.nome,
      Categoria: p.categoria,
      Valor: `R$ ${p.valor.toFixed(2)}`,
      Duração: `${p.duracao} min`,
      Status: p.ativo ? 'Ativo' : 'Inativo',
      'Data Criação': new Date(p.created_at).toLocaleDateString('pt-BR')
    }));
    
    console.log('Exportando Excel:', data);
    alert('Funcionalidade de exportação Excel em desenvolvimento');
  };

  // Função para exportar XML
  const handleExportXML = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<procedimentos>
${filteredProcedimentos.map(p => `
  <procedimento>
    <codigo>${p.codigo}</codigo>
    <nome>${p.nome}</nome>
    <categoria>${p.categoria}</categoria>
    <valor>${p.valor}</valor>
    <duracao>${p.duracao}</duracao>
    <ativo>${p.ativo}</ativo>
  </procedimento>`).join('')}
</procedimentos>`;
    
    console.log('Exportando XML:', xml);
    alert('Funcionalidade de exportação XML em desenvolvimento');
  };

  const categorias = ['Preventivo', 'Restaurador', 'Endodontia', 'Cirúrgico', 'Ortodontia', 'Protético', 'Estético'];

  return (
    <PageWrapper>
      <MainContent>
        <Header>
          <Title>
            <FaToolbox />
            Cadastro de Procedimentos
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
              Novo Procedimento
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
          <StatCard color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Procedimentos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatNumber>{stats.ativos}</StatNumber>
            <StatLabel>Procedimentos Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #dc3545 0%, #c82333 100%)">
            <StatNumber>{stats.inativos}</StatNumber>
            <StatLabel>Procedimentos Inativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatNumber>R$ {stats.valorMedio.toFixed(0)}</StatNumber>
            <StatLabel>Valor Médio</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Nome ou código do procedimento..."
              value={filtros.nome}
              onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
            />
          </div>
          <div>
            <FilterLabel>Categoria:</FilterLabel>
            <FilterSelect
              value={filtros.categoria}
              onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
            >
              <option value="">Todas as Categorias</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </FilterSelect>
          </div>
          <div>
            <FilterLabel>Status:</FilterLabel>
            <FilterSelect
              value={filtros.ativo}
              onChange={(e) => setFiltros({...filtros, ativo: e.target.value})}
            >
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </FilterSelect>
          </div>
        </FilterContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Duração</th>
                <th>Status</th>
                <th>Data Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcedimentos.map((procedimento) => (
                <tr key={procedimento.id}>
                  <td><strong>{procedimento.codigo}</strong></td>
                  <td>
                    <strong>{procedimento.nome}</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {procedimento.descricao}
                    </div>
                  </td>
                  <td>{procedimento.categoria}</td>
                  <td>
                    <strong style={{ color: '#28a745' }}>
                      R$ {procedimento.valor.toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaClock size={12} />
                      {procedimento.duracao} min
                    </div>
                  </td>
                  <td>
                    <StatusBadge ativo={procedimento.ativo}>
                      {procedimento.ativo ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </td>
                  <td>{new Date(procedimento.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <ActionButton variant="edit" onClick={() => handleEdit(procedimento)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton variant="delete" onClick={() => handleDelete(procedimento.id)}>
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal de Procedimento */}
        <ModalProcedimento
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProcedimento(null);
          }}
          onSave={handleSaveProcedimento}
          procedimento={editingProcedimento}
        />
      </MainContent>
    </PageWrapper>
  );
}