"use client";

import { 
  BsEmojiSmileFill, 
  BsImageFill, 
  BsInfoCircleFill 
} from "react-icons/bs";
import { ApiOutputs } from "@convex/api";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { cn, getRandomIcon } from "@/lib/utils";
import { useCRPC } from "@/lib/convex/crpc";

import { Button } from "@/components/ui/button";

import { IconPicker } from "@/components/icon-picker";
import { ElementEdit } from "@/components/element-edit";

import { useDatabaseStore } from "@/modules/databases/stores/use-database-store";

import { CoverImage } from "@/modules/databases/ui/components/cover-image";
import { Icon } from "@/components/icon";

interface Props {
  database: ApiOutputs["database"]["getOne"];
  customIcons: Array<string>;
}

export const Banner = ({ database, customIcons }: Props) => {
  const crpc = useCRPC();

  const [open, setOpen] = useState(false);

  const updateDatabase = useMutation(crpc.database.update.mutationOptions());

  const { toggles, onToggle, addRecentIcon } = useDatabaseStore();

  const updateTitle = useCallback((value: string) => {
    updateDatabase.mutate({ databaseId: database._id, title: value });
  }, [database._id]);

  const updateDescription = useCallback((value: string) => {
    updateDatabase.mutate({ databaseId: database._id, description: value });
  }, [database._id]);

  const addCoverImage = useCallback((value: string | null) => {
    updateDatabase.mutate({ databaseId: database._id, coverImage: value, position: 0 });
  }, [database._id]);

  const savePosition = useCallback((position: number) => {
    updateDatabase.mutate({ databaseId: database._id, position: position });
  }, [database._id]);

  const addIcon = useCallback(() => {
    updateDatabase.mutate({ databaseId: database._id, icon: getRandomIcon() });

    setTimeout(() => {
      setOpen(true);
    }, 200);
  }, [database._id, addRecentIcon]);

  const hasIcon = useMemo(() => !!database.icon, [database.icon]);
  const hasCoverImage = useMemo(() => !!database.coverImage, [database.coverImage]);

  return (
    <div className="w-full flex flex-col items-center shrink-0 grow-0 sticky inset-s-0 group/banner">
      <CoverImage 
        onSave={savePosition}
        initialPosition={database.position || 0}
        src={database.coverImage || null} 
        onChange={addCoverImage} 
      />
      <div className="max-w-full ps-24 w-full duration-200 transition-[width] ease-[ease]">
        <div className={cn(
          "flex py-1 justify-start flex-wrap -ms-px text-tertiary pointer-events-auto group-hover/banner:opacity-100 opacity-0 transition-opacity duration-200 ease-[ease]",
          hasCoverImage && "pt-4"
        )}> 
          {!hasIcon && (
          <Button variant="ghost" size="sm" className="text-tertiary" onClick={addIcon}>
              <BsEmojiSmileFill />
              Add icon
            </Button>
          )}
          {!hasCoverImage && (
            <Button variant="ghost" size="sm" className="text-tertiary" onClick={() => addCoverImage("/webb1.jpg")}>
              <BsImageFill />
              Add cover image
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-tertiary" onClick={() => onToggle("description")}>
            <BsInfoCircleFill />
            {toggles.description ? "Hide description" : database.description ? "Show description" : "Add description"}
          </Button>
        </div>
        <div className="w-full pe-24 mb-2">
          <div className="flex items-center flex-row">
            {hasIcon && (
              <IconPicker 
                open={open}
                onOpenChange={setOpen}
                onChange={(icon) => {
                  addRecentIcon(icon);
                  updateDatabase.mutate({ databaseId: database._id, icon })
                }} 
                onRemove={() => {
                  updateDatabase.mutate({ databaseId: database._id, icon: null });
                }}
                customIcons={customIcons}
              >
                <div className="flex items-center justify-center size-9 rounded-[4px] shrink-0 relative z-1 pointer-events-auto ms-2 hover:bg-accent transition cursor-pointer">
                  <Icon name={database.icon!} height={36} width={36} />
                </div>
              </IconPicker>
            )}
            <div className="font-bold leading-[1.2] text-[32px] cursor-text flex items-center">
              <ElementEdit 
                onSave={updateTitle}
                syncKey={database._id}
                initialValue={database.title || ""}
                placeholder="New database"
                className={{
                  placeholder: "pointer-events-none absolute left-0 top-0 text-[1em] text-placeholder tracking-tight leading-tight select-none",
                  input: "max-w-full w-full wrap-break-word caret-primary pt-0 px-2 pb-0 text-[1em] font-[inherit] m-0 cursor-text",
                }}
              />
            </div>
          </div>

          {toggles.description && (
            <div className="max-w-full overflow-hidden mb-3">
              <div className="flex cursor-text relative">
                <ElementEdit 
                  onSave={updateDescription}
                  syncKey={database._id}
                  initialValue={database.description || ""}
                  placeholder="Add a description..."
                  className={{
                    placeholder: "whitespace-break-spaces wrap-break-word text-sm text-tertiary absolute left-2 top-1 pointer-events-none",
                    input: "max-w-full w-[780px] whitespace-break-spaces wrap-break-word text-sm py-1 ps-2"
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}