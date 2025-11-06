import React, { useState } from "react";

// Componentes de ícones simples para substituir heroicons
const LockClosedIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>🔒</span>
);

const LockOpenIcon = ({ className }: { className?: string }) => (
  <span className={`${className} inline-block`}>🔓</span>
);

const AcessosForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    descricao: "",
    categoria: "Usuários",
    nivel_risco: "baixo",
    sistema_interno: true,
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorias = [
    "Usuários",
    "Pacientes", 
    "Relatórios",
    "Configurações",
    "Administração",
    "Financeiro",
    "Agenda",
    "Prontuário"
  ];

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const gerarCodigo = () => {
    const nome = formData.nome.toLowerCase().replace(/\s+/g, '_');
    const categoria = formData.categoria.toLowerCase().replace(/\s+/g, '_');
    const codigo = `${categoria}.${nome}`;
    setFormData({ ...formData, codigo: codigo });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/acessos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar acesso");
      }

      const result = await response.json();
      alert("Acesso cadastrado com sucesso!");
      console.log("Resposta da API:", result);

      // Limpa o formulário após o envio
      setFormData({
        nome: "",
        codigo: "",
        descricao: "",
        categoria: "Usuários",
        nivel_risco: "baixo",
        sistema_interno: true,
        ativo: true,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      console.error("Erro ao cadastrar acesso:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelRiscoInfo = (nivel: string) => {
    const info = {
      baixo: {
        color: 'text-green-600',
        description: 'Operações básicas sem riscos para o sistema'
      },
      medio: {
        color: 'text-yellow-600',
        description: 'Operações com risco moderado, requer cautela'
      },
      alto: {
        color: 'text-orange-600',
        description: 'Operações críticas que afetam dados importantes'
      },
      critico: {
        color: 'text-red-600',
        description: 'Operações que podem comprometer todo o sistema'
      }
    };
    
    return info[nivel as keyof typeof info] || info.baixo;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cadastro de Acesso</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure um novo tipo de acesso para o sistema de permissões.
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
              Nome do Acesso *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Visualizar, Criar, Editar, Excluir"
            />
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
              Categoria *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Código */}
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
            Código do Acesso *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: usuarios.view, pacientes.create"
            />
            <button
              type="button"
              onClick={gerarCodigo}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
            >
              Gerar Auto
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Formato recomendado: categoria.acao (ex: usuarios.view, pacientes.create)
          </p>
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
            placeholder="Descreva o que este acesso permite fazer no sistema..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nível de Risco */}
          <div>
            <label htmlFor="nivel_risco" className="block text-sm font-medium text-gray-700">
              Nível de Risco *
            </label>
            <select
              id="nivel_risco"
              name="nivel_risco"
              value={formData.nivel_risco}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
              <option value="critico">Crítico</option>
            </select>
            <p className={`mt-1 text-xs ${getNivelRiscoInfo(formData.nivel_risco).color}`}>
              {getNivelRiscoInfo(formData.nivel_risco).description}
            </p>
          </div>

          {/* Tipo de Sistema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Sistema *
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="sistema_interno_sim"
                  name="sistema_interno"
                  type="radio"
                  checked={formData.sistema_interno === true}
                  onChange={() => setFormData({ ...formData, sistema_interno: true })}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="sistema_interno_sim" className="ml-3 flex items-center">
                  <LockClosedIcon className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-700">Sistema Interno</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sistema_interno_nao"
                  name="sistema_interno"
                  type="radio"
                  checked={formData.sistema_interno === false}
                  onChange={() => setFormData({ ...formData, sistema_interno: false })}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="sistema_interno_nao" className="ml-3 flex items-center">
                  <LockOpenIcon className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700">Sistema Externo</span>
                </label>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Interno: acesso a funcionalidades do próprio sistema. Externo: acesso via API ou integrações.
            </p>
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
              Acesso Ativo
            </label>
            <p className="text-gray-500">
              Quando marcado, este acesso estará disponível para uso em grupos de permissão.
            </p>
          </div>
        </div>

        {/* Informações sobre Níveis de Risco */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-amber-900 mb-2">Níveis de Risco:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li><strong>Baixo:</strong> Visualização de dados não sensíveis</li>
            <li><strong>Médio:</strong> Edição de dados próprios ou não críticos</li>
            <li><strong>Alto:</strong> Edição de dados de terceiros ou exclusão</li>
            <li><strong>Crítico:</strong> Operações que afetam segurança ou configurações</li>
          </ul>
        </div>

        {/* Preview do Acesso */}
        {formData.nome && formData.codigo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Preview do Acesso:</h4>
            <div className="text-sm text-blue-800">
              <p><strong>Nome:</strong> {formData.nome}</p>
              <p><strong>Código:</strong> <code className="bg-blue-100 px-1 rounded">{formData.codigo}</code></p>
              <p><strong>Categoria:</strong> {formData.categoria}</p>
              <p><strong>Risco:</strong> {formData.nivel_risco.charAt(0).toUpperCase() + formData.nivel_risco.slice(1)}</p>
              <p><strong>Sistema:</strong> {formData.sistema_interno ? 'Interno' : 'Externo'}</p>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                nome: "",
                codigo: "",
                descricao: "",
                categoria: "Usuários",
                nivel_risco: "baixo",
                sistema_interno: true,
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
            {loading ? "Cadastrando..." : "Cadastrar Acesso"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcessosForm;