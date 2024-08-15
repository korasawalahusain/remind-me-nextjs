import { z } from "zod";

export const createTaskSchema = z.object({
  collectionId: z.number().positive(),
  content: z.string().min(8, {
    message: "Task content must be atleast 8 characters",
  }),
  expiresAt: z.date().optional(),
});

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
