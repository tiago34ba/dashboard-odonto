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
            <input type="checkbox" id="active" name="active" checked={!!editedPatient.active} onChange={e => setEditedPatient({ ...editedPatient, active: e.target.checked })} />
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
        {/* Campos removidos pois não existem no tipo Patient */}
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