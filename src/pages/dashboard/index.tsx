import { Header } from "@/components/header/layout";
import { TaskModal } from "@/components/taskModal/layout";
import { useTranslation } from "@/hooks/useTranslation";
import { db } from "@/services/firebaseConnection";
import { ChartDataItem } from "@/types/barchart";
import { MonthlyProgressData } from "@/types/linechart";
import { MenuType } from "@/types/menu";
import { Task } from "@/types/task";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FiCheck,
  FiEdit2,
  FiFileText,
  FiHome,
  FiPieChart,
  FiPlus,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./styles.module.css";

function formatDate(dateInput: Date | Timestamp | undefined): string {
  if (!dateInput) return "N/A";

  const date = dateInput instanceof Date ? dateInput : dateInput.toDate();

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, locale, changeLanguage } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<MenuType>("overview");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [weekCompletedTasks, setWeekCompletedTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState<Task[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [monthlyProgressData, setMonthlyProgressData] = useState<
    MonthlyProgressData[]
  >([]);

  const formatChartData = useCallback(
    (tasks: Task[]): ChartDataItem[] => {
      const daysOfWeek: ChartDataItem[] = [
        { day: 0, name: t("dashboard.days.sunday"), count: 0 },
        { day: 1, name: t("dashboard.days.monday"), count: 0 },
        { day: 2, name: t("dashboard.days.tuesday"), count: 0 },
        { day: 3, name: t("dashboard.days.wednesday"), count: 0 },
        { day: 4, name: t("dashboard.days.thursday"), count: 0 },
        { day: 5, name: t("dashboard.days.friday"), count: 0 },
        { day: 6, name: t("dashboard.days.saturday"), count: 0 },
      ];

      tasks.forEach((task) => {
        if (task.createdAt) {
          const date =
            task.createdAt instanceof Date
              ? task.createdAt
              : task.createdAt.toDate();
          const dayOfWeek = date.getDay();
          const dayData = daysOfWeek.find((d) => d.day === dayOfWeek);
          if (dayData) {
            dayData.count += 1;
          }
        }
      });

      return daysOfWeek;
    },
    [t]
  );

  const formatMonthlyProgressData = useCallback(
    (tasks: Task[]): MonthlyProgressData[] => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const weeks: MonthlyProgressData[] = [
        { week: t("dashboard.weeks.week1"), tasks: 0 },
        { week: t("dashboard.weeks.week2"), tasks: 0 },
        { week: t("dashboard.weeks.week3"), tasks: 0 },
        { week: t("dashboard.weeks.week4"), tasks: 0 },
        { week: t("dashboard.weeks.week5"), tasks: 0 },
      ];

      tasks.forEach((task) => {
        if (task.createdAt) {
          const date =
            task.createdAt instanceof Date
              ? task.createdAt
              : task.createdAt.toDate();

          if (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          ) {
            const day = date.getDate();
            let weekNumber: number;

            if (day <= 7) weekNumber = 1;
            else if (day <= 14) weekNumber = 2;
            else if (day <= 21) weekNumber = 3;
            else if (day <= 28) weekNumber = 4;
            else weekNumber = 5;

            if (weekNumber >= 1 && weekNumber <= 5) {
              weeks[weekNumber - 1].tasks += 1;
            }
          }
        }
      });

      return weeks;
    },
    [t]
  );

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const unsubscribeFunctions: (Unsubscribe | void)[] = [];

    async function loadTasks(): Promise<void> {
      const colecao = collection(db, "posts");

      if (session?.user?.email) {
        const q = query(
          colecao,
          orderBy("createdAt", "desc"),
          where("user", "==", session.user.email)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Task[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            });
          });
          setTasks(list);
        });

        unsubscribeFunctions.push(unsubscribe);
      }
    }

    async function getCompletedTasks(): Promise<void> {
      if (!db || !session?.user?.email) {
        return;
      }

      try {
        const q = query(
          collection(db, "completed"),
          where("user", "==", session.user.email),
          orderBy("completedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Task[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            });
          });
          setCompletedTasks(list);
          setMonthlyProgressData(formatMonthlyProgressData(list));
        });

        unsubscribeFunctions.push(unsubscribe);
      } catch (error) {
        console.error("Erro ao obter tarefas completadas:", error);
      }
    }

    async function getPendingTasks(): Promise<void> {
      if (!db || !session?.user?.email) {
        return;
      }

      try {
        const q = query(
          collection(db, "posts"),
          where("user", "==", session.user.email),
          where("completed", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Task[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            });
          });
          setPendingTasks(list);
        });

        unsubscribeFunctions.push(unsubscribe);
      } catch (error) {
        console.error("Erro ao obter tarefas pendentes:", error);
      }
    }

    async function getWeekCompletedTasks(): Promise<void> {
      if (!db || !session?.user?.email) {
        return;
      }

      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const q = query(
          collection(db, "completed"),
          where("user", "==", session.user.email),
          where("completedAt", ">=", Timestamp.fromDate(oneWeekAgo))
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Task[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            });
          });
          setWeekCompletedTasks(list);
          setChartData(formatChartData(list));
        });

        unsubscribeFunctions.push(unsubscribe);
      } catch (error) {
        console.error("Erro ao obter tarefas da semana:", error);
      }
    }

    async function getTotalTasks(): Promise<void> {
      if (!db || !session?.user?.email) {
        return;
      }

      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("user", "==", session.user.email)
        );
        const completedQuery = query(
          collection(db, "completed"),
          where("user", "==", session.user.email)
        );

        const [postsSnapshot, completedSnapshot] = await Promise.all([
          getDocs(postsQuery),
          getDocs(completedQuery),
        ]);

        const totalT: Task[] = [
          ...postsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            };
          }),
          ...completedSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              completed: data.completed,
              createdAt: data.createdAt,
              user: data.user,
            };
          }),
        ];

        setTotalTasks(totalT);
      } catch (error) {
        console.error("Erro ao obter tarefas totais:", error);
      }
    }

    loadTasks();
    getCompletedTasks();
    getPendingTasks();
    getWeekCompletedTasks();
    getTotalTasks();

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      });
    };
  }, [session, router, formatChartData, formatMonthlyProgressData]);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (menu: MenuType): void => {
    setActiveMenu(menu);
  };

  const handleModalSave = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (input.trim() === "") {
      alert(t("dashboard.tasks.placeholder"));
      return;
    }

    if (!session?.user?.email) {
      alert("Sessão do usuário não carrega!");
      return;
    }

    if (!db) {
      alert("Erro ao conectar ao banco de dados!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title: input,
        completed: false,
        createdAt: new Date(),
        user: session.user.email,
      });
      setInput("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Erro ao adicionar tarefa. Tente novamente.");
    }
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    if (!db) {
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa. Tente novamente.");
    }
  };

  const handleEditTask = async (id: string): Promise<void> => {
    if (!db || input.trim() === "") {
      return;
    }

    try {
      await updateDoc(doc(db, "posts", id), {
        title: input,
      });
      setInput("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      alert("Erro ao editar tarefa. Tente novamente.");
    }
  };

  const handleCompleteTask = async (id: string): Promise<void> => {
    if (!db) {
      return;
    }

    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        await updateDoc(docRef, {
          completed: true,
          completedAt: new Date(),
        });

        await addDoc(collection(db, "completed"), {
          title: data.title,
          completed: true,
          createdAt: data.createdAt,
          completedAt: new Date(),
          user: data.user,
        });

        await deleteDoc(docRef);
      } else {
        console.error("Documento não encontrado");
      }
    } catch (error) {
      console.error("Erro ao completar tarefa:", error);
      alert("Erro ao completar tarefa. Tente novamente.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInput(e.target.value);
  };

  const handleModalClose = (): void => {
    setShowModal(false);
    setInput("");
  };

  const handleEditTaskWithModal = (taskId: string): void => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setInput(taskToEdit.title);
      setShowModal(true);
    }
  };

  const handleModalSaveWrapper = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (input.trim() === "") {
      alert(t("dashboard.tasks.placeholder"));
      return;
    }

    const taskToEdit = tasks.find((task) => task.title === input);
    if (taskToEdit) {
      await handleEditTask(taskToEdit.id);
    } else {
      await handleModalSave(e);
    }
  };

  const isMenuActive = (menu: MenuType): boolean => {
    return activeMenu === menu;
  };

  const renderSidebar = () => (
    <aside
      className={`${styles.sidebar} ${
        sidebarOpen ? styles.open : styles.closed
      }`}
    >
      <ul className={styles.sidebarMenu}>
        <li>
          <a
            href="#"
            className={`${styles.menuLink} ${
              isMenuActive("overview") ? styles.active : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("overview");
            }}
          >
            <FiHome className={styles.menuIcon} />
            <span>{t("dashboard.menu.overview")}</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`${styles.menuLink} ${
              isMenuActive("reports") ? styles.active : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("reports");
            }}
          >
            <FiFileText className={styles.menuIcon} />
            <span>{t("dashboard.menu.tasks")}</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`${styles.menuLink} ${
              isMenuActive("analytics") ? styles.active : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("analytics");
            }}
          >
            <FiPieChart className={styles.menuIcon} />
            <span>{t("dashboard.menu.analytics")}</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`${styles.menuLink} ${
              isMenuActive("settings") ? styles.active : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleMenuClick("settings");
            }}
          >
            <FiSettings className={styles.menuIcon} />
            <span>{t("dashboard.menu.settings")}</span>
          </a>
        </li>
      </ul>
    </aside>
  );

  switch (activeMenu) {
    case "overview":
      return (
        <div
          className={`${styles.dashboard} ${
            sidebarOpen ? "" : styles.sidebarCollapsed
          }`}
        >
          {session?.user && (
            <>
              <Header toggleSidebar={toggleSidebar} />
              <div className={styles.container}>
                {renderSidebar()}
                <main className={styles.mainContent}>
                  <div className={styles.contentHeader}>
                    <h1>{t("dashboard.overview.title")}</h1>
                    <p>
                      {t("dashboard.welcome", {
                        name: session.user.name || "",
                      })}
                    </p>
                    <div className={styles.contentOverview}>
                      <div className={styles.overviewItem}>
                        <span className={styles.overviewTitle}>
                          {t("dashboard.overview.pending")}
                        </span>
                        <span className={styles.overviewValue}>
                          {pendingTasks.length}
                        </span>
                      </div>
                      <div className={styles.overviewItem}>
                        <span className={styles.overviewTitle}>
                          {t("dashboard.overview.weekCompleted")}
                        </span>
                        <span className={styles.overviewValue}>
                          {weekCompletedTasks.length}
                        </span>
                      </div>
                      <div className={styles.overviewItem}>
                        <span className={styles.overviewTitle}>
                          {t("dashboard.overview.completed")}
                        </span>
                        <span className={styles.overviewValue}>
                          {completedTasks.length}
                        </span>
                      </div>
                      <div className={styles.overviewItem}>
                        <span className={styles.overviewTitle}>
                          {t("dashboard.overview.total")}
                        </span>
                        <span className={styles.overviewValue}>
                          {totalTasks.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </>
          )}
        </div>
      );

    case "reports":
      return (
        <div
          className={`${styles.dashboard} ${
            sidebarOpen ? "" : styles.sidebarCollapsed
          }`}
        >
          {session?.user && (
            <>
              <Header toggleSidebar={toggleSidebar} />
              <div className={styles.container}>
                {renderSidebar()}
                <main className={styles.mainContent}>
                  <div className={styles.contentHeader}>
                    <h1>{t("dashboard.tasks.title")}</h1>
                    <p>
                      {t("dashboard.welcome", {
                        name: session.user.name || "",
                      })}
                    </p>
                  </div>

                  <div className={styles.contentContainer}>
                    <button
                      className={styles.addTaskButton}
                      onClick={() => setShowModal(true)}
                    >
                      <FiPlus className={styles.addIcon} />
                      {t("dashboard.tasks.addTask")}
                    </button>

                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <div key={task.id} className={styles.taskItem}>
                          <div className={styles.taskContent}>
                            <p className={styles.taskTitle}>{task.title}</p>
                            <p className={styles.taskDate}>
                              {formatDate(task.createdAt)}
                            </p>
                          </div>
                          <div className={styles.taskActions}>
                            <button
                              className={styles.completeButton}
                              onClick={() => handleCompleteTask(task.id)}
                            >
                              <FiCheck className={styles.completeIcon} />
                              {t("dashboard.tasks.complete")}
                            </button>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditTaskWithModal(task.id)}
                            >
                              <FiEdit2 className={styles.editIcon} />
                              {t("dashboard.tasks.edit")}
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <FiTrash2 className={styles.deleteIcon} />
                              {t("dashboard.tasks.delete")}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noTasksMessage}>
                        {t("dashboard.tasks.noTasks")}
                      </p>
                    )}

                    {showModal && (
                      <TaskModal
                        onClose={handleModalClose}
                        onSave={handleModalSaveWrapper}
                        value={input}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                </main>
              </div>
            </>
          )}
        </div>
      );

    case "analytics":
      return (
        <div
          className={`${styles.dashboard} ${
            sidebarOpen ? "" : styles.sidebarCollapsed
          }`}
        >
          {session?.user && (
            <>
              <Header toggleSidebar={toggleSidebar} />
              <div className={styles.container}>
                {renderSidebar()}
                <main className={styles.mainContent}>
                  <div className={styles.contentHeader}>
                    <h1>{t("dashboard.analytics.title")}</h1>
                    <p>
                      {t("dashboard.welcome", {
                        name: session.user.name || "",
                      })}
                    </p>
                  </div>

                  <div className={styles.contentContainer}>
                    <div className={styles.chartSection}>
                      <h3 className={styles.chartTitle}>
                        {t("dashboard.analytics.weeklyProgress")}
                      </h3>
                      <div
                        style={{
                          width: "100%",
                          height: 300,
                          marginBottom: "2rem",
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 30,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value: unknown) => [
                                `${value} ${t(
                                  "dashboard.tasks.title"
                                ).toLowerCase()}`,
                                t("dashboard.analytics.quantity"),
                              ]}
                              labelFormatter={(label: unknown) =>
                                `${t("dashboard.analytics.day")}: ${label}`
                              }
                            />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name={`${t("dashboard.tasks.title")} ${t(
                                "dashboard.overview.completed"
                              )}`}
                              fill="#8884d8"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {chartData.length === 0 && (
                        <p className={styles.noDataMessage}>
                          {t("dashboard.analytics.noData")} nesta semana.
                        </p>
                      )}
                    </div>

                    <div className={styles.chartSection}>
                      <h3 className={styles.chartTitle}>
                        {t("dashboard.analytics.monthlyProgress")}
                      </h3>
                      <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={monthlyProgressData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 30,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                            <YAxis
                              allowDecimals={false}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value: unknown) => [
                                `${value} ${t(
                                  "dashboard.tasks.title"
                                ).toLowerCase()}`,
                                t("dashboard.analytics.quantity"),
                              ]}
                              labelFormatter={(label: unknown) =>
                                `${t("dashboard.analytics.period")}: ${label}`
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="tasks"
                              name={`${t("dashboard.tasks.title")} ${t(
                                "dashboard.overview.completed"
                              )}`}
                              stroke="#82ca9d"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {monthlyProgressData.length === 0 && (
                        <p className={styles.noDataMessage}>
                          {t("dashboard.analytics.noData")} neste mês.
                        </p>
                      )}
                    </div>
                  </div>
                </main>
              </div>
            </>
          )}
        </div>
      );

    case "settings":
      return (
        <div
          className={`${styles.dashboard} ${
            sidebarOpen ? "" : styles.sidebarCollapsed
          }`}
        >
          {session?.user && (
            <>
              <Header toggleSidebar={toggleSidebar} />
              <div className={styles.container}>
                {renderSidebar()}
                <main className={styles.mainContent}>
                  <div className={styles.contentHeader}>
                    <h1>{t("dashboard.settings.title")}</h1>
                    <p>{t("dashboard.settings.description")}</p>
                  </div>

                  <div className={styles.contentContainer}>
                    <div className={styles.settingsSection}>
                      <h3>{t("dashboard.settings.userPreferences")}</h3>
                      <p>{t("dashboard.settings.displaySettings")}</p>

                      <div className={styles.settingItem}>
                        <label htmlFor="language">
                          {t("dashboard.common.language")}:
                        </label>
                        <select
                          id="language"
                          value={locale}
                          onChange={(e) => changeLanguage(e.target.value)}
                          className={styles.settingSelect}
                        >
                          <option value="pt">Português</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </>
          )}
        </div>
      );

    default:
      return null;
  }
}
