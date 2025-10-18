import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  FaTimes, 
  FaList, 
  FaCode, 
  FaTag, 
  FaAlignLeft, 
  FaPalette,
  FaIcons,
  FaSortNumericUp,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

// Interfaces
interface GrupoAnamneseData {
  codigo: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  ordem: number;
  ativo: boolean;
}

interface ModalGrupoAnamneseProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GrupoAnamneseData) => void;
  grupo?: any;
}

// Lista de cores predefinidas
const CORES_PREDEFINIDAS = [
  "#3498db", "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6", 
  "#34495e", "#16a085", "#e67e22", "#8e44ad", "#2c3e50",
  "#d35400", "#27ae60", "#f1c40f", "#e91e63", "#607d8b"
];

// Lista de ícones disponíveis
const ICONES_DISPONIVEIS = [
  { valor: "fa-heartbeat", nome: "Coração" },
  { valor: "fa-user-md", nome: "Médico" },
  { valor: "fa-stethoscope", nome: "Estetoscópio" },
  { valor: "fa-pills", nome: "Remédios" },
  { valor: "fa-tooth", nome: "Dente" },
  { valor: "fa-user", nome: "Usuário" },
  { valor: "fa-exclamation-triangle", nome: "Alerta" },
  { valor: "fa-dumbbell", nome: "Exercício" },
  { valor: "fa-apple-alt", nome: "Alimentação" },
  { valor: "fa-smoking", nome: "Fumo" },
  { valor: "fa-wine-glass-alt", nome: "Bebida" },
  { valor: "fa-calendar-alt", nome: "Calendário" },
  { valor: "fa-clipboard-list", nome: "Lista" },
  { valor: "fa-notes-medical", nome: "Anotações Médicas" },
  { valor: "fa-microscope", nome: "Microscópio" }
];

