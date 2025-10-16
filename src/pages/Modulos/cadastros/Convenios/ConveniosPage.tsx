import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import ModalConvenio from "./ModalConvenio";
import styled from "styled-components";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaHandshake, 
  FaDownload, 
  FaFileExport,
  FaSearch,
  FaFilter,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

// Interfaces
interface Convenio {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  uf: string;
  cep: string;
  contato_responsavel: string;
  desconto_percentual: number;
  ativo: boolean;
  created_at: string;
}

// Dados fake para teste
const dadosFakeConvenios: Convenio[] = [
  {
    id: 1,
    codigo: "CONV001",
    nome: "Unimed São Paulo",
    tipo: "Plano de Saúde",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 3000-1000",
    email: "atendimento@unimedsp.com.br",
    endereco: "Av. Paulista, 1000",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01310-100",
    contato_responsavel: "João Silva",
    desconto_percentual: 15,
    ativo: true,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "CONV002",
    nome: "Bradesco Saúde",
    tipo: "Plano de Saúde",
    cnpj: "23.456.789/0001-01",
    telefone: "(11) 4000-2000",
    email: "convenios@bradescosaude.com.br",
    endereco: "Rua Augusta, 500",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01305-000",
    contato_responsavel: "Maria Santos",
    desconto_percentual: 12,
    ativo: true,
    created_at: "2025-10-02"
  },
  {
    id: 3,
    codigo: "CONV003",
    nome: "SulAmérica Saúde",
    tipo: "Plano de Saúde",
    cnpj: "34.567.890/0001-12",
    telefone: "(11) 5000-3000",
    email: "relacionamento@sulamerica.com.br",
    endereco: "Alameda Santos, 800",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01418-100",
    contato_responsavel: "Carlos Oliveira",
    desconto_percentual: 18,
    ativo: true,
    created_at: "2025-10-03"
  },
  {
    id: 4,
    codigo: "CONV004",
    nome: "Amil Dental",
    tipo: "Plano Odontológico",
    cnpj: "45.678.901/0001-23",
    telefone: "(11) 6000-4000",
    email: "dental@amil.com.br",
    endereco: "Av. Faria Lima, 1200",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01451-000",
    contato_responsavel: "Ana Costa",
    desconto_percentual: 20,
    ativo: true,
    created_at: "2025-10-04"
  },
  {
    id: 5,
    codigo: "CONV005",
    nome: "Porto Seguro Dental",
    tipo: "Plano Odontológico",
    cnpj: "56.789.012/0001-34",
    telefone: "(11) 7000-5000",
    email: "dental@portoseguro.com.br",
    endereco: "Alameda Barão de Limeira, 425",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01202-001",
    contato_responsavel: "Roberto Lima",
    desconto_percentual: 10,
    ativo: true,
    created_at: "2025-10-05"
  },
  {
    id: 6,
    codigo: "CONV006",
    nome: "MetLife Dental",
    tipo: "Plano Odontológico",
    cnpj: "67.890.123/0001-45",
    telefone: "(11) 8000-6000",
    email: "convenios@metlife.com.br",
    endereco: "Av. Brigadeiro Faria Lima, 3400",
    cidade: "São Paulo",
    uf: "SP",
    cep: "04538-132",
    contato_responsavel: "Fernanda Souza",
    desconto_percentual: 25,
    ativo: false,
    created_at: "2025-10-06"
  }
];

