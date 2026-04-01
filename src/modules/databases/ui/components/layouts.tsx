import { ApiOutputs } from "@convex/api";

import { TableLayout } from "@/modules/databases/ui/components/table-layout";

import { LayoutType } from "@/modules/databases/types";

import { useLayoutStore } from "@/modules/databases/stores/use-layout-store";

interface Props {
  databaseId: string;
  properties: ApiOutputs["database"]["getOne"]["properties"];
  rows: ApiOutputs["database"]["getOne"]["rows"];
}

const layoutComponents: Record<LayoutType, React.ComponentType<Props>> = {
  "table": TableLayout
}

export const Layouts = (props: Props) => {
  const { type } = useLayoutStore();

  const LayoutComponent = layoutComponents[type];
  
  return (
    <div className="grow shrink-0 flex flex-col relative">
      <div className="z-1 grow shrink-0 h-full">
        <LayoutComponent {...props} />
      </div>
    </div>
  );
}