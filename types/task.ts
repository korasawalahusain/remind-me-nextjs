import { Collection } from "./collection";

export interface Task {
  id?: number;
  done?: boolean;
  userId?: string;
  content?: string;
  createdAt?: Date;
  collectionId?: number;
  collection?: Collection;
  expiresAt?: Date | null;
}
