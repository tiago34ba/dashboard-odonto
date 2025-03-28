import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import Modal from "./Modal";
import AddPatientForm from "../../../../components/PatientTable/AddPatientForm";

const PatientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const patients = [
    { id: 1, name: "mateus", phone: "(71)99640-5570", insurance: "Hapvida", age: "44" },
    { id: 2, name: "mateus", phone: "(71)98666-0020", insurance: "Amil", age: "30" },
    { id: 3, name: "JORGE ERICSSON SILVA PINHEIRO", phone: "(71)98632-0010", insurance: "Unimed Nacional", age: "60" },
    { id: 4, name: "Francisco neto", phone: "(92) 99227-6443", insurance: "Bradesco Saúde", age: "26" },
  ];

  return (
    <div className="patients-page" style={{ display: "flex" }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1, padding: "20px" }}>
        <div
          className="actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333" }}>Lista de Pacientes</h2>
          <div style={{ display: "flex" }}>
            <button
              className="add-patient"
              onClick={handleOpenModal}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s ease",
                backgroundColor: "#007bff",
                color: "white",
                marginRight: "10px",
              }}
            
            >
              + Adicionar Paciente
            </button>
            <button
              className="export"
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "background-color 0.3s ease",
                backgroundColor: "#f8f9fa",
                color: "#333",
              }}
            >
              Exportar
            </button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <div>
            Exibir <select style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select> resultados por página
          </div>
          <div>
            Buscar: <input type="text" style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }} />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Selecionar</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Nome</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Telefone</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Convênio</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Idade</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}><input type="checkbox" /></td>
                <td style={{ padding: "10px" }}>{patient.name}</td>
                <td style={{ padding: "10px" }}>{patient.phone}</td>
                <td style={{ padding: "10px" }}>{patient.insurance}</td>
                <td style={{ padding: "10px" }}>{patient.age}</td>
                <td style={{ padding: "10px" }}>
                  <button style={{ marginRight: "5px", padding: "5px 10px", borderRadius: "4px", border: "none", background: "#007bff", color: "white" }}>Editar</button>
                  <button style={{ marginRight: "5px", padding: "5px 10px", borderRadius: "4px", border: "none", background: "#f00", color: "white" }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <div>Mostrando 1 de 4 (4 registros)</div>
          <div>
            <button style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd", marginRight: "5px" }}>Anterior</button>
            <button style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd", marginRight: "5px" }}>1</button>
            <button style={{ padding: "5px 10px", borderRadius: "4px", border: "1px solid #ddd" }}>Próximo</button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AddPatientForm onClose={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
};

export default PatientsPage;