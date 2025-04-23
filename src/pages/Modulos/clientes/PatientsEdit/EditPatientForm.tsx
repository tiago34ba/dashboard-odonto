import React, { useState, ChangeEvent } from "react";

interface Patient {
  id: number;
  name: string;
  phone: string;
  insurance: string;
  age: string;
  nascimento: string;
  responsavel: string;
  cpfResponsavel: string;
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
  telefone2: string;
  observacoes: string;
}

interface EditPatientFormProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({ patient, onClose, onUpdate }) => {
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedPatient);
    onClose();
  };

  const conveniosOptions = ["Nenhum", "Plano A", "Plano B"];
  const estadosOptions = ["Selecionar", "SP", "RJ", "MG"];
  const estadosCivisOptions = ["Solteiro(a)", "Casado(a)", "Divorciado(a)"];
  const tiposSanguineosOptions = ["Selecionar", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  return (
    <div className="edit-patient-form" style={{ maxHeight: "600px", overflowY: "auto" }}>
      <h2>Editar Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" name="name" value={editedPatient.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Telefone:</label>
            <input type="text" id="phone" name="phone" value={editedPatient.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="insurance">Convênio:</label>
            <select id="insurance" name="insurance" value={editedPatient.insurance} onChange={handleChange}>
              {conveniosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="age">Idade:</label>
            <input type="text" id="age" name="age" value={editedPatient.age} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nascimento">Data de Nascimento:</label>
            <input type="date" id="nascimento" name="nascimento" value={editedPatient.nascimento} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="responsavel">Responsável:</label>
            <input type="text" id="responsavel" name="responsavel" value={editedPatient.responsavel} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cpfResponsavel">CPF do Responsável:</label>
            <input type="text" id="cpfResponsavel" name="cpfResponsavel" value={editedPatient.cpfResponsavel} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="pessoa">Pessoa:</label>
            <select id="pessoa" name="pessoa" value={editedPatient.pessoa} onChange={handleChange}>
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cpfCnpj">CPF / CNPJ:</label>
            <input type="text" id="cpfCnpj" name="cpfCnpj" value={editedPatient.cpfCnpj} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={editedPatient.email} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cep">CEP:</label>
            <input type="text" id="cep" name="cep" value={editedPatient.cep} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="rua">Rua:</label>
            <input type="text" id="rua" name="rua" value={editedPatient.rua} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="numero">Número:</label>
            <input type="text" id="numero" name="numero" value={editedPatient.numero} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="complemento">Complemento:</label>
            <input type="text" id="complemento" name="complemento" value={editedPatient.complemento} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bairro">Bairro:</label>
            <input type="text" id="bairro" name="bairro" value={editedPatient.bairro} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="cidade">Cidade:</label>
            <input type="text" id="cidade" name="cidade" value={editedPatient.cidade} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estado">Estado:</label>
            <select id="estado" name="estado" value={editedPatient.estado} onChange={handleChange}>
              <option value="Selecionar">Selecionar</option>
              {estadosOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="tipoSanguineo">Tipo Sanguíneo:</label>
            <select id="tipoSanguineo" name="tipoSanguineo" value={editedPatient.tipoSanguineo} onChange={handleChange}>
              <option value="">Selecionar</option>
              {tiposSanguineosOptions.map((option) => (
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
            <select id="sexo" name="sexo" value={editedPatient.sexo} onChange={handleChange}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="profissao">Profissão:</label>
            <input type="text" id="profissao" name="profissao" value={editedPatient.profissao} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="estadoCivil">Estado Civil:</label>
            <select id="estadoCivil" name="estadoCivil" value={editedPatient.estadoCivil} onChange={handleChange}>
              {estadosCivisOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="telefone2">Celular:</label>
            <input type="text" id="telefone2" name="telefone2" value={editedPatient.telefone2} onChange={handleChange} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="observacoes">Observações:</label>
          <textarea id="observacoes" name="observacoes" value={editedPatient.observacoes} onChange={handleChange} />
        </div>
        <div className="button-container">
          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientForm;