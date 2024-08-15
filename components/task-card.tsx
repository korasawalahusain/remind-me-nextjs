import { cn } from "@lib";
import { Task } from "@types";
import { format } from "date-fns";
import { toast } from "@ui/use-toast";
import { Checkbox } from "@ui/checkbox";
import { useRouter } from "next/navigation";
import { toggleTaskStatus } from "@actions";
import React, { useTransition } from "react";

type Props = {
  task: Task;
};

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 3600000;

  if (days < 0) return "text-gray-300 dark:text-gray-400";
  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-red-400";

  return "text-green-500 dark:text-green-400";
}

export default function TaskCard({ task }: Props) {
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  function toggleTaskDone(checked: boolean) {
    startTransition(async () => {
      const response = await toggleTaskStatus({
        id: task.id!,
        status: checked === true,
      });

      if (response.success) {
        router.refresh();
      } else {
        if (response.errors?.length) {
          response.errors?.forEach((error) =>
            toast({
              title: error.title,
              description: error.description,
            })
          );
        }
      }
    });
  }

  return (
    <div className="flex gap-2 items-start">
      <Checkbox
        disabled={loading}
        className="w-5 h-5"
        checked={task.done}
        id={task.id?.toString()}
        onCheckedChange={toggleTaskDone}
      />
      <label
        htmlFor={task.id?.toString()}
        className={cn(
          "text-sm font-medium leading-none decoration-1 dark:decoration-white",
          {
            "line-through": task.done,
          }
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt)
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}
      </label>
    </div>
  );
}
