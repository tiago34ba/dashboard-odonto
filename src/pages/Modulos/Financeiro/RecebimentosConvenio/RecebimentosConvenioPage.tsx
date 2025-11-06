import React, { useState } from 'react';
import '../FinanceiroDashboard.css';
import './RecebimentosConvenioPage.css';

const RecebimentosConvenioPage: React.FC = () => {
  const [dataInicio, setDataInicio] = useState('01/11/2025');
  const [dataFim, setDataFim] = useState('30/11/2025');
  const [showModal, setShowModal] = useState(true); // Modal abre automaticamente
  
  // Estados do modal
  const [modalData, setModalData] = useState({
    dataInicial: '05/11/2025',
    dataFinal: '05/11/2025',
    convenio: 'Unimed',
    pagamento: 'Dinheiro',
    valor: '',
    observacoes: ''
  });

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(1).replace('.', ',')}`;
  };

  const handleCreateRecebimento = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLancar = () => {
    console.log('Lançar recebimento:', modalData);
    // Aqui você processaria o lançamento
    setShowModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setModalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRelatorio = () => {
    console.log('Gerar relatório');
  };

  return (
    <div className="financeiro-dashboard-new">
      {/* Header com controles */}
      <div className="dashboard-header-new">
        <div className="header-top">
          <button 
            onClick={handleCreateRecebimento}
            className="btn-adicionar-conta"
          >
            + Adicionar Recebimento
          </button>
          
          <div className="filtros-data">
            <input
              type="text"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="input-data"
              placeholder="Data início"
            />
            <input
              type="text"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="input-data"
              placeholder="Data fim"
            />
            <button 
              onClick={handleRelatorio}
              className="btn-relatorio"
            >
              📊
            </button>
          </div>
        </div>

        {/* Cards de Status */}
        <div className="cards-status">
          <div className="card-status vencidas">
            <div className="card-icon">💥</div>
            <div className="card-content">
              <div className="card-label">Vencidas</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status vence-hoje">
            <div className="card-icon">⏰</div>
            <div className="card-content">
              <div className="card-label">Vence Hoje</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status vence-amanha">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <div className="card-label">Vence Amanhã</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status recebidas">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-label">Recebidas</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status total">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-label">Total</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>

          <div className="card-status todas-pendentes">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <div className="card-label">Todas Pendentes</div>
              <div className="card-value">{formatCurrency(0.0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="dashboard-content">
        <p className="content-placeholder">
          Recebimentos por Convênio
        </p>
      </div>

      {/* Modal Lançar Recebimento */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Lançar Recebimento</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Data Inicial</label>
                  <input
                    type="text"
                    value={modalData.dataInicial}
                    onChange={(e) => handleInputChange('dataInicial', e.target.value)}
                    className="form-input"
                    placeholder="05/11/2025"
                  />
                </div>

                <div className="form-group">
                  <label>Data Final</label>
                  <input
                    type="text"
                    value={modalData.dataFinal}
                    onChange={(e) => handleInputChange('dataFinal', e.target.value)}
                    className="form-input"
                    placeholder="05/11/2025"
                  />
                </div>

                <div className="form-group">
                  <label>Convênio</label>
                  <select
                    value={modalData.convenio}
                    onChange={(e) => handleInputChange('convenio', e.target.value)}
                    className="form-select"
                  >
                    <option value="Unimed">Unimed</option>
                    <option value="Bradesco Saúde">Bradesco Saúde</option>
                    <option value="SulAmérica">SulAmérica</option>
                    <option value="Amil">Amil</option>
                    <option value="NotreDame">NotreDame</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pagamento</label>
                  <select
                    value={modalData.pagamento}
                    onChange={(e) => handleInputChange('pagamento', e.target.value)}
                    className="form-select"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="PIX">PIX</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="text"
                    value={modalData.valor}
                    onChange={(e) => handleInputChange('valor', e.target.value)}
                    className="form-input"
                    placeholder="0,00"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Observações</label>
                  <textarea
                    value={modalData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    className="form-textarea"
                    placeholder="Digite observações..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-lancar"
                onClick={handleLancar}
              >
                Lançar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecebimentosConvenioPage;