import { Suspense } from "react";
import { Skeleton } from "@ui/skeleton";
import { currentUser } from "@clerk/nextjs/server";

export default function WelcomeMessage() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome <br />
        <Suspense fallback={<UserNameFallback />}>
          <UserName />
        </Suspense>
      </h1>
    </div>
  );
}

async function UserName() {
  const user = await currentUser();

  return <span>{user?.fullName}</span>;
}

function UserNameFallback() {
  return (
    <Skeleton>
      <span className="opacity-0">000000000000000</span>
    </Skeleton>
  );
}
