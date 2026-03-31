import { ApiOutputs } from "@convex/api";
import { BsTrash3 } from "react-icons/bs";
import { MoreHorizontalIcon } from "lucide-react";

import { useTableStore } from "../../stores/use-table-store";

interface Props {
  properties: ApiOutputs["database"]["getOne"]["properties"];
}

export const Menu = ({ }: Props) => {
  const { selectedRows } = useTableStore();

  return (
    <div data-selected={selectedRows.size > 0} className="sticky top-px inset-s-24 z-999 invisible data-[selected=true]:visible! w-fit opacity-0 transition-opacity data-[selected=true]:opacity-100!">
      <div className="inline-flex justify-center items-center rounded bg-popover shadow-[0_8px_12px_0_#19191907,0_2px_6px_0_#19191907,0_0_0_1.25px_#2a1c0012] h-8">
        <div
          role="button"
          className="flex items-center justify-center text-blue-500 text-sm whitespace-nowrap h-full px-2.5 rounded-s shadow-[1.25px_0_0_#2a1c0012] me-px hover:bg-accent"
        >
          {selectedRows.size} Selected
        </div>
        <div
          role="button"
          className="flex items-center justify-center hover:text-destructive text-sm whitespace-nowrap h-full px-1.5 shadow-[1.25px_0_0_#2a1c0012] me-px hover:bg-accent"
        >
          <BsTrash3 className="size-4 stroke-[0.2]" />
        </div>
        <div
          role="button"
          className="flex items-center justify-center text-sm rounded-e whitespace-nowrap h-full px-1.5 hover:bg-accent"
        >
          <MoreHorizontalIcon className="size-4" />
        </div>
      </div>
    </div>
  );
}