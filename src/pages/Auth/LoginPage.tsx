import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { 
  FaHeart,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaArrowLeft
} from "react-icons/fa";

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 50px 40px;
  width: 100%;
  max-width: 450px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #007bff;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 15px;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const LogoSubtext = styled.p`
  color: #6c757d;
  margin: 5px 0 0 0;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.2rem;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 18px 18px 55px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  height: 60px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
    font-size: 1rem;
  }
`;

const PasswordInput = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1;
  
  &:hover {
    color: #007bff;
  }
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -10px 0 10px 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.9rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #007bff;
  }
`;

const ForgotLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 18px 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 60px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 30px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }
  
  span {
    background: white;
    padding: 0 20px;
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  color: #6c757d;
  
  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  font-size: 0.9rem;
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Login simulado (você substituirá por API real)
      if (formData.email === 'admin@ssait.com' && formData.password === 'admin123') {
        // Salvar token ou dados do usuário (localStorage, context, etc.)
        localStorage.setItem('userToken', 'fake-jwt-token');
        localStorage.setItem('userData', JSON.stringify({
          name: 'Administrador',
          email: formData.email,
          role: 'admin'
        }));

        // Redirecionar para dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Email ou senha incorretos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <BackButton onClick={handleBackToHome}>
          <FaArrowLeft />
        </BackButton>

        <Logo>
          <LogoIcon>
            <FaHeart />
          </LogoIcon>
          <LogoText>SSait Odonto</LogoText>
          <LogoSubtext>Entre em sua conta</LogoSubtext>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{ paddingRight: '50px' }}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordInput>
          </InputGroup>

          <RememberForgot>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
              />
              Lembrar-me
            </CheckboxLabel>
            <ForgotLink to="/esqueci-senha">
              Esqueci minha senha
            </ForgotLink>
          </RememberForgot>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </LoginButton>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <RegisterLink>
          Não tem uma conta? <Link to="/registro">Cadastre-se aqui</Link>
        </RegisterLink>
      </LoginContainer>
    </PageWrapper>
  );
};

export default LoginPage;