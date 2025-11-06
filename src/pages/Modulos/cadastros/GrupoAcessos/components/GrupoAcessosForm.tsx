import React, { useState, useEffect } from "react";

// Componente de ícone simples para substituir heroicons
const CheckIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>✓</span>
);

interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
}

const GrupoAcessosForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    cor: "#3B82F6",
    permissoes: [] as string[],
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissoesDisponiveis, setPermissoesDisponiveis] = useState<Permissao[]>([]);

  // Permissões mockadas - em um cenário real, viriam da API
  useEffect(() => {
    const mockPermissions: Permissao[] = [
      { id: "usuarios.view", nome: "Visualizar Usuários", descricao: "Visualizar lista de usuários", categoria: "Usuários" },
      { id: "usuarios.create", nome: "Criar Usuários", descricao: "Cadastrar novos usuários", categoria: "Usuários" },
      { id: "usuarios.edit", nome: "Editar Usuários", descricao: "Editar dados de usuários", categoria: "Usuários" },
      { id: "usuarios.delete", nome: "Excluir Usuários", descricao: "Excluir usuários do sistema", categoria: "Usuários" },
      
      { id: "pacientes.view", nome: "Visualizar Pacientes", descricao: "Visualizar lista de pacientes", categoria: "Pacientes" },
      { id: "pacientes.create", nome: "Criar Pacientes", descricao: "Cadastrar novos pacientes", categoria: "Pacientes" },
      { id: "pacientes.edit", nome: "Editar Pacientes", descricao: "Editar dados de pacientes", categoria: "Pacientes" },
      { id: "pacientes.delete", nome: "Excluir Pacientes", descricao: "Excluir pacientes do sistema", categoria: "Pacientes" },
      
      { id: "relatorios.view", nome: "Visualizar Relatórios", descricao: "Acessar relatórios do sistema", categoria: "Relatórios" },
      { id: "relatorios.export", nome: "Exportar Relatórios", descricao: "Exportar relatórios em diversos formatos", categoria: "Relatórios" },
      
      { id: "configuracoes.view", nome: "Visualizar Configurações", descricao: "Acessar configurações do sistema", categoria: "Configurações" },
      { id: "configuracoes.edit", nome: "Editar Configurações", descricao: "Modificar configurações do sistema", categoria: "Configurações" },
      
      { id: "admin.full", nome: "Acesso Total", descricao: "Acesso completo ao sistema", categoria: "Administração" },
    ];
    setPermissoesDisponiveis(mockPermissions);
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handlePermissaoChange = (permissaoId: string) => {
    const novasPermissoes = formData.permissoes.includes(permissaoId)
      ? formData.permissoes.filter(p => p !== permissaoId)
      : [...formData.permissoes, permissaoId];
    
    setFormData({ ...formData, permissoes: novasPermissoes });
  };

  const selecionarTodasPermissoes = (categoria: string) => {
    const permissoesCategoria = permissoesDisponiveis
      .filter(p => p.categoria === categoria)
      .map(p => p.id);
    
    const outrasPermissoes = formData.permissoes.filter(p => 
      !permissoesDisponiveis.find(perm => perm.id === p && perm.categoria === categoria)
    );
    
    const todasSelecionadas = permissoesCategoria.every(p => formData.permissoes.includes(p));
    
    if (todasSelecionadas) {
      setFormData({ ...formData, permissoes: outrasPermissoes });
    } else {
      setFormData({ ...formData, permissoes: [...outrasPermissoes, ...permissoesCategoria] });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/grupos-acesso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar grupo de acesso");
      }

      const result = await response.json();
      alert("Grupo de acesso cadastrado com sucesso!");
      console.log("Resposta da API:", result);

      // Limpa o formulário após o envio
      setFormData({
        nome: "",
        descricao: "",
        cor: "#3B82F6",
        permissoes: [],
        ativo: true,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      console.error("Erro ao cadastrar grupo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar permissões por categoria
  const permissoesPorCategoria = permissoesDisponiveis.reduce((acc, permissao) => {
    if (!acc[permissao.categoria]) {
      acc[permissao.categoria] = [];
    }
    acc[permissao.categoria].push(permissao);
    return acc;
  }, {} as Record<string, Permissao[]>);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cadastro de Grupo de Acesso</h2>
        <p className="mt-1 text-sm text-gray-600">
          Crie grupos de acesso para organizar permissões de usuários no sistema.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Grupo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Administradores, Operadores"
            />
          </div>

          {/* Cor */}
          <div>
            <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
              Cor do Grupo
            </label>
            <div className="mt-1 flex items-center space-x-3">
              <input
                type="color"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className="h-10 w-20 border border-gray-300 rounded-md"
              />
              <span className="text-sm text-gray-500">{formData.cor}</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva as características e finalidade deste grupo..."
          />
        </div>

        {/* Permissões */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Permissões ({formData.permissoes.length} selecionadas)
          </label>
          
          <div className="space-y-6">
            {Object.entries(permissoesPorCategoria).map(([categoria, permissoes]) => {
              const permissoesArray = permissoes as Permissao[];
              const todasSelecionadas = permissoesArray.every(p => formData.permissoes.includes(p.id));
              const algumasSelecionadas = permissoesArray.some(p => formData.permissoes.includes(p.id));
              
              return (
                <div key={categoria} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900">{categoria}</h4>
                    <button
                      type="button"
                      onClick={() => selecionarTodasPermissoes(categoria)}
                      className={`text-sm px-3 py-1 rounded-md ${
                        todasSelecionadas 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {todasSelecionadas ? 'Desmarcar Todas' : 'Selecionar Todas'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissoesArray.map((permissao) => (
                      <div
                        key={permissao.id}
                        className={`relative border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.permissoes.includes(permissao.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePermissaoChange(permissao.id)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 ${
                            formData.permissoes.includes(permissao.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.permissoes.includes(permissao.id) && (
                              <CheckIcon className="w-3 h-3 text-white m-0.5" />
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{permissao.nome}</h5>
                            <p className="text-xs text-gray-500 mt-1">{permissao.descricao}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Ativo */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="ativo"
              name="ativo"
              type="checkbox"
              checked={formData.ativo}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="ativo" className="font-medium text-gray-700">
              Grupo Ativo
            </label>
            <p className="text-gray-500">
              Quando marcado, o grupo estará disponível para atribuição a usuários.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                nome: "",
                descricao: "",
                cor: "#3B82F6",
                permissoes: [],
                ativo: true,
              });
              setError(null);
            }}
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar Grupo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrupoAcessosForm;