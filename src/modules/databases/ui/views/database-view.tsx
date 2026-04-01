"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";

import { Menu } from "@/modules/databases/ui/components/menu";
import { Banner } from "@/modules/databases/ui/components/banner";
import { Layouts } from "@/modules/databases/ui/components/layouts";

interface Props {
  databaseId: string;
}

export const DatabaseView = ({ 
  databaseId, 
}: Props) => {
  const crpc = useCRPC();

  const { data: database } = useSuspenseQuery(crpc.database.getOne.queryOptions({ databaseId }));
  const { data: organization } = useSuspenseQuery(crpc.organization.getActiveOrganization.queryOptions());

  return (
    <div className="z-1 flex flex-col relative overflow-auto">
      <Banner database={database} customIcons={organization.customIcons || []} />
      <div className="contents">
        <Menu properties={database.properties} />
        <Layouts databaseId={databaseId} properties={database.properties} rows={database.rows} />
      </div>
    </div>
  );
}