import { BsQuestionCircle } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";

import { useCRPC } from "@/lib/convex/crpc";

import { PropertyProps } from "@/modules/databases/types";
import { properties } from "@/modules/databases/constants";
import { getDefaultConfig } from "@convex/zod-schema";
import { useState } from "react";

interface Props {
  databaseId: string;
}

export const PropertyContent = ({ databaseId }: Props) => {
  const crpc = useCRPC();

  const [name, setName] = useState("");

  const addProperty = useMutation(crpc.property.create.mutationOptions());

  return (
    <>
      <div className="gap-px relative p-2 flex flex-col">
        <div className="w-full min-h-7 select-none leading-[120%] gap-2 text-sm flex items-center">
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Property name"
            className="text-sm relative leading-5 flex cursor-text rounded items-center bg-secondary-accent shadow-[0_0_0_1.25px_#1c13011c] h-7 px-1.5 py-0.5 w-full focus:outline-none focus:shadow-[0_0_0_2px_#2383e2] placeholder:text-secondary-foreground" 
          />
        </div>
      </div>
      <div className="h-100 overflow-y-auto overflow-x-hidden" role="menu">
        <div className="gap-px relative pt-1 px-1 pb-0 mb-1 flex flex-col">
          <div className="flex px-2 mt-0.5 mb-0 text-secondary text-xs font-medium leading-[120%] select-none pb-0">
            <div className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
              Type
            </div>
          </div>
        </div>

        <div className="gap-px relative px-1 pb-1 flex flex-col">
          {properties.map((property) => (
            <Property 
              key={property.value}
              onClick={() => addProperty.mutate({ 
                databaseId, 
                name: name || property.label,
                config: getDefaultConfig(property.value) 
              })}
              {...property} 
            />
          ))}
        </div>
      </div>
    </>
  );
}

const Property = ({
  label,
  icon: Icon,
  onClick,
}: Pick<PropertyProps, "label" | "icon"> & {
  onClick: () => void;
}) => {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className="cursor-pointer flex rounded w-full select-none transition hover:bg-muted group/property"
    >
      <div className="w-full min-h-7 select-none gap-1.5 px-2 leading-[120%] text-sm items-center flex">
        <div className="min-h-5 min-w-5 flex items-center justify-center shrink-0">
          <Icon className="size-4 shrink-0 text-icon-primary stroke-[0.2]" />
        </div>
        <div className="grow shrink basis-auto min-w-0">
          <div className="overflow-hidden whitespace-nowrap text-ellipsis">
            <div className="inline-flex items-center justify-between max-w-full w-full overflow-hidden">
              <div className="inline-flex grow shrink basis-0 overflow-hidden items-center">
                <span className="overflow-hidden whitespace-nowrap text-ellipsis me-1">
                  {label}
                </span>
              </div>
              <div className="flex">
                <BsQuestionCircle className="text-icon-secondary opacity-0 group-hover/property:opacity-100 transition-opacity shrink-0 size-2.5 stroke-[0.2]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}