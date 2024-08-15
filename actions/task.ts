"use server";

import { prisma } from "@lib";
import { Prisma } from "@prisma/client";
import { ActionOutput, Task } from "@types";
import { currentUser } from "@clerk/nextjs/server";
import { createTaskSchema, CreateTaskSchemaType } from "@schemas";

export type CreateTaskInput = {
  data: CreateTaskSchemaType;
  select?: Prisma.TaskSelect | null;
};

export type CreateTaskOutput = {
  task: Task;
};

export async function createTask({
  data,
  select,
}: CreateTaskInput): Promise<ActionOutput<CreateTaskOutput>> {
  const validate = createTaskSchema.safeParse(data);

  if (!validate.success) {
    return {
      success: false,
      validationErrors: [],
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        errors: [
          {
            title: "Error",
            description: "Please login to continue!",
          },
        ],
      };
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        userId: user.id,
      },
      select,
    });

    return {
      task: task,
      success: true,
      message: {
        title: "Success",
        description: "Task created successfully",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [
        {
          title: "Error",
          description: "Something went wrong, please try again!",
        },
      ],
    };
  }
}

export type ToggleTaskStatusInput = {
  id: number;
  status: boolean;
  select?: Prisma.TaskSelect | null;
};

export type ToggleTaskStatusOutput = {
  task: Task;
};

export async function toggleTaskStatus({
  id,
  status,
  select,
}: ToggleTaskStatusInput): Promise<ActionOutput<ToggleTaskStatusOutput>> {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        errors: [
          {
            title: "Error",
            description: "Please login to continue!",
          },
        ],
      };
    }

    const task = await prisma.task.update({
      select,
      where: {
        id,
      },
      data: {
        done: status,
      },
    });

    return {
      task: task,
      success: true,
      message: {
        title: "Success",
        description: "Task updated successfully",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      errors: [
        {
          title: "Error",
          description: "Something went wrong, please try again!",
        },
      ],
    };
  }
}
