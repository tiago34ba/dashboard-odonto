import React, { useState, useEffect } from 'react';

interface ContaPagar {
  id?: number;
  codigo?: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
  valor_original: number;
  valor_pago?: number;
  valor_pendente?: number;
  data_vencimento: string;
  data_pagamento?: string;
  status?: string;
  prioridade: string;
  forma_pagamento?: string;
  observacoes?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  conta?: ContaPagar | null;
  onSubmit: (conta: ContaPagar) => void;
}

const ModalContaPagar: React.FC<ModalProps> = ({ isOpen, onClose, conta, onSubmit }) => {
  const [formData, setFormData] = useState<ContaPagar>({
    descricao: '',
    fornecedor: '',
    categoria: 'Outros',
    valor_original: 0,
    prioridade: 'Média',
    data_vencimento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && conta) {
      setFormData({
        ...conta,
        data_vencimento: conta.data_vencimento?.split('T')[0] || '',
        data_pagamento: conta.data_pagamento?.split('T')[0] || '',
      });
    } else if (isOpen) {
      setFormData({
        descricao: '',
        fornecedor: '',
        categoria: 'Outros',
        valor_original: 0,
        prioridade: 'Média',
        data_vencimento: '',
      });
    }
    setErrors({});
  }, [conta, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.descricao?.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.fornecedor?.trim()) newErrors.fornecedor = 'Fornecedor é obrigatório';
    if (!formData.valor_original || formData.valor_original <= 0) newErrors.valor_original = 'Valor deve ser maior que zero';
    if (!formData.data_vencimento) newErrors.data_vencimento = 'Data de vencimento é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...formData,
        valor_original: Number(formData.valor_original),
        valor_pago: Number(formData.valor_pago || 0),
        valor_pendente: Number(formData.valor_original) - Number(formData.valor_pago || 0),
      };

      const url = conta?.id 
        ? `http://localhost:8000/api/financeiro/contas-pagar/${conta.id}`
        : 'http://localhost:8000/api/financeiro/contas-pagar';
      
      const response = await fetch(url, {
        method: conta?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);
      const result = await response.json();
      onSubmit(result.data || result);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar a conta. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          style={{
            padding: '24px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            {conta?.id ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px', maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
            
            {/* Informações Básicas */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                Informações Básicas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Código</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo || ''}
                    onChange={handleInputChange}
                    placeholder="Código da conta"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>
                    Descrição <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descrição da conta"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                  {errors.descricao && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '6px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                      ⚠ {errors.descricao}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>
                    Fornecedor <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="fornecedor"
                    value={formData.fornecedor}
                    onChange={handleInputChange}
                    placeholder="Nome do fornecedor"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                  {errors.fornecedor && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '6px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                      ⚠ {errors.fornecedor}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Categoria</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Materiais">Materiais</option>
                    <option value="Medicamentos">Medicamentos</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Energia">Energia</option>
                    <option value="Telefone">Telefone</option>
                    <option value="Internet">Internet</option>
                    <option value="Impostos">Impostos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Valores Financeiros */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                Valores Financeiros
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>
                    Valor Original <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="valor_original"
                    value={formData.valor_original}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                  {errors.valor_original && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '6px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                      ⚠ {errors.valor_original}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Valor Pago</label>
                  <input
                    type="number"
                    name="valor_pago"
                    value={formData.valor_pago || ''}
                    onChange={handleInputChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '15px', padding: '12px 16px', background: '#f3f4f6', borderRadius: '10px' }}>
                <strong style={{ color: '#374151' }}>
                  Valor Pendente: R$ {((formData.valor_original || 0) - (formData.valor_pago || 0)).toFixed(2).replace('.', ',')}
                </strong>
              </div>
            </div>

            {/* Datas */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                Datas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>
                    Data de Vencimento <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="data_vencimento"
                    value={formData.data_vencimento}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                  {errors.data_vencimento && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '6px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                      ⚠ {errors.data_vencimento}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Data de Pagamento</label>
                  <input
                    type="date"
                    name="data_pagamento"
                    value={formData.data_pagamento || ''}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status e Configurações */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 600, color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                Status e Configurações
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Status</label>
                  <select
                    name="status"
                    value={formData.status || 'Pendente'}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Pago">Pago</option>
                    <option value="Parcial">Parcial</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Prioridade</label>
                  <select
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Forma de Pagamento</label>
                <input
                  type="text"
                  name="forma_pagamento"
                  value={formData.forma_pagamento || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: PIX, Cartão, Dinheiro, Transferência..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem', display: 'block', marginBottom: '6px' }}>Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes || ''}
                onChange={handleInputChange}
                placeholder="Observações adicionais sobre a conta..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <div style={{
            padding: '20px 32px',
            borderTop: '1px solid #e5e7eb',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
          }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                background: 'white',
                color: '#374151',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                fontWeight: 600,
                minWidth: '120px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                minWidth: '120px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {conta?.id ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalContaPagar;