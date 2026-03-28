import React, { useState } from 'react';
import styled from 'styled-components';

// Interfaces
interface Acesso {
  id?: number;
  nome: string;
  codigo: string;
  descricao: string;
  categoria: string;
  nivel_risco: 'baixo' | 'medio' | 'alto';
  sistema_interno: boolean;
  ativo: boolean;
}

interface AddAcessoModalProps {
  onClose: () => void;
  onSubmit: (acesso: Acesso) => void;
  acesso?: Acesso;
}

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 30px;
  overflow-y: auto;
  flex: 1;
  max-height: 60vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-end;
  margin-bottom: 0px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 220px;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-bottom: 2px;
  letter-spacing: 0.01em;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  background: #f9fafb;
  margin-bottom: 2px;
  &:focus {
    outline: none;
    border-color: #764ba2;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.12);
  }
  &::placeholder {
    color: #b6b6b6;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  background: #f9fafb;
  cursor: pointer;
  margin-bottom: 2px;
  &:focus {
    outline: none;
    border-color: #764ba2;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.12);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
  background: #f9fafb;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 2px;
  &:focus {
    outline: none;
    border-color: #764ba2;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.12);
  }
  &::placeholder {
    color: #b6b6b6;
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  margin: 0;
`;

const RiskBadge = styled.div<{ level: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  ${({ level }) => {
    switch (level) {
      case 'baixo':
        return 'background: #dcfce7; color: #166534;';
      case 'medio':
        return 'background: #fef3c7; color: #92400e;';
      case 'alto':
        return 'background: #fecaca; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #374151;';
    }
  }}
`;

const UtilityButton = styled.button`
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5a67d8;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    background: #667eea;
    color: white;
    &:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const AddAcessoModal: React.FC<AddAcessoModalProps> = ({ onClose, onSubmit, acesso }) => {
  const [formData, setFormData] = useState<Acesso>({
    nome: acesso?.nome || '',
    codigo: acesso?.codigo || '',
    descricao: acesso?.descricao || '',
    categoria: acesso?.categoria || 'Usuários',
    nivel_risco: acesso?.nivel_risco || 'baixo',
    sistema_interno: acesso?.sistema_interno ?? true,
    ativo: acesso?.ativo ?? true,
  });

  const [loading, setLoading] = useState(false);

  const categorias = [
    'Usuários',
    'Pacientes',
    'Relatórios',
    'Configurações',
    'Administração',
    'Financeiro',
    'Agenda',
    'Prontuário'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const gerarCodigo = () => {
    const nome = formData.nome.toLowerCase().replace(/\s+/g, '_');
    const categoria = formData.categoria.toLowerCase().replace(/\s+/g, '_');
    const codigo = `${categoria}.${nome}`;
    setFormData({ ...formData, codigo });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar acesso:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelRiscoInfo = (nivel: string) => {
    const info = {
      baixo: 'Operações básicas sem riscos para o sistema',
      medio: 'Operações que podem afetar dados importantes',
      alto: 'Operações críticas que podem comprometer o sistema'
    };
    return info[nivel as keyof typeof info] || '';
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{acesso ? 'Editar Acesso' : 'Adicionar Acesso'}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormField>
                <Label htmlFor="nome">Nome do Acesso *</Label>
                <Input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Gerenciar Usuários"
                  required
                />
              </FormField>
              <FormField>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <Label htmlFor="codigo">
                  Código do Acesso *
                  <UtilityButton type="button" onClick={gerarCodigo} style={{ marginLeft: '10px' }}>
                    🔄 Gerar Automaticamente
                  </UtilityButton>
                </Label>
                <Input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ex: usuarios.gerenciar"
                  required
                />
              </FormField>
              <FormField>
                <Label htmlFor="nivel_risco">Nível de Risco *</Label>
                <Select
                  id="nivel_risco"
                  name="nivel_risco"
                  value={formData.nivel_risco}
                  onChange={handleChange}
                  required
                >
                  <option value="baixo">Baixo</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                </Select>
                <RiskBadge level={formData.nivel_risco}>
                  {formData.nivel_risco === 'baixo' && '🟢'}
                  {formData.nivel_risco === 'medio' && '🟡'}
                  {formData.nivel_risco === 'alto' && '🔴'}
                  {getNivelRiscoInfo(formData.nivel_risco)}
                </RiskBadge>
              </FormField>
            </FormRow>

            <FormField>
              <Label htmlFor="descricao">Descrição</Label>
              <TextArea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva a funcionalidade deste acesso..."
              />
            </FormField>

            <FormRow>
              <CheckboxField>
                <Checkbox
                  type="checkbox"
                  id="sistema_interno"
                  name="sistema_interno"
                  checked={formData.sistema_interno}
                  onChange={handleChange}
                />
                <CheckboxLabel htmlFor="sistema_interno">
                  🔒 Sistema Interno
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Acesso restrito ao sistema interno
                  </div>
                </CheckboxLabel>
              </CheckboxField>

              <CheckboxField>
                <Checkbox
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                />
                <CheckboxLabel htmlFor="ativo">
                  ✅ Ativo
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Acesso habilitado para uso
                  </div>
                </CheckboxLabel>
              </CheckboxField>
            </FormRow>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                ⏳ Salvando...
              </>
            ) : (
              <>
                ✓ Salvar
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddAcessoModal;