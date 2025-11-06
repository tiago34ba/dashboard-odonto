import React, { useState } from "react";
import GrupoAcessosList from "./components/GrupoAcessosList";
import GrupoAcessosForm from "./components/GrupoAcessosForm";

const GrupoAcessosPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingGrupo, setEditingGrupo] = useState<any>(null);

  const handleEdit = (grupo: any) => {
    setEditingGrupo(grupo);
    setCurrentView('form');
  };

  const handleCreate = () => {
    setEditingGrupo(null);
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setEditingGrupo(null);
    setCurrentView('list');
  };

  const handleSave = (grupoData: any) => {
    // Implementar lógica de salvamento
    console.log('Salvando grupo de acessos:', grupoData);
    setCurrentView('list');
  };

  return (
    <div className="p-6">
      {currentView === 'list' ? (
        <div>
          <div className="mb-4">
            <button 
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              ➕ Novo Grupo de Acessos
            </button>
          </div>
          {// @ts-ignore
          React.createElement(GrupoAcessosList as any, {
            onEdit: handleEdit,
            onCreate: handleCreate,
          })}
        </div>
      ) : (
        // @ts-ignore
        React.createElement(GrupoAcessosForm as any, {
          grupo: editingGrupo,
          onSave: handleSave,
          onCancel: handleBackToList,
        })
      )}
    </div>
  );
};

export default GrupoAcessosPage;