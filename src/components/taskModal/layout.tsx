import { TaskModalProps } from "@/types/taskmodal";
import styles from "./styles.module.css";

export function TaskModal({ onClose, onSave, ...props }: TaskModalProps) {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Nova Tarefa</h2>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>
          <textarea
            className={styles.textarea}
            placeholder="Digite sua tarefa aqui..."
            {...props}
          />
          <div className={styles.footer}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={onSave}
            >
              Salvar Tarefa
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
