import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  FaTimes, 
  FaCreditCard, 
  FaCode, 
  FaTag, 
  FaList, 
  FaIcons,
  FaPalette,
  FaPercentage,
  FaSortNumericUp,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaHandshake
} from "react-icons/fa";

// Interfaces
interface FormaPagamentoData {
  codigo: string;
  nome: string;
  tipo: string;
  icone: string;
  cor: string;
  taxa_juros: number;
  parcelas_max: number;
  dias_vencimento: number;
  ativo: boolean;
  aceita_parcelamento: boolean;
}

interface ModalFormaPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormaPagamentoData) => void;
  forma?: any;
}

// Tipos de pagamento disponíveis
const TIPOS_PAGAMENTO = [
  "À Vista",
  "Cartão",
  "Transferência",
  "Boleto",
  "Cheque",
  "Financiamento",
  "PIX",
  "Outros"
];

// Lista de cores predefinidas
const CORES_PREDEFINIDAS = [
  "#2ecc71", "#3498db", "#e74c3c", "#f39c12", "#9b59b6", 
  "#34495e", "#16a085", "#e67e22", "#8e44ad", "#2c3e50",
  "#d35400", "#27ae60", "#f1c40f", "#e91e63", "#607d8b"
];

// Lista de ícones disponíveis
const ICONES_DISPONIVEIS = [
  { valor: "fa-money-bill-wave", nome: "Dinheiro" },
  { valor: "fa-credit-card", nome: "Cartão" },
  { valor: "fa-qrcode", nome: "QR Code/PIX" },
  { valor: "fa-barcode", nome: "Código de Barras" },
  { valor: "fa-university", nome: "Banco" },
  { valor: "fa-file-signature", nome: "Assinatura/Cheque" },
  { valor: "fa-handshake", nome: "Acordo/Financiamento" },
  { valor: "fa-mobile-alt", nome: "Mobile/App" },
  { valor: "fa-wallet", nome: "Carteira" },
  { valor: "fa-coins", nome: "Moedas" },
  { valor: "fa-dollar-sign", nome: "Dólar" },
  { valor: "fa-receipt", nome: "Recibo" },
  { valor: "fa-calculator", nome: "Calculadora" },
  { valor: "fa-percentage", nome: "Porcentagem" },
  { valor: "fa-chart-line", nome: "Gráfico" }
];

