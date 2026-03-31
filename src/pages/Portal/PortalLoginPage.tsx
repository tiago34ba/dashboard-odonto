import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { FaTooth, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import api from "../../components/api/api";

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
  max-width: 440px;
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
  margin-bottom: 36px;
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  color: #1a6b4a;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin: 6px 0 0;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconLeft = styled.span`
  position: absolute;
  left: 14px;
  color: #adb5bd;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px;
  border: 1.5px solid #dee2e6;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #1a6b4a;
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 1rem;
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
  transition: background 0.2s;
  &:hover { background: #155c3e; }
  &:disabled { background: #adb5bd; cursor: not-allowed; }
`;

const ErrorMsg = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const Footer = styled.p`
  text-align: center;
  margin: 20px 0 0;
  font-size: 0.9rem;
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
const PortalLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedLogin = login.trim();

      if (!normalizedLogin) {
        setError("Informe usuario ou e-mail.");
        return;
      }

      const response = await api.post("/login", {
        login: normalizedLogin,
        password,
        remember: false,
        device_name: "dashboard-odonto-web",
      });

      const token = response?.data?.token;
      const user = response?.data?.user;
      const tipoUsuario = (user?.tipo || "").toString().toLowerCase();
      const grupoAcessoNome = (user?.grupo_acesso_nome || user?.grupoAcesso?.nome || "")
        .toString()
        .toLowerCase();
      const isPaciente = tipoUsuario === "paciente" || grupoAcessoNome.includes("paciente");

      if (!token || !user) {
        throw new Error("Resposta de login invalida");
      }

      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userToken");
      sessionStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userData", JSON.stringify(user));

      if (!isPaciente) {
        sessionStorage.removeItem("patient_token");
        sessionStorage.removeItem("patient_user");
        setError("Esta conta nao possui acesso ao Portal do Paciente.");
        return;
      }

      sessionStorage.setItem("patient_token", token);
      sessionStorage.setItem("patient_user", JSON.stringify(user));
      navigate("/portal/agendar");
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? "Erro ao fazer login. Tente novamente.");
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
          <Title>Portal do Paciente</Title>
          <Subtitle>Acesse sua área exclusiva</Subtitle>
        </Logo>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Usuario ou e-mail</Label>
            <InputWrapper>
              <IconLeft><FaEnvelope /></IconLeft>
              <Input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Seu usuario ou e-mail"
                required
                autoComplete="username"
              />
            </InputWrapper>
          </Field>

          <Field>
            <Label>Senha</Label>
            <InputWrapper>
              <IconLeft><FaLock /></IconLeft>
              <Input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <TogglePassword type="button" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </TogglePassword>
            </InputWrapper>
          </Field>

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </SubmitBtn>
        </Form>

        <Footer>
          Não tem conta?{" "}
          <Link to="/portal/registro">Criar conta gratuita</Link>
        </Footer>
      </Card>
    </PageWrapper>
  );
};

export default PortalLoginPage;
