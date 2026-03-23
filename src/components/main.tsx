"use client";

import { useSidebar } from "@/components/contexts/sidebar-context";

interface Props {
  children: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  const { width, isCollapsed } = useSidebar();

  return (
    <main
      style={{ width: `calc(100vw - ${isCollapsed ? 0 : width}px)`}}
      className="grow-0 shrink flex flex-col bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative translate-x-0 duration-200 ease-[ease] transition-[width,transform]"
    >
      {children}
    </main>
  );
}