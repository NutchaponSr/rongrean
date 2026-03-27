import Image from "next/image";

import { Icon as IconifyIcon } from "@iconify/react";

import { cn, formatName } from "@/lib/utils";

const SIZE = 24;

interface Props {
  name: string;
  height?: number;
  width?: number;
  className?: string;
}

export const Icon = ({ 
  name,
  height,
  width,
  className,
}: Props) => {
  // TODO: CHECK IF ICON IS CUSTOM(IMAGE)
  if (name.startsWith("https://")) {
    return (
      <Image 
        src={name}
        alt={formatName(name)}
        width={width || SIZE}
        height={height || SIZE}
        loading="lazy"
        className={cn("object-contain rounded", className)}
      />
    );
  }

  return (
    <IconifyIcon 
      icon={name}
      height={height || SIZE}
      width={width || SIZE}
      className="shrink-0 block stroke-[-0.25]"
    />
  );
}