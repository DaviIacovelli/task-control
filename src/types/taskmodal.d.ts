export type TaskModalProps = {
  onClose: () => void;
  onSave: (e: FormEvent<HTMLFormElement>) => Promise<void>;
} & React.HTMLProps<HTMLTextAreaElement>;
