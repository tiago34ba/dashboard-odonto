import React from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import Header from "../../../../components/Header/Header";
import PatientTable from "../../../../components/PatientTable/PatientTable";

const PatientsPage: React.FC = () => {
  return (
    <div className="patients-page">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="actions">
          <button className="add-patient">+ Adicionar Paciente</button>
          <button className="export">Exportar</button>
        </div>
        <PatientTable />
      </div>
    </div>
  );
};

export default PatientsPage;
