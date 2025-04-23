import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Sidebar.css";
import { Link, useNavigate } from "react-router-dom";

// Interfaces para menus e submenus
interface Submenu {
  title: string;
  path: string; // Adicione a propriedade path
}

interface Menu {
  title: string;
  submenus?: Submenu[];
  isDivider?: boolean;
  path?: string; // Adicione a propriedade path para menus principais
}

// Componente para o separador de menu
const MenuDivider: React.FC = () => <div className="menu-divider"></div>;

// Componente para um item de menu
const MenuItem: React.FC<{ menu: Menu; index: number; isOpen: boolean; toggleMenu: (index: number) => void }> = ({
  menu,
  index,
  isOpen,
  toggleMenu,
}) => {
  const navigate = useNavigate();

  // Mapeamento de ícones para cada menu
  const menuIcons: { [key: string]: string } = {
    Dashboard: "fa-home",
    Pessoas: "fa-users",
    Cadastros: "fa-folder",
    Agendamentos: "fa-calendar-alt",
    Financeiro: "fa-dollar-sign",
    Consultas: "fa-stethoscope",
    Horários: "fa-clock",
    "Minhas Comissões": "fa-chart-line",
    Odontogramas: "fa-tooth",
    Tratamentos: "fa-briefcase-medical",
    Orçamentos: "fa-file-invoice-dollar",
    "Caixas (Aberto)": "fa-cash-register",
    "Tarefas / Agenda": "fa-tasks",
    Anotações: "fa-sticky-note",
    Relatórios: "fa-chart-pie",
  };

  return (
    <>
      {menu.isDivider && <MenuDivider />}
      <li>
        {menu.title === "Dashboard" ? (
          <span
            className="menu-item"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <i className={`fa ${menuIcons[menu.title]}`} style={{ marginRight: "8px" }}></i>
            {menu.title}
          </span>
        ) : (
          <span
            className="menu-item"
            onClick={() => (menu.submenus ? toggleMenu(index) : null)}
            style={{ cursor: menu.submenus ? "pointer" : "default" }}
          >
            <i className={`fa ${menuIcons[menu.title]}`} style={{ marginRight: "8px" }}></i>
            {menu.title}
          </span>
        )}
        {isOpen && menu.submenus && <SubmenuList submenus={menu.submenus} />}
      </li>
    </>
  );
};

// Componente para a lista de submenus
const SubmenuList: React.FC<{ submenus: Submenu[] }> = ({ submenus }) => (
  <ul className="submenu">
    {submenus.map((submenu, idx) => (
      <li key={idx}><Link to={submenu.path}>{submenu.title}</Link></li>
    ))}
  </ul>
);

// Componente principal Sidebar
const Sidebar: React.FC = () => {
  const menus: Menu[] = [
    { title: "Dashboard", path: "/" }, // Altere o path para "/"
    { isDivider: true, title: "" },
    {
      title: "Pessoas",
      submenus: [
        { title: "Pacientes", path: "/pessoas/pacientes/patientsPage" },
        { title: "Funcionários", path: "/pessoas/funcionarios" },
        { title: "Úsuarios", path: "/pessoas/usuarios" },
        { title: "Fornecedores", path: "/pessoas/fornecedores" },
      ],
    },
    {
      title: "Cadastros",
      submenus: [
        { title: "Procedimentos", path: "/cadastros/procedimentos" },
        { title: "Convênios", path: "/cadastros/convenios" },
        { title: "Itens Anamnese", path: "/cadastros/itens-anamnese" },
        { title: "Grupos Anamnese", path: "/cadastros/grupos-anamnese" },
        { title: "formas_pgto", path: "/cadastros/formas-pgto" },
        { title: "frequencias", path: "/cadastros/frequencias" },
        { title: "cargos", path: "/cadastros/cargos" },
        { title: "grupo_acessos", path: "/cadastros/grupo-acessos" },
        { title: "acessos", path: "/cadastros/acessos" },
      ],
    },
    {
      title: "Agendamentos",
      submenus: [
        { title: "Agendados", path: "/agendamentos/agendados" },
        { title: "Relatório de Agendamentos", path: "/agendamentos/relatorio-agendamentos" },
        { title: "Relatório de Procedimentos", path: "/agendamentos/relatorio-procedimentos" },
      ],
    },
    {
      title: "Financeiro",
      submenus: [
        { title: "Contas a Pagar", path: "/financeiro/contas-a-pagar" },
        { title: "Contas a Receber", path: "/financeiro/contas-a-receber" },
        { title: "Recebimentos Convênio", path: "/financeiro/recebimentos-convenio" },
        { title: "Comissões", path: "/financeiro/comissoes" },
      ],
    },
    { isDivider: true, title: "" },

    { title: "Consultas", path: "/consultas" },
    { title: "Horários", path: "/horarios" },
    { title: "Minhas Comissões", path: "/minhas-comissoes" },
    { isDivider: true, title: "" },
    { title: "Odontogramas", path: "/odontogramas" },
    { title: "Tratamentos", path: "/tratamentos" },
    { title: "Orçamentos", path: "/orcamentos" },
    { isDivider: true, title: "" },
    { title: "Caixas (Aberto)", path: "/caixas-aberto" },
    { title: "Tarefas / Agenda", path: "/tarefas-agenda" },
    { title: "Anotações", path: "/anotacoes" },
    { isDivider: true, title: "" },

    {
      title: "Relatórios",
      submenus: [
        { title: "Relatório Financeiro", path: "/relatorios/relatorio-financeiro" },
        { title: "Relatório Sintético Despesas", path: "/relatorios/relatorio-sintetico-despesas" },
        { title: "Relatório Sintético Receber", path: "/relatorios/relatorio-sintetico-receber" },
        { title: "Relatório Balanço Anual", path: "/relatorios/relatorio-balanco-anual" },
        { title: "Relatório Inadimplementes", path: "/relatorios/relatorio-inadimplementes" },
      ],
      
    },
  
    // ... (restante dos menus)
  ];

  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleMenu = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };
  return (
    <div className="sidebar">
    <ul>
      {menus.map((menu, index) => (
        <MenuItem
          key={index}
          menu={menu}
          index={index}
          isOpen={openIndexes.includes(index)}
          toggleMenu={toggleMenu}
        />
      ))}
    </ul>
  </div>
  );
};

export default Sidebar;