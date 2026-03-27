import { useState, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Props {
  content: string;
  description?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  alignOffset?: number;
  sideOffset?: number;
  children: React.ReactNode;
}

export const Hint = ({
  content,
  description,
  align = "center",
  side = "top",
  alignOffset = 0,
  sideOffset = 0, 
  children,
}: Props) => {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      setOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), 50);
  };

  const handleMouseLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 50);
  };

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger 
          asChild 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent 
          align={align} 
          side={side} 
          alignOffset={alignOffset} 
          sideOffset={sideOffset}
          onMouseEnter={() => setOpen(false)} 
        >
          <div className="flex flex-col">
            <p className="text-xs font-normal text-white">
              {content}
            </p>
            <p className="text-xs font-normal text-tertiary">
              {description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}