import React from 'react';
import AcessosList from '../components/AcessosList';

const AcessosPage: React.FC = () => {
  const handleCreate = () => {
    console.log('Criar novo acesso');
    // Aqui você implementaria a lógica para abrir modal/formulário de criação
  };

  const handleEdit = (acesso: any) => {
    console.log('Editar acesso:', acesso);
    // Aqui você implementaria a lógica para abrir modal/formulário de edição
  };

  const handleDelete = (id: number) => {
    console.log('Excluir acesso ID:', id);
    // Aqui você implementaria a lógica para confirmar e excluir o acesso
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AcessosList 
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AcessosPage;