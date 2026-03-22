import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

import { Client } from "./client";

const Page = () => {
  return (
    <AuthGuard>
      <Client />
    </AuthGuard>
  );
}

export default Page;