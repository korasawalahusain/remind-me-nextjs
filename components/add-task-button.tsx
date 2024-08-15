"use client";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@ui/form";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@ui/dialog";
import React from "react";
import { format } from "date-fns";
import { Button } from "@ui/button";
import { Collection } from "@types";
import { toast } from "@ui/use-toast";
import { createTask } from "@actions";
import { Textarea } from "@ui/textarea";
import { Calendar } from "@ui/calendar";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, CollectionColor, CollectionColors } from "@lib";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { createTaskSchema, CreateTaskSchemaType } from "@schemas";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

type Props = {
  open: boolean;
  collection: Collection;
  setOpen: (open: boolean) => void;
};

export default function AddTaskButton({ open, setOpen, collection }: Props) {
  const router = useRouter();
  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id!,
    },
  });

  function onOpenChangeWrapper(open: boolean) {
    setOpen(open);
    form.reset({
      collectionId: collection.id!,
    });
  }

  async function onSubmit(values: CreateTaskSchemaType) {
    const response = await createTask({
      data: {
        ...values,
        collectionId: collection.id!,
      },
    });
    if (response.success) {
      toast({
        title: response.message?.title || "Success",
        description: response.message?.description,
      });

      onOpenChangeWrapper(false);
      router.refresh();
    } else {
      if (response.validationErrors?.length) {
        response.validationErrors.forEach((error) =>
          form.setError(error.field as any, { message: error.description })
        );
      }

      if (response.errors?.length) {
        response.errors?.forEach((error) =>
          toast({
            title: error.title,
            variant: "destructive",
            description: error.description,
          })
        );
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeWrapper}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <svg
            fill="none"
            strokeWidth={1.5}
            className="h-4 w-4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Add task to collection:
            <span
              className={cn(
                "p-[1px] bg-clip-text text-transparent",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a task to your collection. You can add as many task as you want
            to a collection.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      placeholder="Task content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires At</FormLabel>
                  <FormDescription>
                    When should this task expire?
                  </FormDescription>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full",
                            {
                              "text-muted-foreground": !field.value,
                            }
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span> No Expiration</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className={cn(
              "w-full text-white",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className="animate-spin h-4 w-4 ml-2" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
