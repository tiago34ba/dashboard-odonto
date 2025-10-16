import React, { useState } from "react";
import { validatePatientForm, sanitizeInput } from "../../../../utils/validation";
import { encryptPatientData } from "../../../../utils/encryption";

interface AddPatientFormProps {
  onClose: () => void;
  onAddPatient: (newPatient: { 
    id: number; 
    nome: string; 
    telefone: string; 
    nascimento: string; 
    pessoa: string; 
    cpfCnpj: string; 
    email: string; 
    cep: string; 
    rua: string; 
    numero: string; 
    complemento: string; 
    bairro: string; 
    cidade: string; 
    estado: string; 
    tipoSanguineo: string; 
    sexo: string; 
    profissao: string; 
    estadoCivil: string; 
    convenio: string; 
    responsavel: string; 
    cpfResponsavel: string; 
    telefone2: string; 
    observacoes: string; 
  }) => void;
}

const conveniosOptions = [
  "Amil",
  "ASSIM Saúde",
  "Athena Saúde",
  "Bradesco Saúde",
  "Care Plus",
  "FSFX",
  "Hapvida",
  "MedSênior",
  "OdontoPrev",
  "Omint",
  "Particular",
  "Porto Seguro Saúde",
  "Prevent Senior",
  "São Cristovão",
  "Sul América Saúde",
  "Trasmontano",
  "Unimed Belo Horizonte",
  "Unimed Campinas",
  "Unimed Campo Grande",
  "Unimed Cuiabá",
  "Unimed Curitiba",
  "Unimed de Belém",
  "Unimed de Blumenau",
  "Unimed de Ribeirão Preto",
  "Unimed de Santos",
  "Unimed do Estado de Santa Catarina",
  "Unimed FESP",
  "Unimed Fortaleza",
  "Unimed Goiânia",
  "Unimed Grande Florianópolis",
  "Unimed João Pessoa",
  "Unimed Leste Fluminense",
  "Unimed Londrina",
  "Unimed Maceió",
  "Unimed Natal",
  "Unimed Nacional",
  "Unimed Nordeste RS",
  "Unimed Paraná",
  "Unimed Piracicaba",
  "Unimed Porto Alegre",
  "Unimed Recife",
  "Unimed Regional Maringá",
  "Unimed Saúde",
  "Unimed São José dos Campos",
  "Unimed São José do Rio Preto",
  "Unimed Sergipe",
  "Unimed Sorocaba",
  "Unimed Teresina",
  "Unimed Uberlândia",
  "Unimed Vitória",
  "Vision Med",
];

const estadosOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const tiposSanguineosOptions = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

const estadosCivisOptions = [
  "Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "Outro"
];

const AddPatientForm: React.FC<AddPatientFormProps> = ({ onClose, onAddPatient }) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [pessoa, setPessoa] = useState("Física");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("Selecionar");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [sexo, setSexo] = useState("Masculino");
  const [profissao, setProfissao] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("Solteiro(a)");
  const [convenio, setConvenio] = useState("Nenhum");
  const [responsavel, setResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  // Estados para validação
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    // Sanitizar todos os inputs
    const sanitizedData = {
      nome: sanitizeInput(nome),
      telefone: sanitizeInput(telefone),
      nascimento: sanitizeInput(nascimento),
      pessoa: sanitizeInput(pessoa),
      cpfCnpj: sanitizeInput(cpfCnpj),
      email: sanitizeInput(email),
      cep: sanitizeInput(cep),
      rua: sanitizeInput(rua),
      numero: sanitizeInput(numero),
      complemento: sanitizeInput(complemento),
      bairro: sanitizeInput(bairro),
      cidade: sanitizeInput(cidade),
      estado: sanitizeInput(estado),
      tipoSanguineo: sanitizeInput(tipoSanguineo),
      sexo: sanitizeInput(sexo),
      profissao: sanitizeInput(profissao),
      estadoCivil: sanitizeInput(estadoCivil),
      convenio: sanitizeInput(convenio),
      responsavel: sanitizeInput(responsavel),
      cpfResponsavel: sanitizeInput(cpfResponsavel),
      telefone2: sanitizeInput(telefone2),
      observacoes: sanitizeInput(observacoes),
    };

    // Validação básica sem verificação de CPF
    const basicErrors: string[] = [];
    
    if (!sanitizedData.nome.trim()) {
      basicErrors.push('Nome é obrigatório');
    }
    
    if (!sanitizedData.telefone.trim()) {
      basicErrors.push('Telefone é obrigatório');
    }
    
    if (!sanitizedData.nascimento.trim()) {
      basicErrors.push('Data de nascimento é obrigatória');
    }
    
    if (!sanitizedData.email.trim()) {
      basicErrors.push('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(sanitizedData.email)) {
      basicErrors.push('Email deve ter um formato válido');
    }
    
    if (basicErrors.length > 0) {
      setErrors(basicErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Criptografar dados sensíveis
      const encryptedPatient = encryptPatientData({
        id: Date.now(),
        ...sanitizedData,
      });

      onAddPatient(encryptedPatient);
      onClose();
    } catch (error) {
      setErrors(['Erro ao processar dados. Tente novamente.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-patient-form">
      <h2>Adicionar Paciente</h2>
      
      {/* Exibição de erros */}
      {errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Erros encontrados:</strong>
          <ul style={{ margin: '5px 0 0 20px' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="convenio">Convênio:</label>
            <select
              id="convenio"
              value={convenio}
              onChange={(e) => setConvenio(e.target.value)}
            >
              <option value="">Selecione um convênio</option>
              {conveniosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="idade">Idade:</label>
            <input
              type="number"
              id="idade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nascimento">Data de Nascimento:</label>
            <input
              type="date"
              id="nascimento"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="responsavel">Responsável:</label>
            <input
              type="text"
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="cpfResponsavel">CPF do Responsável:</label>
            <input
              type="text"
              id="cpfResponsavel"
              value={cpfResponsavel}
              onChange={(e) => setCpfResponsavel(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="telefone2">Celular:</label>
            <input
              type="text"
              id="telefone2"
              value={telefone2}
              onChange={(e) => setTelefone2(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estado">Estado:</label>
            <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Selecionar">Selecionar</option>
              {estadosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sexo">Sexo:</label>
            <select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="profissao">Profissão:</label>
            <input
              type="text"
              id="profissao"
              value={profissao}
              onChange={(e) => setProfissao(e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="estadoCivil">Estado Civil:</label>
              <select id="estadoCivil" value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)}>
                {estadosCivisOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="tipoSanguineo">Tipo Sanguíneo:</label>
              <select id="tipoSanguineo" value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)}>
                <option value="">Selecionar</option>
                {tiposSanguineosOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="pessoa">Pessoa:</label>
            <select id="pessoa" value={pessoa} onChange={(e) => setPessoa(e.target.value)}>
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="cpfCnpj">CPF / CNPJ:</label>
            <input
              type="text"
              id="cpfCnpj"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="rua">Rua:</label>
            <input
              type="text"
              id="rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="numero">Número:</label>
            <input
              type="text"
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="complemento">Complemento:</label>
            <input
              type="text"
              id="complemento"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="bairro">Bairro:</label>
            <input
              type="text"
              id="bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="observacoes">Observações:</label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="observacoes-textarea"
          />
        </div>
        <div className="button-container">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : 'Adicionar'}
          </button>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Fechar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientForm;