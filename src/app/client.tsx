"use client";

import { useRouter } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";
import { authClient, useSignOutMutationOptions } from "@/lib/convex/auth-client";

import { Button } from "@/components/ui/button";

export const Client = () => {
  const crpc = useCRPC();
  const router = useRouter();
  
  const { data: user } = useSuspenseQuery(crpc.user.getCurrentUser.queryOptions());

  const signOut = useMutation(useSignOutMutationOptions());

  const onSignOut = () => {
    signOut.mutate({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  }

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Button onClick={onSignOut}>Sign Out</Button>
    </>
  )
}