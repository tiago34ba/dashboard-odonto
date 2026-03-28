import React, { useState } from 'react';
import styled from 'styled-components';
import AddFornecedorForm from './AddFornecedorForm';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.variant === 'primary' ? `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }
  ` : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }
  `}
`;

const SearchSection = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableHeaderCell = styled.th`
  padding: 16px 24px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 16px 24px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.95rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'Ativo':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'Inativo':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'Pendente':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

const ActionButtonsCell = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ color?: string }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 0.875rem;
  
  ${props => {
    switch (props.color) {
      case 'blue':
        return `
          background: #3b82f6;
          &:hover { background: #2563eb; }
        `;
      case 'green':
        return `
          background: #10b981;
          &:hover { background: #059669; }
        `;
      case 'red':
        return `
          background: #ef4444;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: #6b7280;
          &:hover { background: #4b5563; }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 32px;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 1.25rem;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

interface Fornecedor {
  id: number;
  nome: string;
  razao_social?: string;
  cnpj: string;
  tipo?: 'Equipamentos' | 'Materiais' | 'Medicamentos' | 'Serviços' | 'Laboratório';
  categoria?: string;
  contato?: string;
  telefone: string;
  email: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  cidade?: string;
  estado?: string;
  status?: 'Ativo' | 'Inativo' | 'Pendente';
  avaliacao?: number;
  created_at?: string;
  updated_at?: string;
}

interface ModernFornecedoresListProps {
  onCreate?: () => void;
  onEdit?: (fornecedor: Fornecedor) => void;
  onDelete?: (id: number) => void;
  onView?: (fornecedor: Fornecedor) => void;
  fornecedores?: Fornecedor[];
}

const ModernFornecedoresList: React.FC<ModernFornecedoresListProps> = ({
  onCreate = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  fornecedores: externalFornecedores = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Dados de exemplo se não forem fornecidos
  const defaultFornecedores: Fornecedor[] = [
    {
      id: 1,
      nome: 'Dental Supply Co.',
      email: 'contato@dentalsupply.com',
      telefone: '(11) 98765-4321',
      cnpj: '12.345.678/0001-90',
      cidade: 'São Paulo',
      estado: 'SP',
      status: 'Ativo'
    },
    {
      id: 2,
      nome: 'MedEquip Ltda',
      email: 'vendas@medequip.com.br',
      telefone: '(21) 91234-5678',
      cnpj: '98.765.432/0001-10',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      status: 'Ativo'
    },
    {
      id: 3,
      nome: 'Instrumentos Cirúrgicos SA',
      email: 'info@instrucirur.com',
      telefone: '(31) 99999-8888',
      cnpj: '11.222.333/0001-44',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      status: 'Pendente'
    },
    {
      id: 4,
      nome: 'Pharma Dental',
      email: 'contato@pharmadental.com',
      telefone: '(47) 97777-6666',
      cnpj: '55.666.777/0001-88',
      cidade: 'Florianópolis',
      estado: 'SC',
      status: 'Inativo'
    }
  ];

  const fornecedores = externalFornecedores.length > 0 ? externalFornecedores : defaultFornecedores;

  const filteredFornecedores = fornecedores.filter(fornecedor => {
    const matchesSearch = fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fornecedor.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === '' || fornecedor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (fornecedor: Fornecedor) => {
    onEdit(fornecedor);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      onDelete(id);
    }
  };

  const handleView = (fornecedor: Fornecedor) => {
    onView(fornecedor);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>Fornecedores</Title>
          <ActionButtons>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <span>➕</span>
              Novo Fornecedor
            </Button>
            <Button variant="secondary">
              <span>📊</span>
              Exportar
            </Button>
          </ActionButtons>
        </Header>

        <SearchSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar fornecedores por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Pendente">Pendente</option>
            </FilterSelect>
          </SearchContainer>
        </SearchSection>

        <TableContainer>
          {filteredFornecedores.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <EmptyStateTitle>Nenhum fornecedor encontrado</EmptyStateTitle>
              <EmptyStateText>
                {searchTerm || statusFilter 
                  ? 'Tente ajustar os filtros para encontrar fornecedores.'
                  : 'Comece adicionando seu primeiro fornecedor.'
                }
              </EmptyStateText>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Telefone</TableHeaderCell>
                  <TableHeaderCell>CNPJ</TableHeaderCell>
                  <TableHeaderCell>Cidade</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {filteredFornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell>
                      <strong>{fornecedor.nome}</strong>
                    </TableCell>
                    <TableCell>{fornecedor.email}</TableCell>
                    <TableCell>{fornecedor.telefone}</TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>{fornecedor.cidade}, {fornecedor.estado}</TableCell>
                    <TableCell>
                      <StatusBadge status={fornecedor.status || 'Ativo'}>
                        {fornecedor.status || 'Ativo'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtonsCell>
                        <ActionButton 
                          color="blue" 
                          onClick={() => handleView(fornecedor)}
                          title="Visualizar"
                        >
                          👁️
                        </ActionButton>
                        <ActionButton 
                          color="green" 
                          onClick={() => handleEdit(fornecedor)}
                          title="Editar"
                        >
                          ✏️
                        </ActionButton>
                        <ActionButton 
                          color="red" 
                          onClick={() => handleDelete(fornecedor.id)}
                          title="Excluir"
                        >
                          🗑️
                        </ActionButton>
                      </ActionButtonsCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </ContentWrapper>

      {showAddModal && (
        <AddFornecedorForm
          onClose={() => setShowAddModal(false)}
          onSubmit={(fornecedor) => {
            console.log('Novo fornecedor:', fornecedor);
            setShowAddModal(false);
            onCreate(); // Chama a função original se necessário
          }}
        />
      )}
    </PageContainer>
  );
};

export default ModernFornecedoresList;