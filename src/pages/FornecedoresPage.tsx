import React, { useState } from 'react';
import FornecedoresList from './Modulos/cadastros/Fornecedores/components/FornecedoresList';
import ModalFornecedor from './Modulos/cadastros/Fornecedores/ModalFornecedor';
import api from '../components/api/api';

interface Fornecedor {
  id: number;
  nome: string;
  razao_social: string;
  cnpj: string;
  tipo: 'Equipamentos' | 'Materiais' | 'Medicamentos' | 'Serviços' | 'Laboratório';
  categoria: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado: string;
  };
  status: 'Ativo' | 'Inativo' | 'Pendente';
  avaliacao: number;
  created_at: string;
  updated_at: string;
}

const FornecedoresPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toStatusNumber = (status: Fornecedor['status']): number => {
    if (status === 'Ativo') return 1;
    if (status === 'Inativo') return 0;
    return 2;
  };

  const buildPayload = (fornecedor: Fornecedor) => ({
    name: fornecedor.nome,
    razao_social: fornecedor.razao_social || fornecedor.nome,
    email: fornecedor.email || null,
    phone: fornecedor.telefone,
    cnpj: fornecedor.cnpj || null,
    tipo: fornecedor.tipo || null,
    categoria: fornecedor.categoria || null,
    contato: fornecedor.contato || fornecedor.nome,
    status: toStatusNumber(fornecedor.status),
    avaliacao: fornecedor.avaliacao ?? 0,
    pix: null,
    pix_key_type: null,
    street: fornecedor.endereco.logradouro || null,
    number: fornecedor.endereco.numero || null,
    complement: fornecedor.endereco.complemento || null,
    neighborhood: fornecedor.endereco.bairro || null,
    city: fornecedor.endereco.cidade || null,
    state: fornecedor.endereco.estado || null,
    cep: fornecedor.endereco.cep || null,
  });

  const handleCreate = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFornecedorSelecionado(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFornecedorSelecionado(fornecedor);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este fornecedor?');
    if (!confirm) {
      return;
    }

    (async () => {
      try {
        setErrorMessage(null);
        await api.delete(`/suppliers/${id}`);

        if (fornecedorSelecionado?.id === id) {
          setFornecedorSelecionado(null);
          setIsModalOpen(false);
        }

        setSuccessMessage('Fornecedor excluido com sucesso!');
        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        console.error('Erro ao excluir fornecedor:', error);
        const msg =
          error?.response?.data?.message ||
          'Nao foi possivel excluir o fornecedor.';
        setErrorMessage(msg);
      }
    })();
  };

  const handleView = (fornecedor: Fornecedor) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFornecedorSelecionado(fornecedor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFornecedorSelecionado(null);
  };

  const handleSave = async (fornecedor: Fornecedor): Promise<boolean> => {
    try {
      setErrorMessage(null);
      const payload = buildPayload(fornecedor);

      if (fornecedor.id) {
        await api.put(`/suppliers/${fornecedor.id}`, payload);
        setSuccessMessage('Fornecedor atualizado com sucesso!');
      } else {
        await api.post('/suppliers', payload);
        setSuccessMessage('Fornecedor cadastrado com sucesso!');
      }

      setRefreshKey((prev) => prev + 1);
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar fornecedor:', error);
      const validationErrors = error?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' | ')
        : null;
      const msg =
        validationMessage ||
        error?.response?.data?.message ||
        'Nao foi possivel salvar o fornecedor.';
      setErrorMessage(msg);
      return false;
    }
  };

  return (
    <div className="fornecedores-container min-h-screen">
      <div className="fornecedores-content max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {errorMessage}
          </div>
        )}

        <FornecedoresList
          refreshKey={refreshKey}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />

        <ModalFornecedor
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          fornecedor={fornecedorSelecionado}
        />
      </div>
    </div>
  );
};

export default FornecedoresPage;