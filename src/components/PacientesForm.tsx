import React, { useState } from "react";
import { storeData } from "./api/api"; // Importa a função storeData

const PacientesForm = () => {
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chama a função storeData para enviar os dados para a API Laravel
      const response = await storeData("pessoas/pacientes", formData);
      alert("Paciente cadastrado com sucesso!");
      console.log("Resposta da API:", response);

      // Limpa o formulário após o envio
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
      });
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
    }
  };

  return (
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
      <button type="submit">Salvar</button>
    </form>
  );
};

export default PacientesForm;