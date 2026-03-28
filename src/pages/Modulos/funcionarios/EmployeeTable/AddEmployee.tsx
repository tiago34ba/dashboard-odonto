import React, { useState } from "react";

interface AddEmployeeFormProps {
  onClose: () => void;
  onAddEmployee: (newEmployee: {
    id: number;
    name: string;
    phone: string;
    email: string;
    role: string;
    photo: string;
  }) => void;
}

const rolesOptions = [
  "Dentista",
  "Secretária",
  "Administrador",
  "Recepcionista",
  "Técnico em Saúde Bucal",
  "Auxiliar de Saúde Bucal",
];

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose, onAddEmployee }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Dentista");
  const [photo, setPhoto] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newEmployee = {
      id: Date.now(),
      name,
      phone,
      email,
      role,
      photo: photo || "default.jpg",
    };

    onAddEmployee(newEmployee);
    onClose();
  };

  return (
    <div className="add-employee-form">
      <h2>Adicionar Funcionário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="role">Cargo:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {rolesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="phone">Telefone:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            <label htmlFor="photo">Foto (URL):</label>
            <input
              type="text"
              id="photo"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>
        </div>
        <div className="button-container">
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <i className="fas fa-plus" style={{ marginRight: "5px" }}></i>
            Adicionar
          </button>
          <button type="button" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <i className="fas fa-times" style={{ marginRight: "5px" }}></i>
            Fechar
          </button>
        </div>
        <div className="button-container">
          <button
            type="button"
            onClick={() => console.log("Visualizar")}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <i className="fas fa-eye" style={{ marginRight: "5px" }}></i>
            Visualizar
          </button>
          <button
            type="button"
            onClick={() => console.log("Editar")}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <i className="fas fa-edit" style={{ marginRight: "5px" }}></i>
            Editar
          </button>
          <button
            type="button"
            onClick={() => console.log("Excluir")}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <i className="fas fa-trash" style={{ marginRight: "5px" }}></i>
            Excluir
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;

