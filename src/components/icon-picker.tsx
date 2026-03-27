"use client";

import icons from "../constants/emojis.json";

import { AppleIcon, CircleCheckIcon, CirclePlusIcon, Clock9Icon, FlagIcon, LayoutGridIcon, LeafIcon, LightbulbIcon, PlaneIcon, PlusIcon, SmileIcon, VolleyballIcon, type LucideIcon } from "lucide-react";
import { BsImage, BsShuffle } from "react-icons/bs";
import { useDebounce } from "@react-hooks-library/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useState, useRef, useMemo, useEffect } from "react";

import { cn, formatCategory, formatName } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { Hint } from "@/components/hint";
import { TabsMenu } from "@/components/tabs-menu";
import { SearchInput } from "@/components/saerch-input";

import { useDatabaseStore } from "@/modules/databases/stores/use-database-store";
import { useMutation as useConvexMutation } from "convex/react";
import { api } from "../../convex/functions/_generated/api";
import { useCRPC } from "@/lib/convex/crpc";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Icon } from "./icon";

interface Props {
  open: boolean;
  children: React.ReactNode;
  customIcons?: Array<string>;
  onRemove: () => void;
  onChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
}

type VirtualItemType = 
  | {
    type: "header";
    label: string;
  } | {
    type: "row";
    items: {
      name: string;
      category: string;
    }[];
  }

const CATEGORIES = Object.keys(icons) as (keyof typeof icons)[];
const ALL_EMOJIS = CATEGORIES.flatMap((c) => Object.values(icons[c]).map((n) => ({ name: n, category: c as string })));

const CATEGORIES_ICONS: Record<string, LucideIcon> = {
  "recent": Clock9Icon,
  "people": SmileIcon,
  "animals-and-nature": LeafIcon,
  "food-and-drink": AppleIcon,
  "activity": VolleyballIcon,
  "travel-and-places": PlaneIcon,
  "objects": LightbulbIcon,
  "symbols": CircleCheckIcon,
  "flags": FlagIcon,
  "custom": LayoutGridIcon,
  "add-emoji": CirclePlusIcon
};

const COLS = 12;
const ICON_SIZE = 24;
const HEADER_H = 33.5;
const ROW_H = 32;

export const IconPicker = ({ 
  open,
  children,
  customIcons = [],
  onRemove,
  onChange,
  onOpenChange,
}: Props) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-[408px] min-w-[180px] max-w-[calc(-24px+100vw)] max-h-[70vh]">
        <TabsMenu 
          triggers={[
            {
              value: "emoji",
              label: "Emoji",
              content: <EmojiContent onChange={onChange} customIcons={customIcons} />
            },
            {
              value: "upload",
              label: "Upload",
              content: <UploadContent onOpenChange={onOpenChange} />
            }
          ]}
          customMenu={
            <Button variant="ghost" size="sm" onClick={onRemove}>
              Remove
            </Button>
          }
        />
      </PopoverContent>
    </Popover>
  );
}

