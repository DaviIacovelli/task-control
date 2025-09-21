import { useTranslation } from "@/hooks/useTranslation";
import { HeaderProps } from "@/types/header";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import styles from "./styles.module.css";

export function Header({ toggleSidebar }: HeaderProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  // Função para alternar o tema
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <button
            className={styles.menuButton}
            aria-label="Menu"
            onClick={toggleSidebar}
          >
            <FiMenu className={styles.menuIcon} />
          </button>
          <h1 className={styles.logo}>
            <Link href="/dashboard">{t("dashboard.title")}</Link>
          </h1>
        </div>
        <div className={styles.themeToggle}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              aria-label="Alternar modo escuro"
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
          </label>
        </div>
        <div className={styles.userProfile}>
          <span>
            {t("dashboard.header.welcome", { name: session?.user?.name || "" })}
          </span>
          <button className={styles.logoutButton} onClick={() => signOut()}>
            {t("dashboard.header.logout")}
          </button>
        </div>
      </div>
    </header>
  );
}
