// Configurações de Segurança
// Centraliza todas as configurações de segurança do aplicativo

export const SECURITY_CONFIG = {
  // Configurações de API
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:8000/api',
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    ENABLE_HTTPS: process.env.REACT_APP_ENABLE_HTTPS === 'true',
    ALLOWED_ORIGINS: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['https://localhost:3000'],
  },

  // Configurações de Criptografia - DESABILITADO
  ENCRYPTION: {
    KEY: process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production',
    ALGORITHM: 'AES',
    SENSITIVE_FIELDS: [
      'cpf_cnpj', 'cpfCnpj', 'cpf_responsavel', 'cpfResponsavel',
      'telefone', 'celular', 'telefone2', 'email', 'rua', 'numero',
      'complemento', 'bairro', 'cidade', 'cep'
    ],
    ENABLED: false // Criptografia desabilitada
  },

  // Configurações de Validação
  VALIDATION: {
    MAX_NAME_LENGTH: 100,
    MAX_EMAIL_LENGTH: 255,
    MAX_PHONE_LENGTH: 15,
    MAX_CEP_LENGTH: 8,
    MAX_TEXT_LENGTH: 1000,
    MIN_NAME_LENGTH: 2
  },

  // Configurações de Sanitização
  SANITIZATION: {
    ALLOWED_HTML_TAGS: ['b', 'i', 'em', 'strong'],
    MAX_INPUT_LENGTH: 1000,
    REMOVE_SCRIPTS: true,
    REMOVE_EVENT_HANDLERS: true
  },

  // Configurações de Sessão
  SESSION: {
    TOKEN_KEY: 'auth_token',
    COOKIE_HTTP_ONLY: true,
    COOKIE_SECURE: process.env.NODE_ENV === 'production',
    COOKIE_SAME_SITE: 'strict' as const,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  },

  // Configurações de Logs
  LOGGING: {
    ENABLE_DEBUG: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    ENABLE_AUDIT_LOG: true,
    SENSITIVE_DATA_MASKING: true
  },

  // Configurações de Rate Limiting
  RATE_LIMITING: {
    ENABLED: true,
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_REQUESTS_PER_HOUR: 1000,
    BLOCK_DURATION: 15 * 60 * 1000 // 15 minutos
  },

  // Configurações de CORS
  CORS: {
    ALLOWED_ORIGINS: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['https://localhost:3000'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    CREDENTIALS: true
  },

  // Configurações de Headers de Segurança
  SECURITY_HEADERS: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },

  // Configurações de LGPD
  LGPD: {
    CONSENT_REQUIRED: true,
    DATA_RETENTION_DAYS: 365,
    AUDIT_LOG_RETENTION_DAYS: 2555, // 7 anos
    CONSENT_EXPIRY_DAYS: 365,
    ENABLE_DATA_EXPORT: true,
    ENABLE_DATA_DELETION: true
  }
};

// Função para verificar se estamos em ambiente de produção
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Função para verificar se estamos em ambiente de desenvolvimento
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Função para obter configuração de API baseada no ambiente
export const getApiConfig = () => {
  return {
    baseURL: SECURITY_CONFIG.API.BASE_URL,
    timeout: SECURITY_CONFIG.API.TIMEOUT,
    withCredentials: SECURITY_CONFIG.SESSION.COOKIE_HTTP_ONLY,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
};

// Função para validar origem permitida
export const isAllowedOrigin = (origin: string): boolean => {
  return SECURITY_CONFIG.CORS.ALLOWED_ORIGINS.includes(origin);
};

// Função para obter configuração de criptografia
export const getEncryptionConfig = () => {
  return {
    key: SECURITY_CONFIG.ENCRYPTION.KEY,
    algorithm: SECURITY_CONFIG.ENCRYPTION.ALGORITHM,
    sensitiveFields: SECURITY_CONFIG.ENCRYPTION.SENSITIVE_FIELDS
  };
};
