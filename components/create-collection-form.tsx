"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@ui/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@ui/select";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { toast } from "@ui/use-toast";
import React, { useState } from "react";
import { Separator } from "@ui/separator";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ImSpinner2 } from "react-icons/im";
import { createCollection } from "@actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, CollectionColor, CollectionColors } from "@lib";
import { createCollectionSchema, CreateCollectionSchemaType } from "@schemas";

type Props = {};

export default function CreateCollectionForm({}: Props) {
  const router = useRouter();
  const [refreshRef, setRefreshRef] = useState(new Date().getTime());

  const form = useForm<CreateCollectionSchemaType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {},
  });

  async function onSubmit(values: CreateCollectionSchemaType) {
    const response = await createCollection({ data: values });
    if (response.success) {
      toast({
        title: response.message?.title || "Success",
        description: response.message?.description,
      });

      form.reset({});
      setRefreshRef(new Date().getTime());
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
    <Form {...form} key={refreshRef}>
      <form
        className="space-y-4 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Personal" />
              </FormControl>
              <FormDescription>Collection name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="color"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger
                    className={cn(
                      "w-full h-8 text-white",
                      CollectionColors[field.value as CollectionColor]
                    )}
                  >
                    <SelectValue placeholder="Color" className="w-full h-8" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CollectionColors).map((color, index) => (
                      <SelectItem
                        key={index}
                        value={color}
                        className={cn(
                          "w-full h-8 rounded-md my-1 text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white",
                          CollectionColors[color as CollectionColor]
                        )}
                      >
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select a color for your collection
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 mt-4">
          <Separator />
          <Button
            variant="outline"
            onClick={form.handleSubmit(onSubmit)}
            className={cn(
              "gap-2",
              form.watch("color") &&
                CollectionColors[form.getValues("color") as CollectionColor]
            )}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ImSpinner2 className="animate-spin" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
