"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";

import { Button } from "@/components/ui/button";

interface Props {
  invitationId: string;
}

export const InvitationView = ({ invitationId }: Props) => {
  const crpc = useCRPC();
  const router = useRouter();

  const accept = useMutation(crpc.organization.accept.mutationOptions({
    meta: { errorMessage: "Failed to accept invitation" },
    onSuccess: () => {
      router.push("/");
    },
  }));
  const reject = useMutation(crpc.organization.reject.mutationOptions({
    meta: { errorMessage: "Failed to reject invitation" },
    onSuccess: () => {
      router.push("/");
    },
  }));
  
  return (
    <div>
      <Button onClick={() => accept.mutate({ invitationId })}>Accept</Button>
      <Button onClick={() => reject.mutate({ invitationId })}>Reject</Button>
    </div>
  )
}