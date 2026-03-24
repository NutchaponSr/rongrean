"use client";

import { useQuery } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";

import { OrganizationView } from "@/modules/organizations/ui/views/organization-view";

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
  const crpc = useCRPC();

  const { data: activeOrganization, isPending } = useQuery(crpc.organization.getActiveOrganization.queryOptions());

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!activeOrganization?.hasOrganization) {
    return <OrganizationView />;
  }

  return <>{children}</>;
}