// Utilitários de Validação e Sanitização
// Conformidade com LGPD e boas práticas de segurança

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validação de CPF
export const validateCPF = (cpf: string): ValidationResult => {
  const errors: string[] = [];
  
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    errors.push('CPF deve ter 11 dígitos');
    return { isValid: false, errors };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    errors.push('CPF inválido');
    return { isValid: false, errors };
  }
  
  // Validação do algoritmo do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    errors.push('CPF inválido');
    return { isValid: false, errors };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    errors.push('CPF inválido');
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors: [] };
};

// Validação de CNPJ
export const validateCNPJ = (cnpj: string): ValidationResult => {
  const errors: string[] = [];
  
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    errors.push('CNPJ deve ter 14 dígitos');
    return { isValid: false, errors };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    errors.push('CNPJ inválido');
    return { isValid: false, errors };
  }
  
  // Validação do algoritmo do CNPJ
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) {
    errors.push('CNPJ inválido');
    return { isValid: false, errors };
  }
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) {
    errors.push('CNPJ inválido');
    return { isValid: false, errors };
  }
  
  return { isValid: true, errors: [] };
};

// Validação de email
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('Email é obrigatório');
  } else if (!emailRegex.test(email)) {
    errors.push('Email inválido');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validação de telefone
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phone) {
    errors.push('Telefone é obrigatório');
  } else if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    errors.push('Telefone deve ter 10 ou 11 dígitos');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validação de CEP
export const validateCEP = (cep: string): ValidationResult => {
  const errors: string[] = [];
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (!cep) {
    errors.push('CEP é obrigatório');
  } else if (cleanCEP.length !== 8) {
    errors.push('CEP deve ter 8 dígitos');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validação de nome
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  } else if (name.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
    errors.push('Nome deve conter apenas letras e espaços');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Sanitização de entrada
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limita o tamanho
};

// Validação de data de nascimento
export const validateBirthDate = (date: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!date) {
    errors.push('Data de nascimento é obrigatória');
    return { isValid: false, errors };
  }
  
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (birthDate > today) {
    errors.push('Data de nascimento não pode ser no futuro');
  } else if (age > 120) {
    errors.push('Idade inválida');
  } else if (age < 0) {
    errors.push('Data de nascimento inválida');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validação de formulário completo de paciente
export const validatePatientForm = (patient: any): ValidationResult => {
  const errors: string[] = [];
  
  // Validações obrigatórias
  const nameValidation = validateName(patient.name || patient.nome);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  const phoneValidation = validatePhone(patient.telefone);
  if (!phoneValidation.isValid) {
    errors.push(...phoneValidation.errors);
  }
  
  const emailValidation = validateEmail(patient.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  const cepValidation = validateCEP(patient.cep);
  if (!cepValidation.isValid) {
    errors.push(...cepValidation.errors);
  }
  
  // Validação de CPF/CNPJ baseada no tipo de pessoa
  if (patient.pessoa === 'Física') {
    const cpfValidation = validateCPF(patient.cpf_cnpj || patient.cpfCnpj);
    if (!cpfValidation.isValid) {
      errors.push(...cpfValidation.errors);
    }
  } else if (patient.pessoa === 'Jurídica') {
    const cnpjValidation = validateCNPJ(patient.cpf_cnpj || patient.cpfCnpj);
    if (!cnpjValidation.isValid) {
      errors.push(...cnpjValidation.errors);
    }
  }
  
  // Validação de data de nascimento
  const birthDateValidation = validateBirthDate(patient.data_nascimento || patient.nascimento);
  if (!birthDateValidation.isValid) {
    errors.push(...birthDateValidation.errors);
  }
  
  return { isValid: errors.length === 0, errors };
};
