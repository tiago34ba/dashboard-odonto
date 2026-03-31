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
  requiredPermissions?: string[];
  requiredAccessGroups?: string[];
}

interface StoredUser {
  permissoes?: string[];
  permissions?: string[];
  grupo_acesso_nome?: string;
  grupo_acesso?: {
    nome?: string;
  };
}

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const hasAnyAccessGroup = (user: StoredUser | null, requiredAccessGroups?: string[]): boolean => {
  if (!requiredAccessGroups || requiredAccessGroups.length === 0) return false;

  const userGroup = user?.grupo_acesso_nome || user?.grupo_acesso?.nome;
  if (!userGroup) return false;

  const normalizedUserGroup = normalize(userGroup);
  return requiredAccessGroups.some((group) => normalize(group) === normalizedUserGroup);
};

const parseUserData = (): StoredUser | null => {
  try {
    const raw = sessionStorage.getItem("userData") || localStorage.getItem("userData");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const hasAnyPermission = (user: StoredUser | null, requiredPermissions?: string[]): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  const perms = Array.isArray(user?.permissoes)
    ? user?.permissoes
    : Array.isArray(user?.permissions)
      ? user?.permissions
      : [];

  // Mantem compatibilidade quando backend ainda nao envia permissoes.
  if (perms.length === 0) return true;

  if (perms.includes("*")) return true;

  return requiredPermissions.some((permission) => perms.includes(permission));
};

const filterMenusByPermission = (menus: Menu[], user: StoredUser | null): Menu[] => {
  const filtered = menus
    .map((menu) => {
      if (menu.isDivider) return menu;

      if (menu.submenus && menu.submenus.length > 0) {
        const visibleSubmenus = filterMenusByPermission(menu.submenus, user).filter((submenu) => !submenu.isDivider);

        if (visibleSubmenus.length === 0) {
          return null;
        }

        return {
          ...menu,
          submenus: visibleSubmenus,
        };
      }

      const hasPermission = hasAnyPermission(user, menu.requiredPermissions);
      const hasAccessGroup = hasAnyAccessGroup(user, menu.requiredAccessGroups);
      return hasPermission || hasAccessGroup ? menu : null;
    })
    .filter((menu): menu is Menu => Boolean(menu));

  // Remove separadores no inicio/fim e separadores consecutivos.
  return filtered.filter((menu, index, arr) => {
    if (!menu.isDivider) return true;

    const prev = arr[index - 1];
    const next = arr[index + 1];

    return Boolean(prev && next && !prev.isDivider && !next.isDivider);
  });
};

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
  const user = parseUserData();

  const menus: Menu[] = [
    { title: "Dashboard", path: "/dashboard/", requiredPermissions: ["DASHBOARD_VIEW"] },
    { isDivider: true, title: "" },
    {
      title: "Pessoas",
      submenus: [
        { title: "Pacientes", path: "/dashboard/pessoas/pacientes/PatientsPage", requiredPermissions: ["PATIENTS_VIEW", "PATIENTS_MANAGE"] },
        { title: "Funcionários", path: "/dashboard/pessoas/funcionarios", requiredPermissions: ["STAFF_VIEW", "STAFF_MANAGE"] },
        { title: "Úsuarios", path: "/dashboard/pessoas/usuarios", requiredPermissions: ["USERS_MANAGE"] },
        { title: "Fornecedores", path: "/dashboard/cadastros/fornecedores", requiredPermissions: ["SUPPLIERS_VIEW", "SUPPLIERS_MANAGE"] },
      ],
    },
    {
      title: "Cadastros",
      submenus: [
        { title: "Procedimentos", path: "/dashboard/cadastros/procedimentos", requiredPermissions: ["PROCEDURES_MANAGE"] },
        { title: "Convênios", path: "/dashboard/cadastros/convenios", requiredPermissions: ["AGREEMENTS_VIEW", "AGREEMENTS_MANAGE"] },
        { title: "Itens Anamnese", path: "/dashboard/cadastros/itens-anamnese", requiredPermissions: ["ANAMNESE_ITEMS_VIEW", "ANAMNESE_ITEMS_MANAGE"] },
        { title: "Grupos Anamnese", path: "/dashboard/cadastros/grupos-anamnese", requiredPermissions: ["ANAMNESE_GROUPS_VIEW", "ANAMNESE_GROUPS_MANAGE"] },
        { title: "formas_pgto", path: "/dashboard/cadastros/formas-pgto", requiredPermissions: ["PAYMENT_METHODS_VIEW", "PAYMENT_METHODS_MANAGE"] },
        { title: "frequencias", path: "/dashboard/cadastros/frequencias", requiredPermissions: ["FREQUENCIES_VIEW", "FREQUENCIES_MANAGE"] },
        { title: "Cargos", path: "/dashboard/cadastros/cargos", requiredPermissions: ["CARGOS_VIEW", "CARGOS_MANAGE"] },
      ],
    },
    {
      title: "Agendamentos",
      submenus: [
        { title: "Agendados", path: "/dashboard/agendamentos", requiredPermissions: ["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"] },
        { title: "Relatório de Agendamentos", path: "/dashboard/agendamentos/relatorio-agendamentos", requiredPermissions: ["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"] },
        { title: "Relatório de Procedimentos", path: "/dashboard/agendamentos/relatorio-procedimentos", requiredPermissions: ["SCHEDULINGS_VIEW", "SCHEDULINGS_MANAGE"] },
      ],
    },
    {
      title: "Financeiro",
      submenus: [
        { title: "Contas a Pagar", path: "/dashboard/financeiro/contas-pagar", requiredPermissions: ["FINANCE_PAYABLE_VIEW", "FINANCE_PAYABLE_MANAGE"] },
        { title: "Contas a Receber", path: "/dashboard/financeiro/contas-receber", requiredPermissions: ["FINANCE_RECEIVABLE_VIEW", "FINANCE_RECEIVABLE_MANAGE"] },
        { title: "Recebimentos Convênio", path: "/dashboard/financeiro/recebimentos-convenio", requiredPermissions: ["FINANCE_RECEIVABLE_VIEW", "FINANCE_RECEIVABLE_MANAGE"] },
        {
          title: "Comissões",
          path: "/dashboard/financeiro/comissoes",
          requiredPermissions: ["FINANCE_DASHBOARD_VIEW", "FINANCE_REPORTS_VIEW"],
          requiredAccessGroups: ["Financeiro"],
        },
      ],
    },
    { isDivider: true, title: "" }, // Divisor abaixo de "Financeiro"
    { title: "Consultas", path: "/dashboard/consultas", requiredPermissions: ["CONSULTAS_VIEW"] },
    { title: "Horários", path: "/dashboard/horarios", requiredPermissions: ["HORARIOS_VIEW"] },
    { title: "Minhas Comissões", path: "/dashboard/minhas-comissoes", requiredPermissions: ["COMISSOES_SELF_VIEW"] },
    { isDivider: true, title: "" }, // Divisor abaixo de "Minhas Comissões"
    { title: "Odontogramas", path: "/dashboard/odontogramas", requiredPermissions: ["ODONTOGRAM_VIEW", "ODONTOGRAM_MANAGE"] },
    { title: "Tratamentos", path: "/dashboard/tratamentos", requiredPermissions: ["TREATMENTS_MANAGE", "TREATMENTS_ASSIST"] },
    { title: "Orçamentos", path: "/dashboard/orcamentos", requiredPermissions: ["ORCAMENTOS_VIEW", "ORCAMENTOS_MANAGE"] },
    { isDivider: true, title: "" }, // Divisor abaixo de "Orçamentos"
    { title: "Caixas (Aberto)", path: "/dashboard/caixas-aberto", requiredPermissions: ["FINANCE_CASHFLOW_VIEW"] },
    { title: "Tarefas / Agenda", path: "/dashboard/tarefas-agenda", requiredPermissions: ["TASKS_VIEW"] },
    { title: "Anotações", path: "/dashboard/anotacoes", requiredPermissions: ["NOTES_VIEW"] },
    { isDivider: true, title: "" }, // Divisor abaixo de "Anotações"
    {
      title: "Relatórios",
      submenus: [
        { title: "Relatório Financeiro", path: "/dashboard/relatorios/relatorio-financeiro", requiredPermissions: ["FINANCE_REPORTS_VIEW"] },
        { title: "Relatório Sintético Despesas", path: "/dashboard/relatorios/relatorio-sintetico-despesas", requiredPermissions: ["FINANCE_REPORTS_VIEW"] },
        { title: "Relatório Sintético Receber", path: "/dashboard/relatorios/relatorio-sintetico-receber", requiredPermissions: ["FINANCE_REPORTS_VIEW"] },
        { title: "Relatório Balanço Anual", path: "/dashboard/relatorios/relatorio-balanco-anual", requiredPermissions: ["FINANCE_REPORTS_VIEW"] },
        { title: "Relatório Inadimplementes", path: "/dashboard/relatorios/relatorio-inadimplementes", requiredPermissions: ["FINANCE_REPORTS_VIEW"] },
      ],
    },
  ];

  const visibleMenus = filterMenusByPermission(menus, user);

  return (
    <div className="sidebar">
      <ul>
        {visibleMenus.map((menu, index) => (
          <RecursiveMenu key={index} menu={menu} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;