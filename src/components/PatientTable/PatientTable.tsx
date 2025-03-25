import React from "react";
//import "./PatientTable.css";

const PatientTable: React.FC = () => {
  const patients = [
    {
      name: "Francisco Neto",
      phone: "(92) 99227-6443",
      insurance: "Sim",
      age: 26,
    },
  ];

  return (
    <div className="patient-table">
      <table>
        <thead>
          <tr>
            <th>Selecionar</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Convênio</th>
            <th>Idade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{patient.name}</td>
              <td>{patient.phone}</td>
              <td>{patient.insurance}</td>
              <td>{patient.age}</td>
              <td>
                <button>✏️</button>
                <button>🗑️</button>
                <button>🔍</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
