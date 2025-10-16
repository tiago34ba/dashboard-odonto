// Utilitários de Criptografia para Dados Sensíveis
// Conformidade com LGPD

import CryptoJS from 'crypto-js';

// Chave de criptografia (deve ser configurada via variável de ambiente)
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production';

// Função para criptografar dados sensíveis - DESABILITADO
export const encryptSensitiveData = (data: string): string => {
  if (!data) return '';
  
  // Retorna os dados sem criptografia
  return data;
  
  /* CÓDIGO ORIGINAL COMENTADO
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Erro ao criptografar dados:', error);
    return data; // Retorna o dado original em caso de erro
  }
  */
};

// Função para descriptografar dados sensíveis - DESABILITADO
export const decryptSensitiveData = (encryptedData: string): string => {
  if (!encryptedData) return '';
  
  // Retorna os dados como estão (sem descriptografia)
  return encryptedData;
  
  /* CÓDIGO ORIGINAL COMENTADO
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erro ao descriptografar dados:', error);
    return encryptedData; // Retorna o dado criptografado em caso de erro
  }
  */
};

// Função para criptografar dados de paciente - DESABILITADO
export const encryptPatientData = (patient: any): any => {
  // Retorna os dados sem criptografar
  return patient;
  
  /* CÓDIGO ORIGINAL COMENTADO
  const sensitiveFields = [
    'cpf_cnpj', 'cpfCnpj', 'cpf_responsavel', 'cpfResponsavel',
    'telefone', 'celular', 'telefone2', 'email', 'rua', 'numero',
    'complemento', 'bairro', 'cidade', 'cep'
  ];
  
  const encryptedPatient = { ...patient };
  
  sensitiveFields.forEach(field => {
    if (encryptedPatient[field]) {
      encryptedPatient[field] = encryptSensitiveData(encryptedPatient[field]);
    }
  });
  
  return encryptedPatient;
  */
};

// Função para descriptografar dados de paciente - DESABILITADO
export const decryptPatientData = (patient: any): any => {
  // Retorna os dados como estão (sem descriptografar)
  return patient;
  
  /* CÓDIGO ORIGINAL COMENTADO
  const sensitiveFields = [
    'cpf_cnpj', 'cpfCnpj', 'cpf_responsavel', 'cpfResponsavel',
    'telefone', 'celular', 'telefone2', 'email', 'rua', 'numero',
    'complemento', 'bairro', 'cidade', 'cep'
  ];
  
  const decryptedPatient = { ...patient };
  
  sensitiveFields.forEach(field => {
    if (decryptedPatient[field]) {
      decryptedPatient[field] = decryptSensitiveData(decryptedPatient[field]);
    }
  });
  
  return decryptedPatient;
  */
};

// Tipos para mascaramento de dados
export type MaskType = 'cpf' | 'cnpj' | 'phone' | 'email' | 'cep' | 'text';

// Função para mascarar dados sensíveis na exibição
export const maskSensitiveData = (data: string, type: MaskType): string => {
  if (!data) return '';
  
  switch (type) {
    case 'cpf':
      return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4');
    case 'cnpj':
      return data.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.***.***/****-$5');
    case 'phone':
      return data.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) ****-$3');
    case 'email':
      const [local, domain] = data.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    case 'cep':
      return data.replace(/(\d{5})(\d{3})/, '$1-***');
    case 'text':
      // Para texto genérico, mascarar parte do meio
      if (data.length <= 3) return data;
      if (data.length <= 6) return data.substring(0, 2) + '***' + data.substring(data.length - 1);
      return data.substring(0, 3) + '***' + data.substring(data.length - 3);
    default:
      return data;
  }
};

// Função para gerar hash de dados (para auditoria)
export const generateDataHash = (data: any): string => {
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  return CryptoJS.SHA256(dataString).toString();
};

// Função para verificar integridade de dados
export const verifyDataIntegrity = (data: any, hash: string): boolean => {
  const currentHash = generateDataHash(data);
  return currentHash === hash;
};
