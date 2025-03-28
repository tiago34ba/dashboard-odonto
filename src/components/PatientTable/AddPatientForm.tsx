import React, { useState } from "react";

interface AddPatientFormProps {
  onClose: () => void;
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

const AddPatientForm: React.FC<AddPatientFormProps> = ({ onClose }) => {
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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ nome, telefone, convenio, cidade });
    onClose();
  };

  return (
    <div className="add-patient-form">
      <h2>Adicionar Paciente</h2>
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
            className="observacoes-textarea" // Adicionando classe ao textarea
          />
        </div>
        <div className="button-container">
          <button type="submit">Adicionar</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientForm;