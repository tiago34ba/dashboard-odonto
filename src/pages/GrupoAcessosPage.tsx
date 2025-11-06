import React, { useState } from 'react';
import GrupoAcessosList from '../components/GrupoAcessosList';

const GrupoAcessosPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<any>(null);

  const handleCreate = () => {
    setEditingGrupo(null);
    setShowForm(true);
  };

  const handleEdit = (grupo: any) => {
    setEditingGrupo(grupo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGrupo(null);
  };

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' }, [
    React.createElement('div', { key: 'content', className: 'container mx-auto px-4 py-8' }, [
      React.createElement(GrupoAcessosList, {
        key: 'list',
        onEdit: handleEdit,
        onCreate: handleCreate
      })
    ])
  ]);
};

export default GrupoAcessosPage;