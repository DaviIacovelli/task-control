export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date | Timestamp;
  user: string;
};
