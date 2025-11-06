import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

// Interfaces para menus e submenus
interface Menu {
  title?: string; // Tornar o título opcional
  path?: string;
  submenus?: Menu[];
  isDivider?: boolean;
}

// Componente para o separador de menu
const MenuDivider: React.FC = () => <div className="menu-divider"></div>;

// Componente recursivo para renderizar menus e submenus
const RecursiveMenu: React.FC<{ menu: Menu }> = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mapeamento de ícones para cada menu e submenu
  const menuIcons: { [key: string]: string } = {
    Dashboard: "fa-home",
    Pessoas: "fa-users",
    Pacientes: "fa-user-injured",
    Funcionários: "fa-user-tie",
    Úsuarios: "fa-user-shield",
    Fornecedores: "fa-truck",
    Cadastros: "fa-folder",
    Procedimentos: "fa-tools",
    Convênios: "fa-handshake",
    "Itens Anamnese": "fa-notes-medical",
    "Grupos Anamnese": "fa-layer-group",
    formas_pgto: "fa-credit-card",
    frequencias: "fa-calendar-check",
    Cargos: "fa-briefcase",
    "Grupo de Acessos": "fa-users-cog",
    Acessos: "fa-key",
    Agendamentos: "fa-calendar-alt",
    Agendados: "fa-calendar-day",
    "Relatório de Agendamentos": "fa-file-alt",
    "Relatório de Procedimentos": "fa-file-medical",
    Financeiro: "fa-dollar-sign",
    "Contas a Pagar": "fa-money-bill-wave",
    "Contas a Receber": "fa-money-check-alt",
    "Recebimentos Convênio": "fa-hand-holding-usd",
    Comissões: "fa-chart-line",
    Consultas: "fa-stethoscope",
    Horários: "fa-clock",
    "Minhas Comissões": "fa-chart-bar",
    Odontogramas: "fa-tooth",
    Tratamentos: "fa-briefcase-medical",
    Orçamentos: "fa-file-invoice-dollar",
    "Caixas (Aberto)": "fa-cash-register",
    "Tarefas / Agenda": "fa-tasks",
    Anotações: "fa-sticky-note",
    Relatórios: "fa-chart-pie",
    "Relatório Financeiro": "fa-file-invoice",
    "Relatório Sintético Despesas": "fa-file-excel",
    "Relatório Sintético Receber": "fa-file-contract",
    "Relatório Balanço Anual": "fa-chart-area",
    "Relatório Inadimplementes": "fa-exclamation-circle",
  };

  return (
    <>
      {menu.isDivider && <MenuDivider />}
      {menu.title && ( // Verifica se o menu possui título antes de renderizar
        <li>
          <span
            className="menu-item"
            onClick={() => {
              if (menu.path) {
                navigate(menu.path);
              } else {
                setIsOpen(!isOpen);
              }
            }}
            style={{ cursor: menu.submenus ? "pointer" : "default" }}
          >
            <i className={`fa ${menuIcons[menu.title] || "fa-folder"}`} style={{ marginRight: "8px" }}></i>
            {menu.title}
          </span>
          {isOpen && menu.submenus && (
            <ul className="submenu">
              {menu.submenus.map((submenu, idx) => (
                <RecursiveMenu key={idx} menu={submenu} />
              ))}
            </ul>
          )}
        </li>
      )}
    </>
  );
};

// Componente principal Sidebar
const Sidebar: React.FC = () => {
  const menus: Menu[] = [
    { title: "Dashboard", path: "/dashboard/" },
    { isDivider: true, title: "" },
    {
      title: "Pessoas",
      submenus: [
        { title: "Pacientes", path: "/dashboard/pessoas/pacientes/PatientsPage" },
        { title: "Funcionários", path: "/dashboard/pessoas/funcionarios" },
        { title: "Úsuarios", path: "/dashboard/pessoas/usuarios" },
        { title: "Fornecedores", path: "/dashboard/cadastros/fornecedores" },
      ],
    },
    {
      title: "Cadastros",
      submenus: [
        { title: "Procedimentos", path: "/dashboard/cadastros/procedimentos" },
        { title: "Convênios", path: "/dashboard/cadastros/convenios" },
        { title: "Itens Anamnese", path: "/dashboard/cadastros/itens-anamnese" },
        { title: "Grupos Anamnese", path: "/dashboard/cadastros/grupos-anamnese" },
        { title: "formas_pgto", path: "/dashboard/cadastros/formas-pgto" },
        { title: "frequencias", path: "/dashboard/cadastros/frequencias" },
        { title: "Cargos", path: "/dashboard/cadastros/cargos" },
        { title: "Grupo de Acessos", path: "/dashboard/cadastros/grupo-acessos" },
        { title: "Acessos", path: "/dashboard/cadastros/acessos" },
      ],
    },
    {
      title: "Agendamentos",
      submenus: [
        { title: "Agendados", path: "/dashboard/agendamentos" },
        { title: "Relatório de Agendamentos", path: "/dashboard/agendamentos/relatorio-agendamentos" },
        { title: "Relatório de Procedimentos", path: "/dashboard/agendamentos/relatorio-procedimentos" },
      ],
    },
    {
      title: "Financeiro",
      submenus: [
        { title: "Contas a Pagar", path: "/dashboard/financeiro/contas-pagar" },
        { title: "Contas a Receber", path: "/dashboard/financeiro/contas-receber" },
        { title: "Recebimentos Convênio", path: "/dashboard/financeiro/recebimentos-convenio" },
        { title: "Comissões", path: "/dashboard/financeiro/comissoes" },
        { title: "Consulta", path: "/dashboard/financeiro/consulta" },
      ],
    },
    { isDivider: true, title: "" }, // Divisor abaixo de "Financeiro"
    { title: "Consultas", path: "/dashboard/consultas" },
    { title: "Horários", path: "/dashboard/horarios" },
    { title: "Minhas Comissões", path: "/dashboard/minhas-comissoes" },
    { isDivider: true, title: "" }, // Divisor abaixo de "Minhas Comissões"
    { title: "Odontogramas", path: "/dashboard/odontogramas" },
    { title: "Tratamentos", path: "/dashboard/tratamentos" },
    { title: "Orçamentos", path: "/dashboard/orcamentos" },
    { isDivider: true, title: "" }, // Divisor abaixo de "Orçamentos"
    { title: "Caixas (Aberto)", path: "/dashboard/caixas-aberto" },
    { title: "Tarefas / Agenda", path: "/dashboard/tarefas-agenda" },
    { title: "Anotações", path: "/dashboard/anotacoes" },
    { isDivider: true, title: "" }, // Divisor abaixo de "Anotações"
    {
      title: "Relatórios",
      submenus: [
        { title: "Relatório Financeiro", path: "/dashboard/relatorios/relatorio-financeiro" },
        { title: "Relatório Sintético Despesas", path: "/dashboard/relatorios/relatorio-sintetico-despesas" },
        { title: "Relatório Sintético Receber", path: "/dashboard/relatorios/relatorio-sintetico-receber" },
        { title: "Relatório Balanço Anual", path: "/dashboard/relatorios/relatorio-balanco-anual" },
        { title: "Relatório Inadimplementes", path: "/dashboard/relatorios/relatorio-inadimplementes" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menus.map((menu, index) => (
          <RecursiveMenu key={index} menu={menu} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;