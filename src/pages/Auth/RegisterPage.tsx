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
  FaArrowLeft,
  FaPhone,
  FaBuilding,
  FaUserMd
} from "react-icons/fa";

const PageWrapper = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const RegisterContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 50px 40px;
  width: 100%;
  max-width: 500px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
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
    color: #28a745;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  color: #28a745;
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
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
    font-size: 1rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 18px 18px 18px 55px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
  height: 60px;
  
  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
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
    color: #28a745;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 10px 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #6c757d;
  font-size: 0.9rem;
  cursor: pointer;
  line-height: 1.4;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #28a745;
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  a {
    color: #28a745;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 18px 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 25px 0;
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

const LoginLink = styled.div`
  text-align: center;
  color: #6c757d;
  
  a {
    color: #28a745;
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

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  font-size: 0.9rem;
`;

const PasswordStrength = styled.div<{ strength: number }>`
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.strength}%;
    background: ${props => 
      props.strength < 33 ? '#dc3545' :
      props.strength < 66 ? '#ffc107' : '#28a745'
    };
    transition: all 0.3s ease;
  }
`;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    clinicName: '',
    specialty: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar mensagens quando usuário começar a digitar
    if (error) setError('');
    if (success) setSuccess('');
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validações
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.clinicName || !formData.password || 
          !formData.confirmPassword) {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      if (!formData.acceptTerms) {
        throw new Error('Você deve aceitar os termos de uso');
      }

      if (!formData.acceptPrivacy) {
        throw new Error('Você deve aceitar a política de privacidade');
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Registro simulado (você substituirá por API real)
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <PageWrapper>
      <RegisterContainer>
        <BackButton onClick={handleBackToHome}>
          <FaArrowLeft />
        </BackButton>

        <Logo>
          <LogoIcon>
            <FaHeart />
          </LogoIcon>
          <LogoText>SSait Odonto</LogoText>
          <LogoSubtext>Crie sua conta</LogoSubtext>
        </Logo>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                name="firstName"
                placeholder="Nome *"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                name="lastName"
                placeholder="Sobrenome *"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
          </FormRow>

          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaPhone />
            </InputIcon>
            <Input
              type="tel"
              name="phone"
              placeholder="Telefone *"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaBuilding />
            </InputIcon>
            <Input
              type="text"
              name="clinicName"
              placeholder="Nome da Clínica/Consultório *"
              value={formData.clinicName}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaUserMd />
            </InputIcon>
            <Select
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
            >
              <option value="">Selecione sua especialidade</option>
              <option value="clinico-geral">Clínico Geral</option>
              <option value="ortodontia">Ortodontia</option>
              <option value="endodontia">Endodontia</option>
              <option value="periodontia">Periodontia</option>
              <option value="cirurgia">Cirurgia Oral</option>
              <option value="protese">Prótese Dentária</option>
              <option value="implantodontia">Implantodontia</option>
              <option value="odontopediatria">Odontopediatria</option>
              <option value="estetica">Odontologia Estética</option>
              <option value="outras">Outras</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <PasswordInput>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Senha *"
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
            {formData.password && (
              <PasswordStrength strength={passwordStrength} />
            )}
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <PasswordInput>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirmar Senha *"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{ paddingRight: '50px' }}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordInput>
          </InputGroup>

          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                required
              />
              <span>
                Eu aceito os <a href="/termos" target="_blank">Termos de Uso</a> do SSait Odonto
              </span>
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                name="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onChange={handleInputChange}
                required
              />
              <span>
                Eu aceito a <a href="/privacidade" target="_blank">Política de Privacidade</a> e autorizo o uso dos meus dados
              </span>
            </CheckboxLabel>
          </CheckboxGroup>

          <RegisterButton type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </RegisterButton>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <LoginLink>
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </LoginLink>
      </RegisterContainer>
    </PageWrapper>
  );
};

export default RegisterPage;