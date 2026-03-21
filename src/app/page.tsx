"use client";

import { Button } from "@/components/ui/button";
import { useCRPC } from "@/lib/convex/crpc";
import { useMutation, useQuery } from "@tanstack/react-query";

const Page = () => {
  const crpc = useCRPC();

  const { data: users } = useQuery(crpc.user.list.queryOptions({ limit: 10 }));

  const create = useMutation(crpc.user.create.mutationOptions());

  return (
    <div>
      <div>
        {users?.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <Button onClick={() => create.mutate({ name: "John Doe", email: "john.doe@example.com" })}>Create</Button>
    </div>
  );
}

export default Page;