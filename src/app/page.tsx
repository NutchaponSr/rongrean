import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/organizations/ui/components/organization-guard";

import { Client } from "./client";

const Page = () => {
  return (
    <AuthGuard>
      <OrganizationGuard>
        <Client />
      </OrganizationGuard>
    </AuthGuard>
  );
}

export default Page;