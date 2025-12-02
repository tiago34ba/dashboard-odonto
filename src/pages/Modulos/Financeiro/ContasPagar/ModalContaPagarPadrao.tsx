import React from "react";
import "./ModalContaPagarPadrao.css";

interface ContaPagarPadrao {
  id?: number;
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
  onSubmit: (conta: ContaPagarPadrao) => void;
  conta?: ContaPagarPadrao | null;
}

const categorias = [
  "Equipamentos", "Materiais", "Medicamentos", "Serviços", "Aluguel", "Energia", "Telefone", "Internet", "Impostos", "Outros"
];
const prioridades = ["Baixa", "Média", "Alta", "Crítica"];
const formasPagamento = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Boleto", "Transferência", "Pix", "Cheque", "Outro"];
const statusList = ["Pendente", "Vencido", "Pago", "Parcial"];

const ModalContaPagarPadrao: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, conta }) => {
  const [formData, setFormData] = React.useState<ContaPagarPadrao>(
    conta || {
      descricao: "",
      fornecedor: "",
      categoria: "Outros",
      valor_original: 0,
      valor_pago: 0,
      valor_pendente: 0,
      data_vencimento: "",
      data_pagamento: "",
      status: "Pendente",
      prioridade: "Média",
      forma_pagamento: "Dinheiro",
      observacoes: ""
    }
  );

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name.includes("valor") ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Cadastro de Conta a Pagar</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Descrição *</label>
              <input name="descricao" value={formData.descricao} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Fornecedor *</label>
              <input name="fornecedor" value={formData.fornecedor} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Categoria *</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} required>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Prioridade *</label>
              <select name="prioridade" value={formData.prioridade} onChange={handleChange} required>
                {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Valor Original *</label>
              <input type="number" name="valor_original" value={formData.valor_original} onChange={handleChange} required min={0} step={0.01} />
            </div>
            <div className="form-field">
              <label>Valor Pago</label>
              <input type="number" name="valor_pago" value={formData.valor_pago || 0} onChange={handleChange} min={0} step={0.01} />
            </div>
            <div className="form-field">
              <label>Valor Pendente</label>
              <input type="number" name="valor_pendente" value={formData.valor_pendente || 0} onChange={handleChange} min={0} step={0.01} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Data de Vencimento *</label>
              <input type="date" name="data_vencimento" value={formData.data_vencimento} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Data de Pagamento</label>
              <input type="date" name="data_pagamento" value={formData.data_pagamento || ""} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                {statusList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Forma de Pagamento</label>
              <select name="forma_pagamento" value={formData.forma_pagamento} onChange={handleChange}>
                {formasPagamento.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field" style={{flex: 1}}>
              <label>Observações</label>
              <textarea name="observacoes" value={formData.observacoes || ""} onChange={handleChange} rows={2} />
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="btn-primary">Salvar Conta</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalContaPagarPadrao;
