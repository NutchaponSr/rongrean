import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ApiOutputs } from "@convex/api";
import { BsArrow90DegRight, BsBoxArrowUpRight, BsEmojiSmile, BsListUl, BsTrash3 } from "react-icons/bs";
import { GoComment, GoCopy, GoLink, GoStar } from "react-icons/go";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { propertyIconMap } from "../../constants";
import { PropertyType } from "../../types";
import { CellEditorRender } from "./cell-editor-render";
import { VscLayoutSidebarRight } from "react-icons/vsc";

type Property = ApiOutputs["database"]["getOne"]["properties"][0];

interface AnchorPos {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  row: ApiOutputs["database"]["getOne"]["rows"][0];
  properties: ApiOutputs["database"]["getOne"]["properties"];
}

export const RowActionButton = ({ 
  children, 
  row,
  properties, 
  ...props 
}: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorPos, setAnchorPos] = useState<AnchorPos | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const portalRef = useRef<HTMLDivElement>(null);

  const handlePropertyClick = useCallback((property: Property, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setAnchorPos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setSelectedProperty(property);
    setTimeout(() => setPopoverOpen(true), 150);
  }, []);

  const propertyId = properties.find((property) => property._id === selectedProperty?._id)?._id;

  const cell = row.page.rowProperties?.find((cell) => cell.propertyId === propertyId)?.value;

  useEffect(() => {
    if (!popoverOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (portalRef.current && !portalRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [popoverOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent {...props} className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Page</DropdownMenuLabel>
            <DropdownMenuItem>
              <GoStar className="stroke-[0.2]" />
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BsEmojiSmile className="stroke-[0.2]" />
              Edit icon
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BsListUl className="stroke-[0.2]" />
                Edit property
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent sideOffset={8} className="w-48">
                  {properties?.map((property) => {
                    const Icon = propertyIconMap[property.type as PropertyType];

                    return (
                      <DropdownMenuItem key={property._id} onClick={(e) => handlePropertyClick(property, e.currentTarget)}>
                        <Icon className="stroke-[0.2]" />
                        {property.name}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BsBoxArrowUpRight className="stroke-[0.2]" />
                Open in
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent sideOffset={8} className="w-48">
                  <DropdownMenuItem>
                    <BsBoxArrowUpRight className="stroke-[0.2]" />
                    New tab
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <VscLayoutSidebarRight className="stroke-[0.2]" />
                    Side peek
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <GoComment className="stroke-[0.2]" />
              Comment
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <GoLink className="stroke-[0.2]" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GoCopy className="stroke-[0.2]" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BsArrow90DegRight className="stroke-[0.2]" />
              Move to
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <BsTrash3 className="stroke-[0.2]" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="w-full min-h-7 select-none gap-2 flex flex-col justify-center px-2 text-sm leading-[120%]">
            <div className="min-w-0 m-0 grow shrink basis-auto">
              <div className="leading-4 text-xs text-tertiary my-1">
                Last edited by Pondpopza
              </div>
              <div className="my-1 overflow-hidden whitespace-nowrap leading-4 text-xs text-tertiary">
                Today at 4:03 PM
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {popoverOpen && selectedProperty && anchorPos && createPortal(
        <div
          ref={portalRef}
          style={{
            position: "fixed",
            left: anchorPos.left,
            top: anchorPos.top+16,
            zIndex: 9998,
            minWidth: "max-content",
          }}
        >
          <div style={{ width: `${selectedProperty.width}px` }} className="rounded bg-popover text-sm text-primary shadow-[0_20px_24px_0_#1919190d,0_5px_8px_0_rgba(25,25,25,.029),0_0_0_1.25px_#2a1c0012] slide-in-from-bottom-2">
            <div className="p-2 flex flex-col items-center justify-between grow text-sm relative">
              <CellEditorRender 
                property={selectedProperty} 
                cell={cell} 
                onSave={() => {}} 
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
