import './FornecedoresList.css';
import React, { useState, useEffect, useCallback } from 'react';
import './FornecedoresList.css';

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
    cidade: string;
    estado: string;
  };
  status: 'Ativo' | 'Inativo' | 'Pendente';
  avaliacao: number;
  created_at: string;
  updated_at: string;
}

interface FornecedoresListProps {
  onCreate?: () => void;
  onEdit?: (fornecedor: Fornecedor) => void;
  onDelete?: (id: number) => void;
  onView?: (fornecedor: Fornecedor) => void;
}

const FornecedoresList: React.FC<FornecedoresListProps> = ({
  onCreate = () => {},
  onEdit,
  onDelete,
  onView
}) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchFornecedores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Dados fake para demonstração - Fornecedores Sistema Odontológico
      const fornecedoresFake: Fornecedor[] = [
        {
          id: 1,
          nome: "DentalTech Equipamentos",
          razao_social: "DentalTech Equipamentos Odontológicos Ltda",
          cnpj: "12.345.678/0001-90",
          tipo: "Equipamentos",
          categoria: "Raio-X Digital",
          contato: "Carlos Silva",
          telefone: "(11) 3456-7890",
          email: "vendas@dentaltech.com.br",
          endereco: {
            cep: "01310-100",
            logradouro: "Av. Paulista, 1000",
            numero: "1000",
            cidade: "São Paulo",
            estado: "SP"
          },
          status: "Ativo",
          avaliacao: 4.8,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          nome: "Odonto Materiais Premium",
          razao_social: "Odonto Materiais Premium S.A.",
          cnpj: "23.456.789/0001-01",
          tipo: "Materiais",
          categoria: "Resinas Compostas",
          contato: "Ana Costa",
          telefone: "(21) 2345-6789",
          email: "ana@odontomateriais.com.br",
          endereco: {
            cep: "22070-900",
            logradouro: "Rua das Laranjeiras, 500",
            numero: "500",
            cidade: "Rio de Janeiro",
            estado: "RJ"
          },
          status: "Ativo",
          avaliacao: 4.6,
          created_at: "2024-01-20T10:00:00Z",
          updated_at: "2024-01-20T10:00:00Z"
        },
        {
          id: 3,
          nome: "FarmaOdonto Distribuidora",
          razao_social: "FarmaOdonto Distribuidora de Medicamentos Ltda",
          cnpj: "34.567.890/0001-12",
          tipo: "Medicamentos",
          categoria: "Anestésicos",
          contato: "Dr. Roberto Lima",
          telefone: "(31) 3234-5678",
          email: "roberto@farmaodonto.com.br",
          endereco: {
            cep: "30112-000",
            logradouro: "Rua da Bahia, 1200",
            numero: "1200",
            cidade: "Belo Horizonte",
            estado: "MG"
          },
          status: "Ativo",
          avaliacao: 4.7,
          created_at: "2024-02-10T10:00:00Z",
          updated_at: "2024-02-10T10:00:00Z"
        },
        {
          id: 4,
          nome: "CleanDent Serviços",
          razao_social: "CleanDent Serviços de Limpeza e Manutenção Ltda",
          cnpj: "45.678.901/0001-23",
          tipo: "Serviços",
          categoria: "Limpeza Especializada",
          contato: "Maria Santos",
          telefone: "(41) 3345-6789",
          email: "maria@cleandent.com.br",
          endereco: {
            cep: "80020-100",
            logradouro: "Rua XV de Novembro, 800",
            numero: "800",
            cidade: "Curitiba",
            estado: "PR"
          },
          status: "Ativo",
          avaliacao: 4.5,
          created_at: "2024-02-15T10:00:00Z",
          updated_at: "2024-02-15T10:00:00Z"
        },
        {
          id: 5,
          nome: "LabPro Ortodontia",
          razao_social: "LabPro Laboratório de Ortodontia Eireli",
          cnpj: "56.789.012/0001-34",
          tipo: "Laboratório",
          categoria: "Aparelhos Ortodônticos",
          contato: "Tech. João Pedro",
          telefone: "(51) 3456-7890",
          email: "joao@labpro.com.br",
          endereco: {
            cep: "90040-060",
            logradouro: "Rua dos Andradas, 1500",
            numero: "1500",
            cidade: "Porto Alegre",
            estado: "RS"
          },
          status: "Ativo",
          avaliacao: 4.9,
          created_at: "2024-03-01T10:00:00Z",
          updated_at: "2024-03-01T10:00:00Z"
        },
        {
          id: 6,
          nome: "Implante Center",
          razao_social: "Implante Center Importação e Exportação Ltda",
          cnpj: "67.890.123/0001-45",
          tipo: "Equipamentos",
          categoria: "Implantes Dentários",
          contato: "Dra. Patricia Rocha",
          telefone: "(85) 3567-8901",
          email: "patricia@implanteCenter.com.br",
          endereco: {
            cep: "60115-000",
            logradouro: "Av. Beira Mar, 2000",
            numero: "2000",
            cidade: "Fortaleza",
            estado: "CE"
          },
          status: "Pendente",
          avaliacao: 4.3,
          created_at: "2024-03-10T10:00:00Z",
          updated_at: "2024-03-10T10:00:00Z"
        },
        {
          id: 7,
          nome: "Dental Supply Express",
          razao_social: "Dental Supply Express Comércio de Materiais Ltda",
          cnpj: "78.901.234/0001-56",
          tipo: "Materiais",
          categoria: "Instrumentais Cirúrgicos",
          contato: "Fernando Alves",
          telefone: "(62) 3678-9012",
          email: "fernando@dentalsupply.com.br",
          endereco: {
            cep: "74063-010",
            logradouro: "Av. T-4, 1000",
            numero: "1000",
            cidade: "Goiânia",
            estado: "GO"
          },
          status: "Ativo",
          avaliacao: 4.4,
          created_at: "2024-03-20T10:00:00Z",
          updated_at: "2024-03-20T10:00:00Z"
        },
        {
          id: 8,
          nome: "Endodontia Solutions",
          razao_social: "Endodontia Solutions Tecnologia Médica S.A.",
          cnpj: "89.012.345/0001-67",
          tipo: "Equipamentos",
          categoria: "Motores Endodônticos",
          contato: "Dr. Ricardo Mendes",
          telefone: "(47) 3789-0123",
          email: "ricardo@endosolutions.com.br",
          endereco: {
            cep: "89010-100",
            logradouro: "Rua Joinville, 300",
            numero: "300",
            cidade: "Blumenau",
            estado: "SC"
          },
          status: "Inativo",
          avaliacao: 4.1,
          created_at: "2024-04-05T10:00:00Z",
          updated_at: "2024-04-05T10:00:00Z"
        },
        {
          id: 9,
          nome: "PróteseVip Laboratório",
          razao_social: "PróteseVip Laboratório de Prótese Dentária Ltda",
          cnpj: "90.123.456/0001-78",
          tipo: "Laboratório",
          categoria: "Próteses Totais",
          contato: "Técnico Bruno Silva",
          telefone: "(67) 3890-1234",
          email: "bruno@protesevip.com.br",
          endereco: {
            cep: "79002-075",
            logradouro: "Av. Afonso Pena, 5000",
            numero: "5000",
            cidade: "Campo Grande",
            estado: "MS"
          },
          status: "Ativo",
          avaliacao: 4.6,
          created_at: "2024-04-15T10:00:00Z",
          updated_at: "2024-04-15T10:00:00Z"
        },
        {
          id: 10,
          nome: "OralCare Higiene",
          razao_social: "OralCare Produtos de Higiene Bucal Eireli",
          cnpj: "01.234.567/0001-89",
          tipo: "Materiais",
          categoria: "Produtos de Higiene",
          contato: "Luciana Martins",
          telefone: "(84) 3901-2345",
          email: "luciana@oralcare.com.br",
          endereco: {
            cep: "59020-200",
            logradouro: "Av. Rio Branco, 750",
            numero: "750",
            cidade: "Natal",
            estado: "RN"
          },
          status: "Ativo",
          avaliacao: 4.2,
          created_at: "2024-05-01T10:00:00Z",
          updated_at: "2024-05-01T10:00:00Z"
        }
      ];

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Aplicar filtros
      let filteredData = fornecedoresFake;
      
      if (search.trim()) {
        filteredData = filteredData.filter(fornecedor => 
          fornecedor.nome.toLowerCase().includes(search.toLowerCase()) ||
          fornecedor.razao_social.toLowerCase().includes(search.toLowerCase()) ||
          fornecedor.cnpj.includes(search) ||
          fornecedor.categoria.toLowerCase().includes(search.toLowerCase()) ||
          fornecedor.contato.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (filterTipo) {
        filteredData = filteredData.filter(fornecedor => fornecedor.tipo === filterTipo);
      }
      
      if (filterStatus) {
        filteredData = filteredData.filter(fornecedor => fornecedor.status === filterStatus);
      }

      // Simular paginação
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setFornecedores(paginatedData);
      setLastPage(Math.ceil(filteredData.length / perPage));
      setTotal(filteredData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search, filterTipo, filterStatus]);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'status-ativo';
      case 'Inativo': return 'status-inativo';
      case 'Pendente': return 'status-pendente';
      default: return 'status-pendente';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Equipamentos': return '🏥';
      case 'Materiais': return '🦷';
      case 'Medicamentos': return '💊';
      case 'Serviços': return '🔧';
      case 'Laboratório': return '🧪';
      default: return '📦';
    }
  };

  const getAvaliacaoStars = (avaliacao: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= avaliacao) {
        stars.push('⭐');
      } else if (i - 0.5 <= avaliacao) {
        stars.push('⭐');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar dados
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchFornecedores}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fornecedores-container py-6 px-4 sm:px-6 lg:px-8">
      <div className="fornecedores-content max-w-7xl mx-auto">
        {/* Header da Página */}
        <div className="fornecedores-header bg-white rounded-xl shadow-lg border border-gray-200 mb-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="fornecedores-logo w-12 h-12 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">Sistema Odontológico</span>
                    <span className="flag-emoji">🇧🇷</span>
                    <span className="text-sm text-gray-600">Brasil</span>
                  </div>
                  <h1 className="fornecedores-title text-2xl font-bold text-black">Fornecedores ({total})</h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onCreate}
                  className="btn-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:scale-105 hover:shadow-xl text-lg font-bold">
                  <span>➕ Cadastrar Fornecedor</span>
                </button>
              </div>
            </div>
          </div>
          {/* Barra de Busca e Filtros */}
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center flex-1 w-full">
                <div className="flex items-center bg-white border border-gray-300 rounded-md w-full">
                  <div className="pl-3 pr-2 flex items-center">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <form onSubmit={handleSearchSubmit} className="flex-1">
                    <input
                      type="text"
                      className="block w-full py-2 pr-3 border-0 leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0"
                      placeholder="Buscar por nome, CNPJ, categoria ou contato..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSearchSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Buscar
              </button>
              <button 
                onClick={onCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>➕ Cadastrar</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>⚙️ Filtros</span>
              </button>
            </div>
            {/* Painel de Filtros */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Fornecedor
                    </label>
                    <select
                      value={filterTipo}
                      onChange={(e) => setFilterTipo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Todos os tipos</option>
                      <option value="Equipamentos">Equipamentos</option>
                      <option value="Materiais">Materiais</option>
                      <option value="Medicamentos">Medicamentos</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Laboratório">Laboratório</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Todos os status</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterTipo('');
                        setFilterStatus('');
                        setSearch('');
                        setCurrentPage(1);
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Container Principal da Tabela */}
        <div className="table-container bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center">
                      Fornecedor
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      CNPJ
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                    <div className="column-header flex items-center justify-center">
                      Tipo
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-40">
                    <div className="column-header flex items-center">
                      Contato
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Localização
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-28">
                    <div className="column-header flex items-center justify-center">
                      Avaliação
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-24">
                    <div className="column-header flex items-center justify-center">
                      Status
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-32">
                    <div className="column-header flex items-center justify-center">
                      Cadastrado em
                    </div>
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider w-48">
                    <div className="column-header flex items-center justify-center">
                      Ações
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="loading-container">
                        <div className="loading-spinner">
                          <div className="loading-ring"></div>
                          <div className="loading-icon">
                            <span>⏳</span>
                          </div>
                        </div>
                        <p className="loading-text">Carregando fornecedores</p>
                        <p className="loading-subtext">Aguarde um momento...</p>
                      </div>
                    </td>
                  </tr>
                ) : fornecedores.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="empty-container">
                        <div className="empty-icon">
                          <span>🏪</span>
                        </div>
                        <h3 className="empty-title">Nenhum fornecedor encontrado</h3>
                        <p className="empty-description">
                          {search ? 'Nenhum fornecedor corresponde aos critérios de busca' : 'Comece cadastrando o primeiro fornecedor'}
                        </p>
                        {!search && (
                          <button 
                            onClick={onCreate}
                            className="empty-action">
                            Cadastrar Primeiro Fornecedor
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  fornecedores.map((fornecedor, index) => (
                    <tr key={fornecedor.id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {/* Fornecedor */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="fornecedor-name font-medium text-gray-900">{fornecedor.nome}</div>
                          <div className="text-sm text-gray-500">{fornecedor.categoria}</div>
                        </div>
                      </td>

                      {/* CNPJ */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="cnpj-badge">{formatCNPJ(fornecedor.cnpj)}</span>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="tipo-container">
                          <span className="tipo-icon">{getTipoIcon(fornecedor.tipo)}</span>
                          <span className="tipo-text">{fornecedor.tipo}</span>
                        </div>
                      </td>

                      {/* Contato */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fornecedor.contato}</div>
                          <div className="text-sm text-gray-500">{formatPhone(fornecedor.telefone)}</div>
                        </div>
                      </td>

                      {/* Localização */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="localizacao-info">
                          <div className="text-sm text-gray-900">{fornecedor.endereco.cidade}</div>
                          <div className="text-xs text-gray-500">{fornecedor.endereco.estado}</div>
                        </div>
                      </td>

                      {/* Avaliação */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="avaliacao-container">
                          <div className="stars">{getAvaliacaoStars(fornecedor.avaliacao)}</div>
                          <div className="text-xs text-gray-600">{fornecedor.avaliacao.toFixed(1)}</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <span className={`status-badge ${getStatusColor(fornecedor.status)}`}>
                          {fornecedor.status}
                        </span>
                      </td>

                      {/* Data Cadastro */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="date-info">
                          <div className="date-main text-sm text-gray-900">
                            {formatDate(fornecedor.created_at)}
                          </div>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        <div className="action-buttons">
                          <button 
                            onClick={() => onView && onView(fornecedor)}
                            className="action-btn btn-dados" 
                            title="Ver Detalhes">
                            Ver
                          </button>
                          <button 
                            onClick={() => onEdit && onEdit(fornecedor)}
                            className="action-btn btn-editar"
                            title="Editar Fornecedor">
                            Editar
                          </button>
                          <button 
                            onClick={() => onDelete && onDelete(fornecedor.id)}
                            className="action-btn btn-excluir" 
                            title="Excluir Fornecedor">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação */}
        {lastPage > 1 && (
          <div className="pagination-container bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white transition-colors duration-200"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(lastPage, currentPage + 1))}
                  disabled={currentPage === lastPage}
                  className="pagination-btn ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white transition-colors duration-200"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="pagination-info text-sm">
                    Exibindo{' '}
                    <span className="pagination-highlight font-medium">{(currentPage - 1) * perPage + 1}</span>{' '}
                    até{' '}
                    <span className="pagination-highlight font-medium">
                      {Math.min(currentPage * perPage, total)}
                    </span>{' '}
                    de{' '}
                    <span className="pagination-highlight font-medium">{total}</span>{' '}
                    fornecedores
                  </p>
                </div>
                <div>
                  <nav className="pagination-nav relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium transition-colors duration-200"
                    >
                      <span className="sr-only">Anterior</span>
                      <span>←</span>
                    </button>
                    
                    {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-btn relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                            currentPage === page ? 'active' : ''
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(lastPage, currentPage + 1))}
                      disabled={currentPage === lastPage}
                      className="pagination-btn relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium transition-colors duration-200"
                    >
                      <span className="sr-only">Próximo</span>
                      <span>→</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FornecedoresList;