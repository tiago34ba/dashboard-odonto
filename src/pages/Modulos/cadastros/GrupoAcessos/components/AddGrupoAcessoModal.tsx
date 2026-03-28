import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
}

interface AddGrupoAcessoModalProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  overflow: hidden;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 24px;
  display: flex;
  justify-content: between;
  align-items: center;
  color: white;
  flex-shrink: 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 18px;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  max-height: calc(85vh - 160px);
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ColorInput = styled.input`
  padding: 8px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  width: 60px;
  height: 45px;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const PermissionsContainer = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #f9fafb;
`;

const PermissionCategory = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CategoryTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const SelectAllButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

const PermissionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 8px;
`;

const PermissionItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const Checkbox = styled.input`
  margin-top: 2px;
  cursor: pointer;
`;

const PermissionInfo = styled.div`
  flex: 1;
`;

const PermissionName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const PermissionDescription = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #2563eb;
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9fafb;
  flex-shrink: 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: #2563eb;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1d4ed8;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const AddGrupoAcessoModal: React.FC<AddGrupoAcessoModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#2563eb',
    permissoes: [] as string[],
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [permissoesDisponiveis, setPermissoesDisponiveis] = useState<Permissao[]>([]);

  // Permissões mockadas - em um cenário real, viriam da API
  useEffect(() => {
    const mockPermissions: Permissao[] = [
      { id: "usuarios.view", nome: "Visualizar Usuários", descricao: "Visualizar lista de usuários", categoria: "Usuários" },
      { id: "usuarios.create", nome: "Criar Usuários", descricao: "Cadastrar novos usuários", categoria: "Usuários" },
      { id: "usuarios.edit", nome: "Editar Usuários", descricao: "Editar dados de usuários", categoria: "Usuários" },
      { id: "usuarios.delete", nome: "Excluir Usuários", descricao: "Excluir usuários do sistema", categoria: "Usuários" },
      
      { id: "pacientes.view", nome: "Visualizar Pacientes", descricao: "Visualizar lista de pacientes", categoria: "Pacientes" },
      { id: "pacientes.create", nome: "Criar Pacientes", descricao: "Cadastrar novos pacientes", categoria: "Pacientes" },
      { id: "pacientes.edit", nome: "Editar Pacientes", descricao: "Editar dados de pacientes", categoria: "Pacientes" },
      { id: "pacientes.delete", nome: "Excluir Pacientes", descricao: "Excluir pacientes do sistema", categoria: "Pacientes" },
      
      { id: "relatorios.view", nome: "Visualizar Relatórios", descricao: "Acessar relatórios do sistema", categoria: "Relatórios" },
      { id: "relatorios.export", nome: "Exportar Relatórios", descricao: "Exportar relatórios em diversos formatos", categoria: "Relatórios" },
      
      { id: "configuracoes.view", nome: "Visualizar Configurações", descricao: "Acessar configurações do sistema", categoria: "Configurações" },
      { id: "configuracoes.edit", nome: "Editar Configurações", descricao: "Modificar configurações do sistema", categoria: "Configurações" },
      
      { id: "admin.full", nome: "Acesso Total", descricao: "Acesso completo ao sistema", categoria: "Administração" },
    ];
    setPermissoesDisponiveis(mockPermissions);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handlePermissaoChange = (permissaoId: string) => {
    const novasPermissoes = formData.permissoes.includes(permissaoId)
      ? formData.permissoes.filter(p => p !== permissaoId)
      : [...formData.permissoes, permissaoId];
    
    setFormData({ ...formData, permissoes: novasPermissoes });
  };

  const selecionarTodasPermissoes = (categoria: string) => {
    const permissoesCategoria = permissoesDisponiveis
      .filter(p => p.categoria === categoria)
      .map(p => p.id);
    
    const outrasPermissoes = formData.permissoes.filter(p => 
      !permissoesDisponiveis.find(perm => perm.id === p && perm.categoria === categoria)
    );
    
    const todasSelecionadas = permissoesCategoria.every(p => formData.permissoes.includes(p));
    
    if (todasSelecionadas) {
      setFormData({ ...formData, permissoes: outrasPermissoes });
    } else {
      setFormData({ ...formData, permissoes: [...outrasPermissoes, ...permissoesCategoria] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Novo grupo de acesso:', formData);
      onSubmit(formData);
      alert('Grupo de acesso cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      alert('Erro ao cadastrar grupo de acesso');
    } finally {
      setLoading(false);
    }
  };

  // Agrupar permissões por categoria
  const permissoesPorCategoria = permissoesDisponiveis.reduce((acc, permissao) => {
    if (!acc[permissao.categoria]) {
      acc[permissao.categoria] = [];
    }
    acc[permissao.categoria].push(permissao);
    return acc;
  }, {} as Record<string, Permissao[]>);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <Title>Adicionar Grupo de Acesso</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormSection>
              <SectionTitle>Informações Básicas</SectionTitle>
              <FormGrid>
                <FormField>
                  <Label>Nome do Grupo *</Label>
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome do grupo"
                    required
                  />
                </FormField>

                <FormField>
                  <Label>Cor do Grupo</Label>
                  <ColorInput
                    type="color"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                  />
                </FormField>
              </FormGrid>

              <FormField>
                <Label>Descrição</Label>
                <Textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descrição do grupo de acesso..."
                />
              </FormField>

              <FormField>
                <Label>Status</Label>
                <StatusContainer>
                  <Switch>
                    <SwitchInput
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleChange}
                    />
                    <SwitchSlider />
                  </Switch>
                  <span>{formData.ativo ? 'Ativo' : 'Inativo'}</span>
                </StatusContainer>
              </FormField>
            </FormSection>

            <FormSection>
              <SectionTitle>Permissões</SectionTitle>
              <PermissionsContainer>
                {Object.entries(permissoesPorCategoria).map(([categoria, permissoes]) => (
                  <PermissionCategory key={categoria}>
                    <CategoryHeader>
                      <CategoryTitle>{categoria}</CategoryTitle>
                      <SelectAllButton
                        type="button"
                        onClick={() => selecionarTodasPermissoes(categoria)}
                      >
                        {permissoes.every(p => formData.permissoes.includes(p.id)) 
                          ? 'Desmarcar Todas' 
                          : 'Selecionar Todas'}
                      </SelectAllButton>
                    </CategoryHeader>
                    <PermissionsList>
                      {permissoes.map((permissao) => (
                        <PermissionItem key={permissao.id}>
                          <Checkbox
                            type="checkbox"
                            checked={formData.permissoes.includes(permissao.id)}
                            onChange={() => handlePermissaoChange(permissao.id)}
                          />
                          <PermissionInfo>
                            <PermissionName>{permissao.nome}</PermissionName>
                            <PermissionDescription>{permissao.descricao}</PermissionDescription>
                          </PermissionInfo>
                        </PermissionItem>
                      ))}
                    </PermissionsList>
                  </PermissionCategory>
                ))}
              </PermissionsContainer>
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span>⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Salvar
                </>
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddGrupoAcessoModal;