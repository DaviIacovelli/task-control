// src/components/LanguageSwitcher.tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.css";

const LanguageSwitcher = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const changeLanguage = (locale: string) => {
    // Preserva o caminho atual ao trocar o idioma
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
    setIsOpen(false);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === router.locale) || languages[0];

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={formatMessage({ id: "LanguageSwitcher.changeLanguage" })}
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.languageName}>{currentLanguage.name}</span>
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.languageDropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${
                router.locale === language.code ? styles.active : ""
              }`}
              onClick={() => changeLanguage(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
