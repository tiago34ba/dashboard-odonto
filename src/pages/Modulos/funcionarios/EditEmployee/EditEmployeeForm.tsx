import React, { useState, ChangeEvent } from "react";

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  cro: string;
  specialty: string;
  active: boolean;
  hire_date: string;
  birth_date: string;
  address: string;
  salary: string;
  commission_rate: string;
  user_id: string;
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
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={editedPatient.email} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="cro">CRO:</label>
            <input type="text" id="cro" name="cro" value={editedPatient.cro || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="specialty">Especialidade:</label>
            <input type="text" id="specialty" name="specialty" value={editedPatient.specialty || ''} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="active">Ativo:</label>
            <input type="checkbox" id="active" name="active" checked={!!editedPatient.active} onChange={e => handleChange({ ...e, target: { ...e.target, value: e.target.checked } })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="hire_date">Data de Admissão:</label>
            <input type="date" id="hire_date" name="hire_date" value={editedPatient.hire_date || ''} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="birth_date">Data de Nascimento:</label>
            <input type="date" id="birth_date" name="birth_date" value={editedPatient.birth_date || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="address">Endereço:</label>
            <input type="text" id="address" name="address" value={editedPatient.address || ''} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="salary">Salário:</label>
            <input type="text" id="salary" name="salary" value={editedPatient.salary || ''} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="commission_rate">Comissão (%):</label>
            <input type="text" id="commission_rate" name="commission_rate" value={editedPatient.commission_rate || ''} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="user_id">Usuário Vinculado:</label>
            <input type="text" id="user_id" name="user_id" value={editedPatient.user_id || ''} onChange={handleChange} />
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