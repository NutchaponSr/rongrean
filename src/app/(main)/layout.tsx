import { SidebarProvider } from "@/components/contexts/sidebar-context";
import { Sidebar } from "@/components/sidebar";
import { crpc, HydrateClient, prefetch } from "@/lib/convex/rsc";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/organizations/ui/components/organization-guard";

const Layout = async (props: LayoutProps<"/">) => {
  prefetch(crpc.database.getMany.queryOptions());

  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider>
          <HydrateClient>
            <Sidebar />
          </HydrateClient>
          <div className="order-3 flex flex-col w-full overflow-hidden isolation-auto relative">
            {props.children}
          </div>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
}

export default Layout;