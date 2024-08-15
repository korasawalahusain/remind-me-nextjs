import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from "@ui/sheet";
import React from "react";
import { Button } from "@ui/button";
import CreateCollectionForm from "./create-collection-form";

type Props = {};

export default function CreateCollectionButton({}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="group w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px]">
          <Button
            variant="outline"
            className="dark:text-white w-full dark:bg-neutral-950 bg-white"
          >
            <span className="bg-gradient-to-r from-red-500 to-orange-500 group-hover:to-orange-800 bg-clip-text text-transparent">
              Create Collection
            </span>
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center">Add new collection</SheetTitle>
          <SheetDescription className="text-center">
            Collections are a way to group your tasks
          </SheetDescription>
        </SheetHeader>

        <CreateCollectionForm />
      </SheetContent>
    </Sheet>
  );
}