const EmojiContent = ({
  onChange,
  customIcons,
}: {
  customIcons: Array<string>;
  onChange: (name: string) => void;
}) => {
  const { recentIcons } = useDatabaseStore();
  const crpc = useCRPC();
  const generateUploadUrl = useConvexMutation(api.upload.generateUploadUrl);
  const addCustomIcon = useMutation(crpc.organization.addCustomIcon.mutationOptions());
  const customFileInputRef = useRef<HTMLInputElement>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState<string>("recent");

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 200);

  const virtualData = useMemo(() => {
    const items: VirtualItemType[] = [];
    const q = debouncedSearch.toLowerCase().trim();

    if (recentIcons.length > 0 && !q) {
      items.push({ type: "header", label: "recent" });
      const reecntItems = recentIcons.map((icon) => ({ name: icon, category: "recent" }));

      for (let i = 0; i < reecntItems.length; i += COLS) {
        items.push({ type: "row", items: reecntItems.slice(i, i + COLS) });
      }
    }

    CATEGORIES.forEach((cat) => {
      const categoryEmoji = ALL_EMOJIS.filter((e) => 
        e.category === cat && (!q || e.name.includes(q))
      );

      if (categoryEmoji.length > 0) {
        items.push({ type: "header", label: cat });
      }

      for (let i = 0; i < categoryEmoji.length; i += COLS) {
        items.push({
          type: "row",
          items: categoryEmoji.slice(i, i + COLS),
        });
      }
    });

    // Always show custom section so the "Add" button is accessible
    items.push({ type: "header", label: "custom" });
    const customItems = customIcons.map((icon) => ({ name: icon, category: "custom" }));
    const allCustomItems = [{ name: "__add__", category: "custom" }, ...customItems];

    for (let i = 0; i < allCustomItems.length; i += COLS) {
      items.push({ type: "row", items: allCustomItems.slice(i, i + COLS) });
    }

    return items;
  }, [debouncedSearch, recentIcons, customIcons]);

  const categoryStartIndices = useMemo(() => {
    const mapping: Record<string, number> = {};
    virtualData.forEach((item, index) => {
      if (item.type === "header" && !(item.label in mapping)) {
        mapping[item.label] = index;
      }
    });
    return mapping;
  }, [virtualData]);

  // Pre-compute absolute pixel position of every item from fixed heights
  const itemStartPositions = useMemo(() => {
    const positions: number[] = [];
    let acc = 0;
    for (const item of virtualData) {
      positions.push(acc);
      acc += item.type === "header" ? HEADER_H : ROW_H;
    }
    return positions;
  }, [virtualData]);

  const virtualizer = useVirtualizer({
    overscan: 10,
    count: virtualData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = virtualData[index];
      return item?.type === "header" ? HEADER_H : ROW_H;
    },
  });

  const scrollToCategory = (cat: string) => {
    const index = categoryStartIndices[cat];
    if (index !== undefined) {
      virtualizer.scrollToIndex(index, { align: "start" });
    }
  };

  const handleCustomFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await generateUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await res.json();
    await addCustomIcon.mutateAsync({ icon: storageId });
  };

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      let active = "";
      // Walk all items — last header whose pixel start <= scrollTop wins
      virtualData.forEach((item, index) => {
        if (item.type === "header" && itemStartPositions[index] <= scrollTop + 1) {
          active = item.label;
        }
      });
      if (active) setActiveCategory(active);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [virtualData, itemStartPositions]);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={customFileInputRef}
        onChange={handleCustomFileChange}
      />
      <div className="my-1.5">
        <div className="flex items-center gap-2 leading-[120%] select-none w-full min-h-7 text-sm px-2 py-1">
          <div className="mx-0 min-w-0 grow shrink basis-auto">
            <SearchInput 
              placeholder="filter..." 
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
            />
          </div>
          <div className="ms-auto min-w-0 shrink-0">
            <div className="flex gap-1.5">
              <Hint content="Random" side="bottom" align="center" sideOffset={4}>
                <Button variant="outline" size="iconSm">
                  <BsShuffle className="shrink-0 block stroke-[-0.25]" />
                </Button>
              </Hint>
            </div>
          </div>
        </div>
      </div>
      <div className="grow min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col w-full h-full">
          <div ref={parentRef} className="w-full grow max-h-[305px] pb-1.5 overflow-y-auto overflow-x-hidden">
            <div className="w-full relative" style={{ height: `${virtualizer.getTotalSize()}px` }}>
              <div role="grid" className="items-stretch w-full relative h-full">
                {virtualizer.getVirtualItems().map((vItem, index) => {
                  const item = virtualData[vItem.index];
                  
                  return (
                    <div 
                      key={index}
                      style={{ 
                        height: vItem.size,
                        transform: `translateY(${vItem.start}px)` 
                      }}
                      className="absolute top-0 inset-s-0 w-full"
                    >
                      <div data-index={index}>
                        {item.type === "header" ? (
                          <div className="flex px-2 mt-1.5 mb-2 text-secondary fill-icon-secondary text-xs font-medium leading-[100%] select-none pt-1.5">
                            <div className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                              {formatCategory(item.label)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col flex-wrap bg-transparent px-3">
                            <div role="row" className="flex">
                              {item.items.map((emoji, idx) => {
                                const isCustom = emoji.category.toLowerCase() === "custom";
                                const isAddButton = emoji.name === "__add__";

                                return (
                                  <div className="contents" key={idx}>
                                    {isAddButton ? (
                                      <Popover>
                                        <Hint content="Add emoji" side="bottom" align="center" sideOffset={4}>
                                          <PopoverTrigger asChild>
                                            <div
                                              role="gridcell"
                                              className="flex items-center justify-center size-8 rounded-full transition hover:bg-accent cursor-pointer select-none text-muted-foreground hover:text-primary border border-border m-0.5"
                                            >
                                              <PlusIcon className="size-4 shrink-0 text-icon-secondary" />
                                            </div>
                                          </PopoverTrigger>
                                        </Hint>
                                        <PopoverContent>
                                          <UploadContent showHeader onOpenChange={() => {}} />
                                        </PopoverContent>
                                      </Popover>
                                    ) : isCustom ? (
                                      <div 
                                        role="gridcell" 
                                        onClick={() => onChange(emoji.name)}
                                        className="flex items-center justify-center size-8 rounded transition hover:bg-accent cursor-pointer select-none"
                                      > 
                                        <Icon name={emoji.name} className="object-cover size-6" />
                                      </div>
                                    ) : (
                                      <Hint content={formatName(emoji.name)} side="bottom" align="center" sideOffset={4}>
                                        <div 
                                          role="gridcell" 
                                          onClick={() => onChange(emoji.name)}
                                          className="flex items-center justify-center size-8 rounded transition hover:bg-accent cursor-pointer select-none"
                                        > 
                                          <Icon name={emoji.name} />
                                        </div>
                                      </Hint>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-border flex justify-between py-2 px-3">
            {Object.entries(CATEGORIES_ICONS).map(([cat, NavIcon]) => {
              const isCustom = cat.toLowerCase() === "add-emoji";

              if (isCustom) {
                return (
                  <Popover key={cat}>
                    <Hint content="Add emoji" side="bottom" align="center" sideOffset={4}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                        >
                          <NavIcon className="size-5 shrink-0 stroke-[1.75]" />
                        </Button>
                      </PopoverTrigger>
                    </Hint>
                    <PopoverContent>
                      <UploadContent showHeader onOpenChange={() => {}} />
                    </PopoverContent>
                  </Popover>
                );
              }

              return (
                <Hint key={cat} content={formatCategory(cat)} side="bottom" align="center" sideOffset={4}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => scrollToCategory(cat)}
                    className={cn(activeCategory === cat && "bg-accent text-primary")}
                  >
                    <NavIcon className="size-5 shrink-0 stroke-[1.75]" />
                  </Button>
                </Hint>
              );
            })}
          </div>
        </div>
      </div> 
    </>
  );
}

const UploadContent = ({
  onOpenChange,
  showHeader = false,
}: {
  showHeader?: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const crpc = useCRPC();

  const generateUploadUrl = useConvexMutation(api.upload.generateUploadUrl);

  const addCustomIcon = useMutation(crpc.organization.addCustomIcon.mutationOptions());

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const onSave = async () => {
    const url = await generateUploadUrl();

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });

    const { storageId } = await res.json();

    await addCustomIcon.mutateAsync({ icon: storageId });
  }

  return (
    <div className="flex flex-col min-w-70 max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
      <div className="grow min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="px-4 flex flex-col text-sm">
          {showHeader && (
            <>
              <div className="text-sm mt-3 font-semibold">Add custom emoji</div>
              <div className="mt-0.5 text-secondary text-xs">Custom emoji can be used by anyone in your workspace</div>
            </>
          )}

          <div className="flex flex-col mt-5 items-stretch">
            <div className="contents">
              <input type="file" className="hidden" ref={inputRef} onChange={handleFileChange} />
              <div className="rounded bg-secondary-accent">
                {!file ? (
                  <div
                    role="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center justify-center h-full rounded px-2 whitespace-nowrap text-sm leading-[1.2] text-secondary min-w-0 shrink-0 flex-row gap-2 p-3.5 hover:bg-muted transition"
                  >
                    <BsImage className="size-4.5 block shrink-0" />
                    Upload a image
                  </div>
                ) : (
                  <div className="flex flex-col p-4 items-center gap-1">
                    <div className="text-xs text-secondary mb-1">Preview</div>
                    <div className="flex items-center gap-1.5">
                      <Image 
                        src={URL.createObjectURL(file)}
                        alt="Preview Light"
                        width={80}
                        height={80}
                        className="size-20 p-1.5 rounded border border-border object-cover bg-white"
                      />
                      <Image 
                        src={URL.createObjectURL(file)}
                        alt="Preview Dark"
                        width={80}
                        height={80}
                        className="size-20 p-1.5 rounded border border-border object-cover bg-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2.5 text-tertiary text-center text-xs">or Ctrl+V to paste an image or link</div>
          <div className="mt-4 mb-3 flex flex-row gap-2 justify-between items-center">
            {!file ? (
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Back
              </Button>
            )}
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// const Icon = ({
//   name,
//   size = ICON_SIZE,
// }: {
//   name: string;
//   size: number;
// }) => {
  
//   return (
    // <div className="contents">
    //   <Hint content={formatCategory(name)} side="bottom" align="center" sideOffset={4}>
    //     <div role="gridcell" className="flex items-center justify-center size-8 rounded transition hover:bg-accent cursor-pointer select-none">
    //       <Image 
    //         src={iconUrl(name)}
            
    //       />
    //     </div>
    //   </Hint>
    // </div>
//   );
// }