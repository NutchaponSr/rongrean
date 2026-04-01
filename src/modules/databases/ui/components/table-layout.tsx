import { 
  useCallback, 
  useRef, 
  useState,
} from "react";
import { ApiOutputs } from "@convex/api";
import { useMutation } from "@tanstack/react-query";
import { useHover } from "@react-hooks-library/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GripVerticalIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCRPC } from "@/lib/convex/crpc";

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Hint } from "@/components/hint";

import { CellRender } from "@/modules/databases/ui/components/cell-render";
import { PropertyContent } from "@/modules/databases/ui/components/property-content";
import { CellEditorRender } from "@/modules/databases/ui/components/cell-editor-render";

import { PropertyType } from "@/modules/databases/types";
import { propertyIconMap } from "@/modules/databases/constants";
import { useTableStore } from "@/modules/databases/stores/use-table-store";

import { Id } from "../../../../../convex/functions/_generated/dataModel";
import type { PropertyValue } from "../../../../../convex/shared/zod-schema";
import { RowActionButton } from "./row-action-button";

type Cell = NonNullable<ApiOutputs["database"]["getOne"]["rows"][0]["page"]["rowProperties"]>[number]["value"];

interface Props {
  databaseId: string;
  rows: ApiOutputs["database"]["getOne"]["rows"];
  properties: ApiOutputs["database"]["getOne"]["properties"];
}

const HEIGHT = 37.25;

