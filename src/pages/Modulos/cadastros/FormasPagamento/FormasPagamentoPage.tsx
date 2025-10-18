import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import styled from "styled-components";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCreditCard, 
  FaDownload, 
  FaFileExport,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
  FaBan
} from "react-icons/fa";
// Modal component implemented inline to avoid missing module
const ModalFormaPagamento: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (dadosForma: any) => void;
  forma: FormaPagamento | null;
}> = ({ isOpen, onClose, onSave, forma }) => {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cor, setCor] = useState("#3498db");
  const [icone, setIcone] = useState("");
  const [taxa, setTaxa] = useState<number>(0);
  const [parcelasMax, setParcelasMax] = useState<number>(1);
  const [diasVencimento, setDiasVencimento] = useState<number>(0);
  const [ativo, setAtivo] = useState<boolean>(true);
  const [aceitaParcelamento, setAceitaParcelamento] = useState<boolean>(false);

  useEffect(() => {
    if (forma) {
      setCodigo(forma.codigo ?? "");
      setNome(forma.nome ?? "");
      setTipo(forma.tipo ?? "");
      setCor(forma.cor ?? "#3498db");
      setIcone(forma.icone ?? "");
      setTaxa(forma.taxa_juros ?? 0);
      setParcelasMax(forma.parcelas_max ?? 1);
      setDiasVencimento(forma.dias_vencimento ?? 0);
      setAtivo(forma.ativo ?? true);
      setAceitaParcelamento(forma.aceita_parcelamento ?? false);
    } else {
      // reset for new
      setCodigo("");
      setNome("");
      setTipo("");
      setCor("#3498db");
      setIcone("");
      setTaxa(0);
      setParcelasMax(1);
      setDiasVencimento(0);
      setAtivo(true);
      setAceitaParcelamento(false);
    }
  }, [forma, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dados = {
      codigo,
      nome,
      tipo,
      cor,
      icone,
      taxa_juros: Number(taxa),
      parcelas_max: Number(parcelasMax),
      dias_vencimento: Number(diasVencimento),
      ativo,
      aceita_parcelamento: aceitaParcelamento
    };
    onSave(dados);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{forma ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Field>
              <Label>Código</Label>
              <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </Field>
            <Field>
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </Field>
            <Field>
              <Label>Tipo</Label>
              <Input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Cartão, À Vista, Transferência" />
            </Field>
            <FieldRow>
              <Field>
                <Label>Cor</Label>
                <Input type="color" value={cor} onChange={(e) => setCor(e.target.value)} />
              </Field>
              <Field>
                <Label>Ícone (classe FontAwesome)</Label>
                <Input value={icone} onChange={(e) => setIcone(e.target.value)} placeholder="fa-credit-card" />
              </Field>
            </FieldRow>
            <FieldRow>
              <Field>
                <Label>Taxa (%)</Label>
                <Input type="number" step="0.01" value={taxa} onChange={(e) => setTaxa(Number(e.target.value))} />
              </Field>
              <Field>
                <Label>Parcelas Máx.</Label>
                <Input type="number" value={parcelasMax} onChange={(e) => setParcelasMax(Number(e.target.value))} />
              </Field>
            </FieldRow>
            <Field>
              <Label>Dias para Vencimento</Label>
              <Input type="number" value={diasVencimento} onChange={(e) => setDiasVencimento(Number(e.target.value))} />
            </Field>
            <CheckboxRow>
              <label>
                <input type="checkbox" checked={aceitaParcelamento} onChange={(e) => setAceitaParcelamento(e.target.checked)} />
                Aceita Parcelamento
              </label>
              <label>
                <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                Ativo
              </label>
            </CheckboxRow>
          </ModalBody>
          <ModalFooter>
            <ActionButton type="button" variant="default" onClick={onClose}>
              Cancelar
            </ActionButton>
            <ActionButton type="submit" variant="success">
              Salvar
            </ActionButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  width: 720px;
  max-width: 95%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  h3 { margin: 0; font-size: 18px; }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
`;

const ModalBody = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalFooter = styled.div`
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
`;

const CheckboxRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

// Interfaces
interface FormaPagamento {
  id: number;
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
  created_at: string;
}

// Dados fake para teste
const dadosFakeFormasPagamento: FormaPagamento[] = [
  {
    id: 1,
    codigo: "FP001",
    nome: "Dinheiro",
    tipo: "À Vista",
    icone: "fa-money-bill-wave",
    cor: "#2ecc71",
    taxa_juros: 0,
    parcelas_max: 1,
    dias_vencimento: 0,
    ativo: true,
    aceita_parcelamento: false,
    created_at: "2025-10-01"
  },
  {
    id: 2,
    codigo: "FP002",
    nome: "Cartão de Crédito",
    tipo: "Cartão",
    icone: "fa-credit-card",
    cor: "#3498db",
    taxa_juros: 2.5,
    parcelas_max: 12,
    dias_vencimento: 0,
    ativo: true,
    aceita_parcelamento: true,
    created_at: "2025-10-01"
  },
  {
    id: 3,
    codigo: "FP003",
    nome: "Cartão de Débito",
    tipo: "Cartão",
    icone: "fa-credit-card",
    cor: "#e74c3c",
    taxa_juros: 0,
    parcelas_max: 1,
    dias_vencimento: 0,
    ativo: true,
    aceita_parcelamento: false,
    created_at: "2025-10-02"
  },
  {
    id: 4,
    codigo: "FP004",
    nome: "PIX",
    tipo: "Transferência",
    icone: "fa-qrcode",
    cor: "#f39c12",
    taxa_juros: 0,
    parcelas_max: 1,
    dias_vencimento: 0,
    ativo: true,
    aceita_parcelamento: false,
    created_at: "2025-10-02"
  },
  {
    id: 5,
    codigo: "FP005",
    nome: "Boleto Bancário",
    tipo: "Boleto",
    icone: "fa-barcode",
    cor: "#9b59b6",
    taxa_juros: 1.5,
    parcelas_max: 6,
    dias_vencimento: 7,
    ativo: true,
    aceita_parcelamento: true,
    created_at: "2025-10-03"
  },
  {
    id: 6,
    codigo: "FP006",
    nome: "Transferência Bancária",
    tipo: "Transferência",
    icone: "fa-university",
    cor: "#34495e",
    taxa_juros: 0,
    parcelas_max: 1,
    dias_vencimento: 1,
    ativo: true,
    aceita_parcelamento: false,
    created_at: "2025-10-03"
  },
  {
    id: 7,
    codigo: "FP007",
    nome: "Cheque",
    tipo: "Cheque",
    icone: "fa-file-signature",
    cor: "#95a5a6",
    taxa_juros: 0,
    parcelas_max: 3,
    dias_vencimento: 30,
    ativo: false,
    aceita_parcelamento: true,
    created_at: "2025-10-04"
  },
  {
    id: 8,
    codigo: "FP008",
    nome: "Crediário",
    tipo: "Financiamento",
    icone: "fa-handshake",
    cor: "#16a085",
    taxa_juros: 3.2,
    parcelas_max: 24,
    dias_vencimento: 30,
    ativo: true,
    aceita_parcelamento: true,
    created_at: "2025-10-05"
  }
];

const FormasPagamentoPage: React.FC = () => {
  const [formas, setFormas] = useState<FormaPagamento[]>(dadosFakeFormasPagamento);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formaEditando, setFormaEditando] = useState<FormaPagamento | null>(null);
  const [formasFiltradas, setFormasFiltradas] = useState<FormaPagamento[]>(dadosFakeFormasPagamento);

  // Filtrar formas de pagamento
  useEffect(() => {
    let result = formas.filter(forma => 
      forma.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
      forma.codigo.toLowerCase().includes(filtroNome.toLowerCase()) ||
      forma.tipo.toLowerCase().includes(filtroNome.toLowerCase())
    );

    if (filtroTipo !== "todos") {
      result = result.filter(forma => forma.tipo === filtroTipo);
    }

    if (filtroStatus === "ativo") {
      result = result.filter(forma => forma.ativo);
    } else if (filtroStatus === "inativo") {
      result = result.filter(forma => !forma.ativo);
    }

    setFormasFiltradas(result);
  }, [formas, filtroNome, filtroTipo, filtroStatus]);

  const handleAbrirModal = (forma?: FormaPagamento) => {
    setFormaEditando(forma || null);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setFormaEditando(null);
  };

  const handleSalvarForma = (dadosForma: any) => {
    if (formaEditando) {
      // Editando forma existente
      setFormas(prev => prev.map(f => 
        f.id === formaEditando.id ? { ...f, ...dadosForma } : f
      ));
    } else {
      // Adicionando nova forma
      const novaForma: FormaPagamento = {
        id: Math.max(...formas.map(f => f.id)) + 1,
        ...dadosForma,
        created_at: new Date().toISOString().split('T')[0]
      };
      setFormas(prev => [...prev, novaForma]);
    }
    handleFecharModal();
  };

  const handleExcluirForma = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta forma de pagamento?")) {
      setFormas(prev => prev.filter(f => f.id !== id));
    }
  };

  const tiposDisponiveis = [...new Set(formas.map(forma => forma.tipo))];

  const estatisticas = {
    total: formas.length,
    ativas: formas.filter(f => f.ativo).length,
    inativas: formas.filter(f => !f.ativo).length,
    parcelamento: formas.filter(f => f.aceita_parcelamento).length
  };

  return (
    <PageWrapper>
      <Sidebar />
      <MainContent>
        <PageHeader>
          <HeaderTitle>
            <FaCreditCard />
            Formas de Pagamento
          </HeaderTitle>
          <HeaderActions>
            <ActionButton
              variant="primary"
              onClick={() => handleAbrirModal()}
            >
              <FaPlus />
              Nova Forma
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
            <StatLabel>Total de Formas</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)">
            <StatNumber>{estatisticas.ativas}</StatNumber>
            <StatLabel>Formas Ativas</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)">
            <StatNumber>{estatisticas.inativas}</StatNumber>
            <StatLabel>Formas Inativas</StatLabel>
          </StatCard>
          <StatCard color="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
            <StatNumber>{estatisticas.parcelamento}</StatNumber>
            <StatLabel>Com Parcelamento</StatLabel>
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
            placeholder="Buscar por nome, código ou tipo..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          
          <FilterLabel>
            <FaFilter />
            Tipo:
          </FilterLabel>
          <FilterSelect
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os Tipos</option>
            {tiposDisponiveis.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </FilterSelect>

          <FilterLabel>
            <FaFilter />
            Status:
          </FilterLabel>
          <FilterSelect
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativas</option>
            <option value="inativo">Inativas</option>
          </FilterSelect>
        </FilterContainer>

        {/* Tabela */}
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Taxa (%)</th>
                <th>Parcelas Máx.</th>
                <th>Vencimento</th>
                <th>Parcelamento</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {formasFiltradas.map((forma) => (
                <TableRow key={forma.id}>
                  <td>{forma.codigo}</td>
                  <td>
                    <FormaInfo>
                      <IconContainer color={forma.cor}>
                        <i className={`fas ${forma.icone}`}></i>
                      </IconContainer>
                      <strong>{forma.nome}</strong>
                    </FormaInfo>
                  </td>
                  <td>
                    <TipoBadge tipo={forma.tipo}>{forma.tipo}</TipoBadge>
                  </td>
                  <td>
                    {forma.taxa_juros > 0 ? (
                      <TaxaBadge>
                        <FaPercentage />
                        {forma.taxa_juros}%
                      </TaxaBadge>
                    ) : (
                      <span style={{ color: '#28a745', fontWeight: 600 }}>
                        Sem Taxa
                      </span>
                    )}
                  </td>
                  <td>
                    <ParcelasBadge>{forma.parcelas_max}x</ParcelasBadge>
                  </td>
                  <td>
                    {forma.dias_vencimento > 0 ? (
                      <span>{forma.dias_vencimento} dias</span>
                    ) : (
                      <span style={{ color: '#28a745' }}>Imediato</span>
                    )}
                  </td>
                  <td>
                    <ParcelamentoBadge aceita={forma.aceita_parcelamento}>
                      {forma.aceita_parcelamento ? (
                        <>
                          <FaCheckCircle />
                          Sim
                        </>
                      ) : (
                        <>
                          <FaBan />
                          Não
                        </>
                      )}
                    </ParcelamentoBadge>
                  </td>
                  <td>
                    <StatusBadge ativo={forma.ativo}>
                      {forma.ativo ? (
                        <>
                          <FaCheckCircle />
                          Ativa
                        </>
                      ) : (
                        <>
                          <FaTimesCircle />
                          Inativa
                        </>
                      )}
                    </StatusBadge>
                  </td>
                  <td>{new Date(forma.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <ActionsContainer>
                      <ActionButton
                        variant="warning"
                        onClick={() => handleAbrirModal(forma)}
                        small
                      >
                        <FaEdit />
                        Editar
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={() => handleExcluirForma(forma.id)}
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
        <ModalFormaPagamento
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          onSave={handleSalvarForma}
          forma={formaEditando}
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

const FormaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

const TipoBadge = styled.span<{ tipo: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ tipo }) => {
    switch (tipo) {
      case 'À Vista': return '#28a745';
      case 'Cartão': return '#007bff';
      case 'Transferência': return '#17a2b8';
      case 'Boleto': return '#6f42c1';
      case 'Cheque': return '#6c757d';
      case 'Financiamento': return '#fd7e14';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const TaxaBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #dc3545;
  font-weight: 600;
  font-size: 12px;
`;

const ParcelasBadge = styled.span`
  background-color: #17a2b8;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ParcelamentoBadge = styled.span<{ aceita: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ aceita }) => aceita ? '#28a745' : '#dc3545'};
  color: white;
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

export default FormasPagamentoPage;