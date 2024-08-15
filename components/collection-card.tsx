"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@ui/collapsible";
import TaskCard from "./task-card";
import { Button } from "@ui/button";
import { Collection } from "@types";
import { Progress } from "@ui/progress";
import { Separator } from "@ui/separator";
import AddTaskButton from "./add-task-button";
import { useMemo, useState, useTransition } from "react";
import { cn, CollectionColor, CollectionColors } from "@lib";
import DeleteCollectionButton from "./delete-collection-button";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";

type Props = {
  collection: Collection;
};

export default function CollectionCard({ collection }: Props) {
  const [loading, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const totalTasks = collection.tasks?.length || 0;
  const tasksDone = useMemo(
    () => collection.tasks?.filter((task) => task.done).length || 0,
    [collection.tasks]
  );

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full justify-between p-6",
            CollectionColors[collection.color as CollectionColor],
            {
              "rounded-b-none": isOpen,
            }
          )}
        >
          <span className="text-white font-bold">{collection.name}</span>
          {isOpen ? (
            <CaretUpIcon className="h-6 w-6" />
          ) : (
            <CaretDownIcon className="h-6 w-6" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col rounded-b-md shadow-lg dark:bg-neutral-900">
        {collection.tasks?.length === 0 ? (
          <Button
            variant="ghost"
            onClick={() => setIsAddTaskDialogOpen(true)}
            className="flex items-center justify-center gap-1 px-8 py-12 rounded-none"
          >
            <p>There are not tasks yet:</p>
            <span
              className={cn(
                "text-sm bg-clip-text text-transparent",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              Create one
            </span>
          </Button>
        ) : (
          <>
            <Progress className="rounded-none" value={progress} />
            <div className="p-4 gap-3 flex flex-col">
              {collection.tasks?.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          </>
        )}

        <Separator />
        <footer className="h-10 py-0.5 px-4 text-xs text-neutral-500 flex justify-between items-center">
          <p>Created at {collection.createdAt?.toDateString()}</p>
          {loading ? (
            <p>Deleting...</p>
          ) : (
            <div>
              <AddTaskButton
                collection={collection}
                open={isAddTaskDialogOpen}
                setOpen={setIsAddTaskDialogOpen}
              />

              <DeleteCollectionButton
                collectionId={collection.id!}
                startTransition={startTransition}
              />
            </div>
          )}
        </footer>
      </CollapsibleContent>
    </Collapsible>
  );
}
