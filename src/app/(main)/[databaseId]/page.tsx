import { DatabaseView } from "@/modules/databases/ui/views/database-view";

const Page = async (props: PageProps<"/[databaseId]">) => {
  const { databaseId } = await props.params;

  return <DatabaseView databaseId={databaseId} />
}

export default Page;