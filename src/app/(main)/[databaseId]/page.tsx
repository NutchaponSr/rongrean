import { crpc, prefetch, HydrateClient } from "@/lib/convex/rsc";

import { DatabaseView } from "@/modules/databases/ui/views/database-view";

const Page = async (props: PageProps<"/[databaseId]">) => {
  const { databaseId } = await props.params;

  prefetch(crpc.database.getOne.queryOptions({ databaseId }));

  return (
    <DatabaseView databaseId={databaseId} />
  );
}

export default Page;