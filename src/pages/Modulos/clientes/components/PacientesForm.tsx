import React, { useState } from "react";
// Update the import path if necessary, or create the file if missing
import { apiService } from "../../../../services/api";
// If the file does not exist, create 'src/services/api.ts' and export 'apiService' from it.

interface PacientesFormProps {
  onPacienteAdicionado?: () => void;
}

const PacientesForm: React.FC<PacientesFormProps> = ({ onPacienteAdicionado }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    idade: "",
    data_nascimento: "",
    responsavel: "",
    cpf_responsavel: "",
    celular: "",
    estado: "",
    sexo: "",
    profissao: "",
    estado_civil: "",
    tipo_sanguineo: "",
    convenio: "",
    pessoa: "",
    cpf_cnpj: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    observacoes: "",
  });
  const [apiDebug, setApiDebug] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mapeia os campos do formulário para os nomes esperados pelo backend
      const payload = {
        ...formData,
        idade: formData.idade ? Number(formData.idade) : undefined,
      };
          const response = await apiService.createPaciente(payload);
          setApiDebug(JSON.stringify(response, null, 2));
          if (response && response.id) {
            alert("Paciente cadastrado com sucesso no MySQL! ID: " + response.id);
            if (onPacienteAdicionado) onPacienteAdicionado();
          } else {
            alert("Paciente cadastrado, mas sem retorno de ID. Verifique o banco.");
            if (onPacienteAdicionado) onPacienteAdicionado();
          }

      setFormData({
        name: "",
        email: "",
        telefone: "",
        idade: "",
        data_nascimento: "",
        responsavel: "",
        cpf_responsavel: "",
        celular: "",
        estado: "",
        sexo: "",
        profissao: "",
        estado_civil: "",
        tipo_sanguineo: "",
        convenio: "",
        pessoa: "",
        cpf_cnpj: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        observacoes: "",
      });
    } catch (error: any) {
      console.error("Erro ao cadastrar paciente:", error);
      setApiDebug(error?.response ? JSON.stringify(error.response.data, null, 2) : String(error));
      alert("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Telefone</label>
        <input
          type="text"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Idade</label>
        <input
          type="number"
          name="idade"
          value={formData.idade}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Data de Nascimento</label>
        <input
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Responsável</label>
        <input
          type="text"
          name="responsavel"
          value={formData.responsavel}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>CPF do Responsável</label>
        <input
          type="text"
          name="cpf_responsavel"
          value={formData.cpf_responsavel}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado</label>
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sexo</label>
        <input
          type="text"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Profissão</label>
        <input
          type="text"
          name="profissao"
          value={formData.profissao}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado Civil</label>
        <input
          type="text"
          name="estado_civil"
          value={formData.estado_civil}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipo Sanguíneo</label>
        <input
          type="text"
          name="tipo_sanguineo"
          value={formData.tipo_sanguineo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Convênio</label>
        <input
          type="text"
          name="convenio"
          value={formData.convenio}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Pessoa (Física/Jurídica)</label>
        <input
          type="text"
          name="pessoa"
          value={formData.pessoa}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>CPF/CNPJ</label>
        <input
          type="text"
          name="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>CEP</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Rua</label>
        <input
          type="text"
          name="rua"
          value={formData.rua}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Número</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Complemento</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bairro</label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cidade</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Observações</label>
        <input
          type="text"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Salvar</button>
    </form>
    {apiDebug && (
      <div style={{marginTop: 16, background: '#f3f3f3', padding: 12, borderRadius: 8}}>
        <strong>Resposta da API (debug):</strong>
        <pre style={{fontSize: 12, color: '#333'}}>{apiDebug}</pre>
      </div>
    )}
    </>
  );
};
export default PacientesForm;