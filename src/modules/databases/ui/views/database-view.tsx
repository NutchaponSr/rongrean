"use client";

import { useQuery } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";

import { Banner } from "@/modules/databases/ui/components/banner";

interface Props {
  databaseId: string;
}

export const DatabaseView = ({ databaseId }: Props) => {
  const crpc = useCRPC();

  const { data: database } = useQuery(crpc.database.getOne.queryOptions({ databaseId }));

  if (!database) return null;
  
  return (
    <div className="z-1 flex flex-col relative overflow-auto">
      <Banner database={database} />
    </div>
  );
}