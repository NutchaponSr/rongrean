import { useEffect, useState } from "react";

export const useVirtualScroll = (
  count: number,
  height: number,
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [scroll, setScroll] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      setScroll((e.target as HTMLDivElement).scrollTop);
    }

    const node = containerRef.current;

    if (node) {
      setViewportHeight(node.clientHeight);
      node.addEventListener("scroll", handleScroll);

      const observer = new ResizeObserver(() => {
        setViewportHeight(node.clientHeight);
      });
      observer.observe(node);

      return () => {
        node.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }
  }, [containerRef]);

  const startIndex = Math.max(0, Math.floor(scroll / height) - 5);
  const endIndex = Math.min(count - 1, Math.floor((scroll + viewportHeight) / height) + 5);

  const virtualItems = [];

  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({ index: i, start: i * height });
  }

  return {
    virtualItems,
    totalHeight: count * height,
  }
}