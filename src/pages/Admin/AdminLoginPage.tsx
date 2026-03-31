import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaArrowLeft, FaEnvelope, FaEye, FaEyeSlash, FaHeart, FaLock } from "react-icons/fa";
import api from "../../components/api/api";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #1877f2 0%, #0b5ed7 100%);
`;

const LoginCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 470px;
  padding: 48px 40px 42px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(7, 31, 77, 0.28);
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 22px;
  left: 22px;
  color: #7b8494;
  font-size: 1.25rem;
  text-decoration: none;

  &:hover {
    color: #0b5ed7;
  }
`;

const LogoWrap = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin-bottom: 18px;
  border-radius: 999px;
  background: rgba(24, 119, 242, 0.12);
  color: #1877f2;
  font-size: 2.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: #23324a;
`;

const Subtitle = styled.p`
  margin: 10px 0 0;
  color: #738197;
  font-size: 1rem;
`;

const ErrorBox = styled.div`
  margin-bottom: 18px;
  padding: 12px 14px;
  border: 1px solid #f3c35d;
  border-radius: 12px;
  background: #fff7dd;
  color: #946200;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
`;

const InputShell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const LeftIcon = styled.span`
  position: absolute;
  left: 15px;
  color: #8b97a8;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  height: 54px;
  border: 1.5px solid #d7deea;
  border-radius: 14px;
  padding: 0 44px 0 44px;
  font-size: 1rem;
  color: #23324a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1877f2;
    box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.12);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #8b97a8;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #1877f2;
  }
`;

const RememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 0.95rem;
  color: #5f6c7b;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #1877f2;
`;

const InlineLink = styled.span`
  color: #1877f2;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  margin-top: 4px;
  height: 54px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #1877f2 0%, #0b5ed7 100%);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(24, 119, 242, 0.22);
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`;

const Footer = styled.p`
  margin: 26px 0 0;
  text-align: center;
  color: #738197;
  font-size: 0.95rem;
`;

const FooterLink = styled(Link)`
  color: #1877f2;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const normalizeUserType = (value?: string): string => (value || "").trim().toLowerCase();

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("userData") || localStorage.getItem("userData");
      const token = sessionStorage.getItem("auth_token");
      const user = raw ? JSON.parse(raw) : null;

      if (token && normalizeUserType(user?.tipo) === "saas_admin") {
        navigate("/admin", { replace: true });
      }
    } catch {
      // noop
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedLogin = login.trim();

      if (!normalizedLogin || !password) {
        throw new Error("Informe usuario e senha.");
      }

      const response = await api.post("/login", {
        login: normalizedLogin,
        password,
        remember,
        device_name: "dashboard-odonto-saas-admin",
      });

      const token = response?.data?.token;
      const user = response?.data?.user;
      const isSaasAdmin = normalizeUserType(user?.tipo) === "saas_admin";

      if (!token || !user) {
        throw new Error("Resposta de login invalida.");
      }

      if (!isSaasAdmin) {
        throw new Error("Esta conta nao possui acesso ao portal SaaS.");
      }

      sessionStorage.setItem("auth_token", token);
      sessionStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.removeItem("userToken");
      sessionStorage.removeItem("patient_token");
      sessionStorage.removeItem("patient_user");

      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Nao foi possivel entrar no portal SaaS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LoginCard>
        <BackLink to="/">
          <FaArrowLeft />
        </BackLink>

        <LogoWrap>
          <LogoIcon>
            <FaHeart />
          </LogoIcon>
          <Title>SSait Odonto SaaS</Title>
          <Subtitle>Entre com sua credencial administrativa</Subtitle>
        </LogoWrap>

        {error ? <ErrorBox>{error}</ErrorBox> : null}

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Usuario</Label>
            <InputShell>
              <LeftIcon>
                <FaEnvelope />
              </LeftIcon>
              <Input
                type="text"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                placeholder="Seu usuario"
                autoComplete="username"
                required
              />
            </InputShell>
          </Field>

          <Field>
            <Label>Senha</Label>
            <InputShell>
              <LeftIcon>
                <FaLock />
              </LeftIcon>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
              />
              <PasswordToggle type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputShell>
          </Field>

          <RememberRow>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Lembrar-me
            </CheckboxLabel>
            <InlineLink>Portal SaaS Admin</InlineLink>
          </RememberRow>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </SubmitButton>
        </Form>

        <Footer>
          Acesse a area criada em <FooterLink to="/admin">/admin</FooterLink>
        </Footer>
      </LoginCard>
    </PageWrapper>
  );
};

export default AdminLoginPage;
