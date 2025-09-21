"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import styles from "../styles/page.module.css";

export default function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const text = "Transforme dados em decisões";
    let i = 0;

    // Animação do cursor piscando
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    // Animação de digitação
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.gradientBackground} />

      <main className={styles.content}>
        <h1 className={styles.mainTitle}>
          {typedText}
          <span
            className={`${styles.cursor} ${showCursor ? styles.visible : ""}`}
          >
            |
          </span>
        </h1>

        <p className={styles.subtitle}>
          Nosso painel de controle oferece insights poderosos para impulsionar
          seu negócio
        </p>

        <div className={styles.ctaContainer}>
          <Link href="/login" className={styles.ctaButton}>
            Comece agora <FiArrowRight className={styles.arrowIcon} />
          </Link>
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollAnimation}></div>
          </div>
        </div>
      </main>

      <div className={styles.floatingShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
      </div>
    </div>
  );
}
