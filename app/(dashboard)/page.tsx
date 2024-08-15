import {
  CollectionCard,
  WelcomeMessage,
  CreateCollectionButton,
} from "@components";
import { Suspense } from "react";
import { getCollections } from "@actions";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";

export default function Home() {
  return (
    <>
      <WelcomeMessage />
      <CollectionsListWrapper />
    </>
  );
}

function CollectionsListWrapper() {
  return (
    <Suspense fallback={<h1>loading collections...</h1>}>
      <CollectionsList />
    </Suspense>
  );
}

function NoCollectionsAlert() {
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

async function CollectionsList() {
  const response = await getCollections({
    include: {
      tasks: true,
    },
  });

  if (!response.success) return null;

  if (response.collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <NoCollectionsAlert />
        <CreateCollectionButton />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionButton />
      <div className="flex flex-col w-full gap-4 mt-6">
        {response.collections.map((collection, index) => (
          <CollectionCard key={index} collection={collection} />
        ))}
      </div>
    </>
  );
}
