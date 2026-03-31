import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaTooth, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaArrowLeft } from "react-icons/fa";
import portalApi from "./portalApi";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const PageWrapper = styled.div`
  background: linear-gradient(135deg, #1a6b4a 0%, #0d4a32 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 50px 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #6c757d;
  font-size: 1.2rem;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: #1a6b4a; }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LogoIcon = styled.div`
  font-size: 2.6rem;
  color: #1a6b4a;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin: 6px 0 0;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.83rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconLeft = styled.span`
  position: absolute;
  left: 13px;
  color: #adb5bd;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 38px;
  border: 1.5px solid #dee2e6;
  border-radius: 10px;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { outline: none; border-color: #1a6b4a; }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 13px;
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  &:hover { color: #1a6b4a; }
`;

const SubmitBtn = styled.button`
  padding: 14px;
  background: #1a6b4a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
  &:hover { background: #155c3e; }
  &:disabled { background: #adb5bd; cursor: not-allowed; }
`;

const ErrorMsg = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
`;

const Footer = styled.p`
  text-align: center;
  margin: 18px 0 0;
  font-size: 0.88rem;
  color: #6c757d;
  a {
    color: #1a6b4a;
    font-weight: 600;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const PortalRegistroPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    telefone: "",
    password: "",
    password_confirmation: "",
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    if (form.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await portalApi.post("/portal/register", form);
      sessionStorage.setItem("patient_token", data.token);
      sessionStorage.setItem("patient_user", JSON.stringify(data.user));
      navigate("/portal/meus-agendamentos");
    } catch (err: any) {
      const msg = err.response?.data?.message
        ?? Object.values(err.response?.data?.errors ?? {})[0]
        ?? "Erro ao criar conta.";
      setError(Array.isArray(msg) ? msg[0] : String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <BackLink to="/portal"><FaArrowLeft /></BackLink>
        <Logo>
          <LogoIcon><FaTooth /></LogoIcon>
          <Title>Criar Conta</Title>
          <Subtitle>Portal do Paciente — cadastro gratuito</Subtitle>
        </Logo>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Nome completo *</Label>
            <InputWrapper>
              <IconLeft><FaUser /></IconLeft>
              <Input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Seu nome completo"
                required
                autoComplete="name"
              />
            </InputWrapper>
          </Field>

          <Row>
            <Field>
              <Label>E-mail *</Label>
              <InputWrapper>
                <IconLeft><FaEnvelope /></IconLeft>
                <Input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </InputWrapper>
            </Field>
            <Field>
              <Label>Telefone</Label>
              <InputWrapper>
                <IconLeft><FaPhone /></IconLeft>
                <Input
                  type="tel"
                  value={form.telefone}
                  onChange={handleChange("telefone")}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                />
              </InputWrapper>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Senha *</Label>
              <InputWrapper>
                <IconLeft><FaLock /></IconLeft>
                <Input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Mín. 8 caracteres"
                  required
                  autoComplete="new-password"
                />
                <TogglePassword type="button" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
              </InputWrapper>
            </Field>
            <Field>
              <Label>Confirmar Senha *</Label>
              <InputWrapper>
                <IconLeft><FaLock /></IconLeft>
                <Input
                  type={showConf ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={handleChange("password_confirmation")}
                  placeholder="Repita a senha"
                  required
                  autoComplete="new-password"
                />
                <TogglePassword type="button" onClick={() => setShowConf(!showConf)}>
                  {showConf ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
              </InputWrapper>
            </Field>
          </Row>

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar Conta"}
          </SubmitBtn>
        </Form>

        <Footer>
          Já tem conta? <Link to="/portal/login">Entrar</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
};

export default PortalRegistroPage;
