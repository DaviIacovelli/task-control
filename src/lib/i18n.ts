import { Messages } from "@/types/i18n";

const messages: Record<string, Messages> = {
  pt: {
    dashboard: {
      title: "Painel de Controle",
      welcome:
        "Bem-vindo de volta, {name}! Aqui está o que está acontecendo hoje.",
      menu: {
        overview: "Visão Geral",
        tasks: "Tarefas",
        analytics: "Análises",
        settings: "Configurações",
      },
      overview: {
        title: "Visão Geral do Painel",
        pending: "Pendentes",
        weekCompleted: "Realizadas nessa Semana",
        completed: "Concluídas",
        total: "Total",
      },
      tasks: {
        title: "Tarefas",
        addTask: "Adicionar Tarefa",
        complete: "Concluir",
        edit: "Editar",
        delete: "Excluir",
        noTasks: "Nenhuma tarefa pendente.",
        placeholder: "Digite uma tarefa...",
      },
      analytics: {
        title: "Análises",
        weeklyProgress: "Progresso Semanal",
        monthlyProgress: "Progresso Mensal",
        noData: "Nenhuma tarefa concluída",
        quantity: "Quantidade",
        day: "Dia",
        period: "Período",
      },
      header: {
        menu: "Menu",
        title: "Painel de Controle",
        darkMode: "Modo escuro",
        welcome: "Bem-vindo, {name}!",
        logout: "Sair",
      },
      settings: {
        title: "Configurações",
        description:
          "Aqui você pode ajustar suas preferências e configurações.",
        userPreferences: "Preferências do Usuário",
        displaySettings: "Configurações de exibição e personalização.",
      },
      common: {
        save: "Salvar",
        cancel: "Cancelar",
        confirm: "Confirmar",
        loading: "Carregando...",
        language: "Idioma",
      },
      days: {
        sunday: "Domingo",
        monday: "Segunda",
        tuesday: "Terça",
        wednesday: "Quarta",
        thursday: "Quinta",
        friday: "Sexta",
        saturday: "Sábado",
      },
      weeks: {
        week1: "Semana 1",
        week2: "Semana 2",
        week3: "Semana 3",
        week4: "Semana 4",
        week5: "Semana 5",
      },
    },
  },
  en: {
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back, {name}! Here's what's happening today.",
      menu: {
        overview: "Overview",
        tasks: "Tasks",
        analytics: "Analytics",
        settings: "Settings",
      },
      overview: {
        title: "Dashboard Overview",
        pending: "Pending",
        weekCompleted: "Completed This Week",
        completed: "Completed",
        total: "Total",
      },
      tasks: {
        title: "Tasks",
        addTask: "Add Task",
        complete: "Complete",
        edit: "Edit",
        delete: "Delete",
        noTasks: "No pending tasks.",
        placeholder: "Enter a task...",
      },
      analytics: {
        title: "Analytics",
        weeklyProgress: "Weekly Progress",
        monthlyProgress: "Monthly Progress",
        noData: "No completed tasks",
        quantity: "Quantity",
        day: "Day",
        period: "Period",
      },
      header: {
        menu: "Menu",
        title: "Dashboard",
        darkMode: "Dark Mode",
        welcome: "Welcome, {name}!",
        logout: "Logout",
      },
      settings: {
        title: "Settings",
        description: "Here you can adjust your preferences and settings.",
        userPreferences: "User Preferences",
        displaySettings: "Display and customization settings.",
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        loading: "Loading...",
        language: "Language",
      },
      days: {
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
      },
      weeks: {
        week1: "Week 1",
        week2: "Week 2",
        week3: "Week 3",
        week4: "Week 4",
        week5: "Week 5",
      },
    },
  },
  es: {
    dashboard: {
      title: "Tablero",
      welcome:
        "¡Bienvenido de vuelta, {name}! Esto es lo que está pasando hoy.",
      menu: {
        overview: "Resumen",
        tasks: "Tareas",
        analytics: "Análisis",
        settings: "Configuración",
      },
      overview: {
        title: "Resumen del Tablero",
        pending: "Pendientes",
        weekCompleted: "Completadas Esta Semana",
        completed: "Completadas",
        total: "Total",
      },
      tasks: {
        title: "Tareas",
        addTask: "Agregar Tarea",
        complete: "Completar",
        edit: "Editar",
        delete: "Eliminar",
        noTasks: "No hay tareas pendientes.",
        placeholder: "Ingresa una tarea...",
      },
      analytics: {
        title: "Análisis",
        weeklyProgress: "Progreso Semanal",
        monthlyProgress: "Progreso Mensual",
        noData: "No hay tareas completadas",
        quantity: "Cantidad",
        day: "Día",
        period: "Período",
      },
      header: {
        menu: "Menu",
        title: "Tablero",
        darkMode: "Modo Oscuro",
        welcome: "Bienvenido, {name}!",
        logout: "Salir",
      },
      settings: {
        title: "Configuración",
        description: "Aquí puedes ajustar tus preferencias y configuración.",
        userPreferences: "Preferencias del Usuario",
        displaySettings: "Configuración de visualización y personalización.",
      },
      common: {
        save: "Guardar",
        cancel: "Cancelar",
        confirm: "Confirmar",
        loading: "Cargando...",
        language: "Idioma",
      },
      days: {
        sunday: "Domingo",
        monday: "Lunes",
        tuesday: "Martes",
        wednesday: "Miércoles",
        thursday: "Jueves",
        friday: "Viernes",
        saturday: "Sábado",
      },
      weeks: {
        week1: "Semana 1",
        week2: "Semana 2",
        week3: "Semana 3",
        week4: "Semana 4",
        week5: "Semana 5",
      },
    },
  },
};

export function getMessages(locale: string): Messages {
  return messages[locale] || messages.pt;
}

export function formatMessage(
  message: string,
  values: Record<string, string> = {}
): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => values[key] || match);
}
