import { InvitationView } from "@/modules/organizations/ui/views/invitation-view";

const Page = async (props: PageProps<"/invite/[invitationId]">) => {
  const { invitationId } = await props.params;

  return <InvitationView invitationId={invitationId} />
}

export default Page;