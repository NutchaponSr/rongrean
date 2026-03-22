import { Toaster } from "sonner";

import { caller, crpc, HydrateClient, prefetch } from "@/lib/convex/rsc";
import { BetterConvexProvider } from "@/lib/convex/convex-provider";

export async function Providers({ children }: { children: React.ReactNode }) {
  const token = await caller.getToken();

  prefetch(crpc.user.getCurrentUser.queryOptions(undefined, { skipUnauth: true }));

  return (
    <BetterConvexProvider token={token}>
      <HydrateClient>
        {children}
        <Toaster />
      </HydrateClient>
    </BetterConvexProvider>
  );
}