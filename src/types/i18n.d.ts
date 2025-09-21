export interface Messages {
  dashboard: {
    title: string;
    welcome: string;
    menu: {
      overview: string;
      tasks: string;
      analytics: string;
      settings: string;
    };
    overview: {
      title: string;
      pending: string;
      weekCompleted: string;
      completed: string;
      total: string;
    };
    tasks: {
      title: string;
      addTask: string;
      complete: string;
      edit: string;
      delete: string;
      noTasks: string;
      placeholder: string;
    };
    analytics: {
      title: string;
      weeklyProgress: string;
      monthlyProgress: string;
      noData: string;
      quantity: string;
      day: string;
      period: string;
    };
    settings: {
      title: string;
      description: string;
      userPreferences: string;
      displaySettings: string;
    };
    common: {
      save: string;
      cancel: string;
      confirm: string;
      loading: string;
      language: string;
    };
    days: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
    weeks: {
      week1: string;
      week2: string;
      week3: string;
      week4: string;
      week5: string;
    };
    header: {
      menu: string;
      title: string;
      darkMode: string;
      welcome: string;
      logout: string;
    };
  };
}
