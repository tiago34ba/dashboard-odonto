import React, { useState, useEffect } from "react";

interface CargosFormProps {
  cargo?: any;
  onSave?: (cargoData: any) => void;
  onCancel?: () => void;
}

const CargosForm: React.FC<CargosFormProps> = ({ cargo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    nivel_acesso: "baixo",
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Popula o formulário quando um cargo é passado para edição
  useEffect(() => {
    if (cargo) {
      setFormData({
        nome: cargo.nome || "",
        descricao: cargo.descricao || "",
        nivel_acesso: cargo.nivel_acesso || "baixo",
        ativo: cargo.ativo !== undefined ? cargo.ativo : true,
      });
    }
  }, [cargo]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Se há uma função onSave (modo de edição), usa ela
      if (onSave) {
        onSave(formData);
        return;
      }

      // Caso contrário, faz a requisição normal para a API
      const response = await fetch("/api/cargos", {
        method: cargo ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar cargo");
      }

      const result = await response.json();
      alert(`Cargo ${cargo ? 'atualizado' : 'cadastrado'} com sucesso!`);
      console.log("Resposta da API:", result);

      // Limpa o formulário após o envio (apenas no modo criação)
      if (!cargo) {
        setFormData({
          nome: "",
          descricao: "",
          nivel_acesso: "baixo",
          ativo: true,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      console.error("Erro ao cadastrar cargo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {cargo ? 'Editar Cargo' : 'Cadastro de Cargo'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {cargo 
                    ? 'Atualize as informações do cargo selecionado'
                    : 'Configure um novo cargo com suas permissões e responsabilidades'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro ao processar dados</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Basic Information Section */}
            <div className="px-6 py-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informações Básicas
                </h2>
                <p className="text-sm text-gray-600">Defina o nome e nível de acesso do cargo</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nome do Cargo */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700">
                    Nome do Cargo
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Ex: Desenvolvedor, Gerente, Analista"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Nível de Acesso */}
                <div className="space-y-2">
                  <label htmlFor="nivel_acesso" className="block text-sm font-semibold text-gray-700">
                    Nível de Acesso
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="nivel_acesso"
                      name="nivel_acesso"
                      value={formData.nivel_acesso}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                    >
                      <option value="baixo">🔹 Baixo - Visualização</option>
                      <option value="medio">🔸 Médio - Edição própria</option>
                      <option value="alto">🔶 Alto - Gerenciamento</option>
                      <option value="admin">🔴 Administrador - Acesso total</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="px-6 py-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descrição do Cargo
                </h2>
                <p className="text-sm text-gray-600">Detalhe as responsabilidades e características do cargo</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700">
                  Descrição e Responsabilidades
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={5}
                  className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                  placeholder="Descreva as responsabilidades, características e requisitos deste cargo..."
                />
                <p className="text-xs text-gray-500">Seja específico sobre as funções e responsabilidades do cargo</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="px-6 py-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status do Cargo
                </h2>
                <p className="text-sm text-gray-600">Configure a disponibilidade do cargo no sistema</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex items-center h-6">
                  <input
                    id="ativo"
                    name="ativo"
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="ativo" className="block text-sm font-semibold text-gray-700">
                    Cargo Ativo no Sistema
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Quando ativado, este cargo ficará disponível para atribuição a usuários
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    formData.ativo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.ativo ? '✓ Ativo' : '○ Inativo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Panel */}
            <div className="px-6 py-8 bg-blue-50">
              <div className="rounded-lg bg-blue-100 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Entenda os Níveis de Acesso</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-500">🔹</span>
                          <div>
                            <p className="font-semibold">Baixo</p>
                            <p className="text-xs">Apenas visualização de dados</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-500">🔸</span>
                          <div>
                            <p className="font-semibold">Médio</p>
                            <p className="text-xs">Edição de dados próprios</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-yellow-500">🔶</span>
                          <div>
                            <p className="font-semibold">Alto</p>
                            <p className="text-xs">Gerenciar outros usuários</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-red-500">🔴</span>
                          <div>
                            <p className="font-semibold">Administrador</p>
                            <p className="text-xs">Acesso completo ao sistema</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                {onCancel && (
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                    onClick={onCancel}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                  </button>
                )}
                
                {!cargo && (
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    onClick={() => {
                      setFormData({
                        nome: "",
                        descricao: "",
                        nivel_acesso: "baixo",
                        ativo: true,
                      });
                      setError(null);
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Limpar Formulário
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cargo ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                      </svg>
                      {cargo ? 'Atualizar Cargo' : 'Cadastrar Cargo'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {cargo 
              ? 'As alterações serão aplicadas imediatamente após a atualização'
              : 'Após cadastrar, o cargo ficará disponível para atribuição na gestão de usuários'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CargosForm;