import React from "react";

import { GoComment, GoFile } from "react-icons/go";
import { ApiOutputs } from "@convex/api";

import { Cell, PropertyType } from "../../types";
import { VscLayoutSidebarRight  } from "react-icons/vsc";

type Property = ApiOutputs["database"]["getOne"]["properties"][0];

interface CellProps {
  cell: Cell | undefined;
  property: Property;
}

type CellValue = NonNullable<Cell>;

function getCellValue<T extends CellValue["type"]>(
  cell: Cell | undefined,
  type: T
): Extract<CellValue, { type: T }> | null {
  if (!cell || cell.type !== type) return null;
  return cell as Extract<CellValue, { type: T }>;
}

const TitleCell = ({ cell }: CellProps) => {
  const value = getCellValue(cell, "title");

  if (!value) return null;

  return (
    <>
      <div className="flex justify-end absolute top-1.5 inset-x-0 z-2 mx-1 pointer-events-none">
        <div className="sticky flex pointer-events-auto bg-background p-0.5 h-6 shadow-[0_8px_12px_0_#19191907,0_2px_6px_0_#19191907,0_0_0_1.25px_#2a1c0012] rounded inset-e-1 group-hover/row:opacity-100 opacity-0 transition-opacity">
          <div
            role="button"
            className="text-secondary text-xs font-medium uppercase tracking-wide rounded h-5 flex items-center gap-1 px-1 hover:bg-muted transition-colors"
          >
            <VscLayoutSidebarRight className="text-icon-secondary size-3.5 stroke-[0.2]" />
            Open
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-px h-full">
        <div className="shrink-0">
          <div
            role="button"
            style={{ verticalAlign: "text-top" }}
            className="inline-flex items-center justify-center size-5.5 me-1 -mt-[3px]"
          >
            <GoFile className="size-4.5 text-icon-tertiary stroke-[0.2]" />
          </div>
        </div>
        <div className="grow min-w-0">
          <span className="leading-normal whitespace-nowrap wrap-break-word inline font-medium me-1">
            {value.value}
          </span>
        </div>
      </div>
    </>
  );
};

const TextCell = ({ cell }: CellProps) => {
  const value = getCellValue(cell, "text");

  if (!value) return null;

  return (
    <>
      {!!value.value && (
        <div className="flex justify-end absolute top-1.5 inset-x-0 z-2 mx-1 pointer-events-none">
          <div className="sticky flex pointer-events-auto bg-background p-0.5 h-6 shadow-[0_8px_12px_0_#19191907,0_2px_6px_0_#19191907,0_0_0_1.25px_#2a1c0012] rounded inset-e-1 group-hover/cell:opacity-100 opacity-0 transition-opacity">
            <div
              role="button"
              className="text-secondary text-xs font-medium uppercase tracking-wide rounded h-5 flex items-center gap-1 px-1 hover:bg-muted transition-colors"
            >
              <GoComment className="text-icon-secondary size-3.5 stroke-[0.2]" />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-start gap-px h-full">
        <span className="leading-normal whitespace-nowrap wrap-break-word">{value.value}</span>
      </div>
    </>
  );
};

const cellComponents: Partial<Record<PropertyType, React.ComponentType<CellProps>>> = {
  title: TitleCell,
  text: TextCell,
};

export const  CellRender = ({ cell, property }: CellProps) => {
  const Component = cellComponents[property.type as PropertyType];
  
  if (!Component) return null;

  return <Component cell={cell} property={property} />;
};