// Estilos (mesmo padrão dos outros cadastros)
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
  background: linear-gradient(135deg, #2E8B57 0%, #3CB371 100%);
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
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.25);
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
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.25);
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
  background: ${({ color = 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)' }) => color};
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
  text-transform: uppercase;
  background-color: ${({ tipo }) => tipo === 'Plano de Saúde' ? '#e3f2fd' : '#f3e5f5'};
  color: ${({ tipo }) => tipo === 'Plano de Saúde' ? '#1976d2' : '#7b1fa2'};
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

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>(dadosFakeConvenios);
  const [filteredConvenios, setFilteredConvenios] = useState<Convenio[]>(dadosFakeConvenios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConvenio, setEditingConvenio] = useState<Convenio | null>(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    tipo: '',
    ativo: 'todos'
  });

  // Função para filtrar convênios
  useEffect(() => {
    let filtered = convenios;

    if (filtros.nome) {
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(filtros.nome.toLowerCase()) ||
        c.codigo.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    if (filtros.tipo) {
      filtered = filtered.filter(c => c.tipo === filtros.tipo);
    }

    if (filtros.ativo !== 'todos') {
      filtered = filtered.filter(c => c.ativo === (filtros.ativo === 'ativo'));
    }

    setFilteredConvenios(filtered);
  }, [filtros, convenios]);

  // Estatísticas
  const stats = {
    total: convenios.length,
    ativos: convenios.filter(c => c.ativo).length,
    inativos: convenios.filter(c => !c.ativo).length,
    descontoMedio: convenios.reduce((acc, c) => acc + c.desconto_percentual, 0) / convenios.length
  };

  // Função para salvar convênio
  const handleSaveConvenio = (convenioData: any) => {
    if (editingConvenio) {
      // Editar
      setConvenios(prev => 
        prev.map(c => c.id === editingConvenio.id ? { ...convenioData, id: editingConvenio.id } : c)
      );
    } else {
      // Criar novo
      const novoConvenio: Convenio = {
        ...convenioData,
        id: convenios.length + 1,
        created_at: new Date().toISOString().split('T')[0]
      };
      setConvenios(prev => [...prev, novoConvenio]);
    }
    setEditingConvenio(null);
  };

  // Função para editar
  const handleEdit = (convenio: Convenio) => {
    setEditingConvenio(convenio);
    setIsModalOpen(true);
  };

  // Função para deletar
  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este convênio?')) {
      setConvenios(prev => prev.filter(c => c.id !== id));
    }
  };

  // Função para exportar Excel
  const handleExportExcel = () => {
    const data = filteredConvenios.map(c => ({
      Código: c.codigo,
      Nome: c.nome,
      Tipo: c.tipo,
      CNPJ: c.cnpj,
      Telefone: c.telefone,
      Email: c.email,
      Cidade: c.cidade,
      UF: c.uf,
      'Desconto %': c.desconto_percentual,
      Status: c.ativo ? 'Ativo' : 'Inativo'
    }));
    
    console.log('Exportando Excel:', data);
    alert('Funcionalidade de exportação Excel em desenvolvimento');
  };

  // Função para exportar XML
  const handleExportXML = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<convenios>
${filteredConvenios.map(c => `
  <convenio>
    <codigo>${c.codigo}</codigo>
    <nome>${c.nome}</nome>
    <tipo>${c.tipo}</tipo>
    <cnpj>${c.cnpj}</cnpj>
    <telefone>${c.telefone}</telefone>
    <email>${c.email}</email>
    <desconto_percentual>${c.desconto_percentual}</desconto_percentual>
    <ativo>${c.ativo}</ativo>
  </convenio>`).join('')}
</convenios>`;
    
    console.log('Exportando XML:', xml);
    alert('Funcionalidade de exportação XML em desenvolvimento');
  };

  const tipos = ['Plano de Saúde', 'Plano Odontológico'];

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <Header>
          <Title>
            <FaHandshake />
            Cadastro de Convênios
          </Title>
          <Actions>
            <StyledButton variant="primary" onClick={() => setIsModalOpen(true)}>
              <FaPlus />
              Novo Convênio
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
          <StatCard color="linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total de Convênios</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #28a745 0%, #20c997 100%)">
            <StatNumber>{stats.ativos}</StatNumber>
            <StatLabel>Convênios Ativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #dc3545 0%, #c82333 100%)">
            <StatNumber>{stats.inativos}</StatNumber>
            <StatLabel>Convênios Inativos</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #ffc107 0%, #f39c12 100%)">
            <StatNumber>{stats.descontoMedio.toFixed(1)}%</StatNumber>
            <StatLabel>Desconto Médio</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
          <div>
            <FilterLabel>Buscar:</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Nome ou código do convênio..."
              value={filtros.nome}
              onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
            />
          </div>
          <div>
            <FilterLabel>Tipo:</FilterLabel>
            <FilterSelect
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
            >
              <option value="">Todos os Tipos</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
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
                <th>Nome / Contato</th>
                <th>Tipo</th>
                <th>CNPJ</th>
                <th>Cidade/UF</th>
                <th>Desconto</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredConvenios.map((convenio) => (
                <tr key={convenio.id}>
                  <td><strong>{convenio.codigo}</strong></td>
                  <td>
                    <strong>{convenio.nome}</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaPhone size={10} />
                        {convenio.telefone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <FaEnvelope size={10} />
                        {convenio.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <TipoBadge tipo={convenio.tipo}>
                      {convenio.tipo}
                    </TipoBadge>
                  </td>
                  <td>{convenio.cnpj}</td>
                  <td>{convenio.cidade}/{convenio.uf}</td>
                  <td>
                    <strong style={{ color: '#28a745' }}>
                      {convenio.desconto_percentual}%
                    </strong>
                  </td>
                  <td>
                    <StatusBadge ativo={convenio.ativo}>
                      {convenio.ativo ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton variant="edit" onClick={() => handleEdit(convenio)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton variant="delete" onClick={() => handleDelete(convenio.id)}>
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Modal de Convênio */}
        <ModalConvenio
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingConvenio(null);
          }}
          onSave={handleSaveConvenio}
          convenio={editingConvenio}
        />
      </MainContent>
    </PageWrapper>
  );
}