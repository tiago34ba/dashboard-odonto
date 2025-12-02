import React, { useState } from "react";
import CargosForm from "./CargosForm";
import "./ModalCargosForm.css";

interface ModalCargosFormProps {
  open: boolean;
  onClose: () => void;
  onSave?: (cargoData: any) => void;
}

const ModalCargosForm: React.FC<ModalCargosFormProps> = ({ open, onClose, onSave }) => {
  if (!open) return null;
  return (
    <div className="modal-cargo-overlay">
      <div className="modal-cargo-content">
        <button className="modal-cargo-close" onClick={onClose}>&times;</button>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <h2 className="modal-cargo-title" style={{ marginBottom: 24 }}>Novo Cargo</h2>
          <CargosForm onSave={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ModalCargosForm;