const ModalGrupoAnamnese: React.FC<ModalGrupoAnamneseProps> = ({
  isOpen,
  onClose,
  onSave,
  grupo
}) => {
  const [formData, setFormData] = useState<GrupoAnamneseData>({
    codigo: "",
    nome: "",
    descricao: "",
    cor: "#3498db",
    icone: "fa-list",
    ordem: 1,
    ativo: true
  });

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (grupo) {
      setFormData({
        codigo: grupo.codigo || "",
        nome: grupo.nome || "",
        descricao: grupo.descricao || "",
        cor: grupo.cor || "#3498db",
        icone: grupo.icone || "fa-list",
        ordem: grupo.ordem || 1,
        ativo: grupo.ativo !== undefined ? grupo.ativo : true
      });
    } else {
      setFormData({
        codigo: "",
        nome: "",
        descricao: "",
        cor: "#3498db",
        icone: "fa-list",
        ordem: 1,
        ativo: true
      });
    }
  }, [grupo, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaList />
            {grupo ? 'Editar Grupo de Anamnese' : 'Novo Grupo de Anamnese'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              {/* Código */}
              <FormGroup>
                <Label>
                  <FaCode />
                  Código *
                </Label>
                <Input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  placeholder="Ex: GAM001"
                  required
                />
              </FormGroup>

              {/* Nome */}
              <FormGroup>
                <Label>
                  <FaTag />
                  Nome do Grupo *
                </Label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Histórico Médico"
                  required
                />
              </FormGroup>

              {/* Descrição */}
              <FormGroup fullWidth>
                <Label>
                  <FaAlignLeft />
                  Descrição
                </Label>
                <TextArea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva o propósito deste grupo de anamnese..."
                  rows={3}
                />
              </FormGroup>

              {/* Cor */}
              <FormGroup>
                <Label>
                  <FaPalette />
                  Cor do Grupo *
                </Label>
                <ColorContainer>
                  <ColorInput
                    type="color"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                  />
                  <ColorPreview color={formData.cor}>
                    {formData.cor}
                  </ColorPreview>
                </ColorContainer>
                <ColorPalette>
                  {CORES_PREDEFINIDAS.map((cor, index) => (
                    <ColorOption
                      key={index}
                      color={cor}
                      selected={formData.cor === cor}
                      onClick={() => setFormData(prev => ({ ...prev, cor }))}
                    />
                  ))}
                </ColorPalette>
              </FormGroup>

              {/* Ícone */}
              <FormGroup>
                <Label>
                  <FaIcons />
                  Ícone *
                </Label>
                <Select
                  name="icone"
                  value={formData.icone}
                  onChange={handleInputChange}
                  required
                >
                  {ICONES_DISPONIVEIS.map((icone, index) => (
                    <option key={index} value={icone.valor}>
                      {icone.nome}
                    </option>
                  ))}
                </Select>
                <IconPreview>
                  <i className={`fas ${formData.icone}`}></i>
                  Visualização do ícone
                </IconPreview>
              </FormGroup>

              {/* Ordem */}
              <FormGroup>
                <Label>
                  <FaSortNumericUp />
                  Ordem de Exibição *
                </Label>
                <Input
                  type="number"
                  name="ordem"
                  value={formData.ordem}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
                <FieldHint>
                  Define a ordem de exibição dos grupos na anamnese
                </FieldHint>
              </FormGroup>

              {/* Status */}
              <FormGroup>
                <Label>
                  {formData.ativo ? <FaToggleOn /> : <FaToggleOff />}
                  Status
                </Label>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel ativo={formData.ativo}>
                    {formData.ativo ? 'Ativo' : 'Inativo'}
                  </CheckboxLabel>
                </CheckboxContainer>
              </FormGroup>
            </FormGrid>

            {/* Preview do Grupo */}
            <PreviewContainer>
              <PreviewTitle>Visualização do Grupo:</PreviewTitle>
              <GrupoPreview color={formData.cor}>
                <PreviewIcon>
                  <i className={`fas ${formData.icone}`}></i>
                </PreviewIcon>
                <PreviewInfo>
                  <PreviewNome>{formData.nome || 'Nome do Grupo'}</PreviewNome>
                  <PreviewDescricao>{formData.descricao || 'Descrição do grupo'}</PreviewDescricao>
                  <PreviewCodigo>{formData.codigo || 'CÓDIGO'}</PreviewCodigo>
                </PreviewInfo>
                <PreviewOrdem>#{formData.ordem}</PreviewOrdem>
              </GrupoPreview>
            </PreviewContainer>

            <ModalFooter>
              <FooterButton type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </FooterButton>
              <FooterButton type="submit" variant="primary">
                {grupo ? 'Atualizar Grupo' : 'Criar Grupo'}
              </FooterButton>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${({ fullWidth }) => fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #3498db;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &:invalid {
    border-color: #e74c3c;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const ColorContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 50px;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
`;

const ColorPreview = styled.div<{ color: string }>`
  padding: 8px 16px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ColorOption = styled.div<{ color: string; selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  cursor: pointer;
  border: 3px solid ${({ selected }) => selected ? '#2c3e50' : 'transparent'};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const IconPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #6c757d;

  i {
    font-size: 18px;
    color: #3498db;
  }
`;

const FieldHint = styled.small`
  color: #6c757d;
  font-style: italic;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label<{ ativo: boolean }>`
  font-weight: 600;
  color: ${({ ativo }) => ativo ? '#28a745' : '#dc3545'};
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
`;

const GrupoPreview = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-left: 5px solid ${({ color }) => color};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PreviewIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 50%;
  
  i {
    font-size: 18px;
    color: #3498db;
  }
`;

const PreviewInfo = styled.div`
  flex: 1;
`;

const PreviewNome = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
`;

const PreviewDescricao = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 2px;
`;

const PreviewCodigo = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
`;

const PreviewOrdem = styled.div`
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 20px;
`;

const FooterButton = styled.button<{ variant: string }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          &:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3); }
        `;
      case 'secondary':
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
          &:hover { background: #e2e6ea; }
        `;
    }
  }}
`;

export default ModalGrupoAnamnese;