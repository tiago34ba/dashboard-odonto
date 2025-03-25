import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./Sidebar.css";
import { Link } from "react-router-dom";

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
}) => (
  <>
    {menu.isDivider && <MenuDivider />}
    <li>
      <span
        className="menu-item"
        onClick={() => menu.submenus ? toggleMenu(index) : null}
        style={{ cursor: menu.submenus ? "pointer" : "default" }}
      >
        {menu.title === "Dashboard" && <i className="fa fa-home" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Pessoas" && <i className="fa fa-users" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Cadastros" && <i className="fa fa-list-alt" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Agendamentos" && <i className="fa fa-calendar-alt" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Financeiro" && <i className="fa fa-money-bill-alt" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Consultas" && <i className="fa fa-stethoscope" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Horários" && <i className="fa fa-clock" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Minhas Comissões" && <i className="fa fa-briefcase" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Odontogramas" && <i className="fa fa-tooth" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Tratamentos" && <i className="fa fa-medkit" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Orçamentos" && <i className="fa fa-file-invoice-dollar" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Caixas (Aberto)" && <i className="fa fa-cash-register" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Tarefas / Agenda" && <i className="fa fa-tasks" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Anotações" && <i className="fa fa-sticky-note" style={{ marginRight: '8px' }}></i>}
        {menu.title === "Relatórios" && <i className="fa fa-chart-bar" style={{ marginRight: '8px' }}></i>}
        {menu.title}
      </span>
      {isOpen && menu.submenus && <SubmenuList submenus={menu.submenus} />}
    </li>
  </>
);

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
    { title: "Dashboard", path: "/dashboard" },
    { isDivider: true, title: "" },
    {
      title: "Pessoas",
      submenus: [
        { title: "Pacientes", path: "/pessoas/pacientes" },
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