import { SidebarProvider } from "@/components/contexts/sidebar-context";
import { Sidebar } from "@/components/sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/organizations/ui/components/organization-guard";

const Layout = (props: LayoutProps<"/">) => {
  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider>
          <Sidebar />
          <div className="order-3 flex flex-col w-full overflow-hidden isolation-auto relative">
            {props.children}
          </div>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
}

export default Layout;