export const TableLayout = ({ databaseId, properties, rows }: Props) => {
  const crpc = useCRPC();

  const {
    isSelected,
    toggle,
    selectAll,
    isAllSelected,
    isIndeterminate,
  } = useTableStore();

  const addPage = useMutation(crpc.page.create.mutationOptions());

  const ref = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    overscan: 10,
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => HEIGHT,
  });

  const heightTotal = virtualizer.getTotalSize();

  const handleAddPage = useCallback(() => {
    addPage.mutate({ databaseId });
  }, [databaseId, addPage]);

  return (
    <div
      style={{ fontVariantNumeric: "lining-nums tabular-nums" }}
      className="relative float-start min-w-full select-none pb-[180px] px-24"
    >
      <div className="contain-layout">
        <div ref={ref} className="mb-3 relative">
          <div className="h-9 relative">
            <div className="flex bg-background z-87 h-9 text-secondary shadow-[-3px_0_0_#fff,inset_0_-1.25px_0_#2a1c0012] min-w-[calc(100%-200px)] inset-x-0 relative box-border">
              <SelectAll 
                isChecked={isAllSelected(rows) || isIndeterminate(rows)} 
                isIndeterminate={isIndeterminate(rows)} 
                onChange={() => selectAll(rows)} 
              />

              <div className="flex">
                <div className="inline-flex m-0">
                  {properties.map((property) => {
                    const Icon = propertyIconMap[property.type as PropertyType];

                    return (
                      <div key={property._id} className="cursor-grab flex flex-row">
                        <div className="flex relative">
                          <div
                            style={{ width: `${property.width}px` }}
                            className="flex shrink-0 overflow-hidden text-sm p-0"
                          >
                            <div className="contents">
                              <div
                                role="button"
                                className="flex items-center w-full h-full px-2 hover:bg-row transition"
                              >
                                <div className="flex items-center leading-[120%] min-w-0 text-sm gap-1.5 grow shrink basis-auto">
                                  {Icon && <Icon type={property.type} className="size-4.5 block shrink-0 text-icon-secondary stroke-[0.2]" />}
                                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {property.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-e-0 w-0 grow z-1">
                            <div className="w-1 -ms-0.5 -mt-px h-9 transition hover:bg-blue-500 bg-blue-500/0 cursor-col-resize" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center items-center h-9">
                <Popover>
                  <Hint content="Add property" side="top" align="center" sideOffset={2}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="iconSm">
                        <PlusIcon />
                      </Button>
                    </PopoverTrigger>
                  </Hint>
                  <PopoverContent className="w-[280px]">
                    <PropertyContent databaseId={databaseId} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {rows.length > 0 ? (
            <>
              <div className="relative min-w-[calc(100%-200px)] isolation-auto">
                <div style={{ height: `${heightTotal}px` }} className="w-full relative">
                  {virtualizer.getVirtualItems().map((item) => {
                    const row = rows[item.index];
                    const isChecked = isSelected(row);

                    return (
                      <div
                        key={item.index}
                        style={{
                          height: item.size,
                          transform: `translateY(${item.start}px)`,
                        }}
                        className="absolute top-0 inset-s-0 w-full group/row"
                      >
                        <div className="flex h-full relative">
                          <div className="flex w-full border-b border-border">
                            <div className="flex">
                              <SideMenu 
                                isChecked={isChecked} 
                                properties={properties} 
                                row={row}
                                onChange={() => toggle(row)} 
                              />
                              {properties.map((property) => {
                                const value = row.page.rowProperties?.find((rp) => rp.propertyId === property._id);
                                
                                return (
                                  <TableCell 
                                    key={property._id}
                                    value={value?.value}
                                    property={property}
                                    pageId={row.pageId}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex w-16 border-b border-border justify-start grow" />
                          <div data-selected={isChecked} className="bg-blue-500/14 absolute pointer-events-none bottom-px z-86 rounded opacity-0 data-[selected=true]:opacity-100! transition-opacity w-full h-9" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center h-[37.25px] w-fit ps-2 leading-5 gap-1 sticky inset-s-24">
                <Button variant="ghost" size="sm" onClick={handleAddPage}>
                  <PlusIcon className="size-4 text-icon-tertiary" />
                  New page
                </Button>
              </div>
            </>
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                role="button"
                tabIndex={index}
                onClick={handleAddPage}
                onMouseEnter={() => setHoveredIndex(index)}
                className="select-none flex items-center h-[37.5px] w-[calc(100%-8px)] ps-0 leading-5 transition border-b border-border"
              >
                <span className="text-sm text-tertiary inline-flex h-full items-center opacity-100 transition-opacity">
                {properties.map((property, idx) => (
                    <div
                    key={property._id} 
                    style={{ width: `${property.width}px` }}
                      className="flex h-full relative border-e border-border"
                    >
                      {idx === 0 && (
                      <div className={cn(
                            "flex items-center ps-2 min-w-25 transition-opacity",
                            hoveredIndex === index ? "opacity-100" : "opacity-0"
                          )}
                        >
                          <PlusIcon className="size-4 text-icon-tertiary me-2" />
                          New page
                        </div>
                      )}
                    </div>
                  ))}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const TableCell = ({
  value,
  property,
  pageId,
}: {
  value: Cell | undefined;
  pageId: Id<"page">;
  property: ApiOutputs["database"]["getOne"]["properties"][0];
}) => {
  const crpc = useCRPC();

  const updateCell = useMutation(crpc.row.update.mutationOptions());

  const handleSave = useCallback((value: PropertyValue) => {
    updateCell.mutate({ pageId, propertyId: property._id, value });
  }, [pageId, property._id, updateCell]);

  return (
    <div
      data-cell={`${pageId}_${property._id}`}
      style={{ width: `${property.width}px` }}
      className="flex h-full relative border-e border-border opacity-100 group/cell"
    >
      <div
        style={{ width: `${property.width}px` }}
        className="flex overflow-clip h-full opacity-100"
      >
        <Popover>
          <PopoverTrigger asChild>
            <div
              role="button"
              className="relative block text-sm leading-normal overflow-clip w-full whitespace-nowrap h-9 min-h-9 cursor-pointer px-2 py-1.5"
            >
              <CellRender cell={value} property={property} />
            </div>
          </PopoverTrigger>
          <PopoverContent style={{ width: `${property.width}px` }} align="start" side="bottom" sideOffset={-36}>
            <div className="h-full p-2 flex flex-col justify-between grow text-sm relative">
              <CellEditorRender cell={value} property={property} onSave={handleSave} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

const SideMenu = ({ 
  row,
  isChecked,
  properties,
  onChange
}: { 
  row: ApiOutputs["database"]["getOne"]["rows"][0];
  isChecked: boolean;
  properties: ApiOutputs["database"]["getOne"]["properties"];
  onChange: () => void;
}) => {
  return (
    <>
      <div className="sticky inset-s-9 z-85 flex">
        <div className={cn(
          "opacity-0 transition-opacity group-hover/row:opacity-70", 
          isChecked && "opacity-100!"
        )}>
          <div className="absolute -inset-s-9">
            <div className="h-full items-center justify-center flex cursor-pointer">
              <div className="size-9 flex items-center justify-center">
                <Checkbox checked={isChecked} onCheckedChange={onChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky inset-s-9 z-85 flex">
        <div className="group-hover/row:opacity-100 transition-opacity opacity-0">
          <div className="absolute -inset-s-[82px] top-1">
            <div className="h-full items-center justify-center flex cursor-pointer">
              <Button variant="ghost" size="iconXs">
                <PlusIcon className="text-icon-tertiary" />
              </Button>
              <RowActionButton align="center" side="left" row={row} properties={properties}>
                <Button variant="ghost" size="iconSm" className="w-5">    
                  <GripVerticalIcon className="text-icon-tertiary" />
                </Button>
              </RowActionButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const SelectAll = ({ 
  isChecked,
  isIndeterminate,
  onChange
}: { 
  isChecked: boolean;
  isIndeterminate: boolean;
  onChange: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useHover(ref);

  return (
    <div className="sticky inset-s-9 z-83 flex">
      <div className="absolute -inset-s-9">
        <div className={cn(
          "h-full opacity-0 transition-opacity", 
          isHovered && "opacity-100",
          isChecked && "opacity-100!",
        )}>
          <div ref={ref} className="h-full items-start justify-center flex cursor-pointer">
            <div className="size-9 flex items-center justify-center">
              <Checkbox 
                checked={isChecked ? true : isIndeterminate ? "indeterminate" : false}
                onCheckedChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}