const ModalFormaPagamento: React.FC<ModalFormaPagamentoProps> = ({
  isOpen,
  onClose,
  onSave,
  forma
}) => {
  const [formData, setFormData] = useState<FormaPagamentoData>({
    codigo: "",
    nome: "",
    tipo: "À Vista",
    icone: "fa-money-bill-wave",
    cor: "#2ecc71",
    taxa_juros: 0,
    parcelas_max: 1,
    dias_vencimento: 0,
    ativo: true,
    aceita_parcelamento: false
  });

  // Preencher dados quando estiver editando
  useEffect(() => {
    if (forma) {
      setFormData({
        codigo: forma.codigo || "",
        nome: forma.nome || "",
        tipo: forma.tipo || "À Vista",
        icone: forma.icone || "fa-money-bill-wave",
        cor: forma.cor || "#2ecc71",
        taxa_juros: forma.taxa_juros || 0,
        parcelas_max: forma.parcelas_max || 1,
        dias_vencimento: forma.dias_vencimento || 0,
        ativo: forma.ativo !== undefined ? forma.ativo : true,
        aceita_parcelamento: forma.aceita_parcelamento !== undefined ? forma.aceita_parcelamento : false
      });
    } else {
      setFormData({
        codigo: "",
        nome: "",
        tipo: "À Vista",
        icone: "fa-money-bill-wave",
        cor: "#2ecc71",
        taxa_juros: 0,
        parcelas_max: 1,
        dias_vencimento: 0,
        ativo: true,
        aceita_parcelamento: false
      });
    }
  }, [forma, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
            <FaCreditCard />
            {forma ? 'Editar Forma de Pagamento' : 'Nova Forma de Pagamento'}
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
                  placeholder="Ex: FP001"
                  required
                />
              </FormGroup>

              {/* Nome */}
              <FormGroup>
                <Label>
                  <FaTag />
                  Nome *
                </Label>
                <Input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Cartão de Crédito"
                  required
                />
              </FormGroup>

              {/* Tipo */}
              <FormGroup>
                <Label>
                  <FaList />
                  Tipo de Pagamento *
                </Label>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  {TIPOS_PAGAMENTO.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </Select>
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

              {/* Cor */}
              <FormGroup>
                <Label>
                  <FaPalette />
                  Cor *
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

              {/* Taxa de Juros */}
              <FormGroup>
                <Label>
                  <FaPercentage />
                  Taxa de Juros (% a.m.)
                </Label>
                <Input
                  type="number"
                  name="taxa_juros"
                  value={formData.taxa_juros}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0.0"
                />
                <FieldHint>
                  Taxa de juros aplicada ao valor do pagamento
                </FieldHint>
              </FormGroup>

              {/* Parcelas Máximas */}
              <FormGroup>
                <Label>
                  <FaSortNumericUp />
                  Parcelas Máximas *
                </Label>
                <Input
                  type="number"
                  name="parcelas_max"
                  value={formData.parcelas_max}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  required
                />
                <FieldHint>
                  Número máximo de parcelas permitido
                </FieldHint>
              </FormGroup>

              {/* Dias para Vencimento */}
              <FormGroup>
                <Label>
                  <FaCalendarAlt />
                  Dias para Vencimento
                </Label>
                <Input
                  type="number"
                  name="dias_vencimento"
                  value={formData.dias_vencimento}
                  onChange={handleInputChange}
                  min="0"
                  max="365"
                  placeholder="0"
                />
                <FieldHint>
                  Dias após a compra para vencimento (0 = pagamento imediato)
                </FieldHint>
              </FormGroup>

              {/* Aceita Parcelamento */}
              <FormGroup>
                <Label>
                  <FaHandshake />
                  Aceita Parcelamento
                </Label>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    name="aceita_parcelamento"
                    checked={formData.aceita_parcelamento}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel aceita={formData.aceita_parcelamento}>
                    {formData.aceita_parcelamento ? 'Sim, aceita parcelamento' : 'Não aceita parcelamento'}
                  </CheckboxLabel>
                </CheckboxContainer>
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
                    {formData.ativo ? 'Ativa' : 'Inativa'}
                  </CheckboxLabel>
                </CheckboxContainer>
              </FormGroup>
            </FormGrid>

            {/* Preview da Forma de Pagamento */}
            <PreviewContainer>
              <PreviewTitle>Visualização da Forma de Pagamento:</PreviewTitle>
              <FormaPreview color={formData.cor}>
                <PreviewIcon>
                  <i className={`fas ${formData.icone}`}></i>
                </PreviewIcon>
                <PreviewInfo>
                  <PreviewNome>{formData.nome || 'Nome da Forma'}</PreviewNome>
                  <PreviewTipo>{formData.tipo}</PreviewTipo>
                  <PreviewDetalhes>
                    {formData.taxa_juros > 0 && (
                      <DetalheBadge color="#e74c3c">
                        Taxa: {formData.taxa_juros}%
                      </DetalheBadge>
                    )}
                    {formData.parcelas_max > 1 && (
                      <DetalheBadge color="#3498db">
                        Até {formData.parcelas_max}x
                      </DetalheBadge>
                    )}
                    {formData.dias_vencimento > 0 && (
                      <DetalheBadge color="#f39c12">
                        {formData.dias_vencimento} dias
                      </DetalheBadge>
                    )}
                  </PreviewDetalhes>
                </PreviewInfo>
                <PreviewStatus ativo={formData.ativo}>
                  {formData.ativo ? 'ATIVA' : 'INATIVA'}
                </PreviewStatus>
              </FormaPreview>
            </PreviewContainer>

            <ModalFooter>
              <FooterButton type="button" variant="secondary" onClick={onClose}>
                Cancelar
              </FooterButton>
              <FooterButton type="submit" variant="primary">
                {forma ? 'Atualizar Forma' : 'Criar Forma'}
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const CheckboxLabel = styled.label<{ ativo?: boolean; aceita?: boolean }>`
  font-weight: 600;
  color: ${({ ativo, aceita }) => {
    if (ativo !== undefined) return ativo ? '#28a745' : '#dc3545';
    if (aceita !== undefined) return aceita ? '#28a745' : '#dc3545';
    return '#495057';
  }};
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

const FormaPreview = styled.div<{ color: string }>`
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

const PreviewTipo = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 2px;
`;

const PreviewDetalhes = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const DetalheBadge = styled.span<{ color: string }>`
  padding: 2px 8px;
  background-color: ${({ color }) => color};
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`;

const PreviewStatus = styled.div<{ ativo: boolean }>`
  background-color: ${({ ativo }) => ativo ? '#28a745' : '#dc3545'};
  color: white;
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

export default ModalFormaPagamento;