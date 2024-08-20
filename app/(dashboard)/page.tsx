import {
  WelcomeMessage,
  CollectionCard,
  CreateCollectionButton,
} from "@components";
import { fetch } from "@lib";
import { Suspense } from "react";
import { getCollections } from "@actions";
import { currentUser } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";

const fetchCollections = fetch(getCollections, ["getCollections"], {
  tags: ["getCollections"],
});

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  return (
    <div className="flex flex-col space-y-5">
      <WelcomeMessage />
      <NoCollectionsAlertWrapper userId={user.id} />
      <CreateCollectionButton />
      <CollectionsListWrapper userId={user.id} />
    </div>
  );
}

function NoCollectionsAlertWrapper({ userId }: { userId: string }) {
  return (
    <Suspense>
      <NoCollectionsAlert userId={userId} />
    </Suspense>
  );
}

async function NoCollectionsAlert({ userId }: { userId: string }) {
  const response = await fetchCollections({
    where: {
      userId,
    },
    include: {
      tasks: true,
    },
  });

  if (!response.success || response.collections.length > 0) return null;

  return (
    <Alert>
      <svg
        fill="none"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        className="size-6"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
        />
      </svg>

      <AlertTitle>There are not collections yet!</AlertTitle>
      <AlertDescription>Create a collection to get started</AlertDescription>
    </Alert>
  );
}

function CollectionsListWrapper({ userId }: { userId: string }) {
  return (
    <Suspense fallback={<h1>loading collections...</h1>}>
      <CollectionsList userId={userId} />
    </Suspense>
  );
}

async function CollectionsList({ userId }: { userId: string }) {
  const response = await fetchCollections({
    where: {
      userId,
    },
    include: {
      tasks: true,
    },
  });

  if (!response.success) return null;
  if (response.collections.length === 0) return null;

  return (
    <div className="flex flex-col w-full gap-4">
      {response.collections.map((collection, index) => (
        <CollectionCard key={index} collection={collection} />
      ))}
    </div>
  );
}
