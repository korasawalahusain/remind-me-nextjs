import { Task } from "./task";

export interface Collection {
  id?: number;
  name?: string;
  tasks?: Task[];
  color?: string;
  userId?: string;
  createdAt?: Date;
}
