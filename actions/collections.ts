"use server";

import { prisma } from "@lib";
import { Prisma } from "@prisma/client";
import { ActionOutput, Collection } from "@types";
import { currentUser } from "@clerk/nextjs/server";
import { createCollectionSchema, CreateCollectionSchemaType } from "@schemas";

export type CreateCollectionInput = {
  data: CreateCollectionSchemaType;
  select?: Prisma.CollectionSelect | null;
};

export type CreateCollectionOutput = {
  collection: Collection;
};

export async function createCollection({
  data,
  select,
}: CreateCollectionInput): Promise<ActionOutput<CreateCollectionOutput>> {
  const validate = createCollectionSchema.safeParse(data);

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

    const collection = await prisma.collection.create({
      data: {
        ...data,
        userId: user.id,
      },
      select,
    });

    return {
      success: true,
      message: {
        title: "Success",
        description: "Collection created successfully",
      },
      collection: collection,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        success: false,
        validationErrors: [
          {
            field: "name",
            description:
              "You have already used this collection name, try something new!",
          },
        ],
      };
    }

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

export type GetCollectionsOutput = {
  collections: Collection[];
};

export async function getCollections(
  input: Prisma.CollectionFindManyArgs
): Promise<ActionOutput<GetCollectionsOutput>> {
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

    const collections = await prisma.collection.findMany({
      ...input,
      where: {
        ...input.where,
        userId: user.id,
      },
    });

    return {
      success: true,
      collections: collections,
    };
  } catch (error) {
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

export type DeleteCollectionInput = {
  id: number;
  select?: Prisma.CollectionSelect | null;
};

export type DeleteCollectionOutput = {
  collection: Collection;
};

export async function deleteCollection({
  id,
  select,
}: DeleteCollectionInput): Promise<ActionOutput<DeleteCollectionOutput>> {
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

    const collection = await prisma.collection.delete({
      select,
      where: {
        id,
        userId: user.id,
      },
    });

    return {
      success: true,
      collection: collection,
      message: {
        title: "Success",
        description: "Collection deleted successfully",
      },
    };
  } catch (error) {
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
