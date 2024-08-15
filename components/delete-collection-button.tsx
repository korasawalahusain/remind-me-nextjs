"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@ui/alert-dialog";
import { Button } from "@ui/button";
import { toast } from "@ui/use-toast";
import { deleteCollection } from "@actions";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@radix-ui/react-icons";
import { TransitionStartFunction, useEffect, useTransition } from "react";

type Props = {
  collectionId: number;
  startTransition: TransitionStartFunction;
};

export default function DeleteCollectionButton({
  collectionId,
  startTransition,
}: Props) {
  const router = useRouter();

  async function deleteCol() {
    const response = await deleteCollection({ id: collectionId });

    if (response.success) {
      toast({
        title: response.message?.title || "Success",
        description: response.message?.description,
      });

      router.refresh();
    } else {
      if (response.errors?.length) {
        response.errors.forEach((error) =>
          toast({
            variant: "destructive",
            title: error?.title || "Error",
            description: error?.description,
          })
        );
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone, this will permanently delete your
            collection and all tasks inside it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="gap-2"
            onClick={() => startTransition(deleteCol)}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
