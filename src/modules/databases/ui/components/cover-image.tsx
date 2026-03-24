import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { TabsMenu } from "@/components/tabs-menu";

import { CoverImageTab } from "@/modules/databases/ui/components/cover-image-tab";
import { useRepositionImage } from "../../stores/use-reposition-image";

interface Props {
  src: string | null;
  initialPosition: number;
  onSave: (position: number) => void;
  onChange: (value: string | null) => void;
}

export const CoverImage = ({ 
  src, 
  initialPosition, 
  onChange,
  onSave
}: Props) => {
  const {
    position,
    isRepositioning,
    setPosition
  } = useRepositionImage();

  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startClientY = useRef(0);
  const startPosition = useRef(0);

  useEffect(() => {
    useRepositionImage.setState({
      onSave,
      position: initialPosition,
      initialPosition: initialPosition,
    });
  }, []);

  const getDeltaPercent = useCallback((clientY: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return ((clientY - startClientY.current) / rect.height) * 100;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isRepositioning) return;

      isDragging.current = true;
      startClientY.current = e.clientY;
      startPosition.current = position;
      e.preventDefault();
    },
    [isRepositioning, position]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;

      setPosition(startPosition.current + getDeltaPercent(e.clientY));
    },
    [getDeltaPercent, setPosition]
  )

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isRepositioning) return

      isDragging.current = true;
      startClientY.current = e.touches[0].clientY;
      startPosition.current = position;
      e.preventDefault();
    },
    [isRepositioning, position]
  );

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      setPosition(startPosition.current + getDeltaPercent(touch.clientY))
    }

    el.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => el.removeEventListener("touchmove", onTouchMove)
  }, [getDeltaPercent, setPosition])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
  }, []);

  if (!src) return null;

  return (
    <div className="w-full flex items-center flex-col shrink-0 grow-0 sticky inset-s-0 group/cover-image z-2">
      <div className="relative w-full flex flex-col items-center h-[20vh] max-h-70 cursor-default">
        <div className={cn("w-full cursor-default", isRepositioning && "cursor-ns-resize")}>
          <div className="grid w-full h-[20vh] max-h-70">
            <div 
              ref={ref}
              style={{ gridArea: "1 / 1" }} 
              className="w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={src}
                alt={src.split("/").pop()?.split(".")[0] || "Cover image"}
                className="block object-cover w-full h-[20vh] max-h-70 opacity-100"
                style={{
                  objectPosition: `center ${position}%`
                }}
              />
            </div>
          </div>
        </div>
        <div
          data-show={isRepositioning}
          className="opacity-0 data-[show=true]:opacity-100 transition-opacity text-white rounded text-xs bg-black/40 absolute w-[180px] inset-s-[calc(50%-90px)] px-3.5 py-1 pointer-events-none top-[calc(50%-10px)] text-center"
        >
          Drag image to reposition
        </div>

        <CoverImageMenu onChange={onChange} />
      </div>
    </div>
  );
}

const CoverImageMenu = ({
  onChange,
}: {
  onChange: (value: string | null) => void;
}) => {
  const { 
    isRepositioning, 
    saveRepositioning,
    startRepositioning, 
    cancelRepositioning 
  } = useRepositionImage();

  return (
    <div className="absolute top-3 inset-e-3 pointer-events-auto cursor-default opacity-0 group-hover/cover-image:opacity-100 transition-opacity">
      <div className="flex items-center bg-white shadow-[0_8px_12px_0_#19191907,0_2px_6px_0_#19191907,0_0_0_1.25px_#2a1c0012] rounded w-fit p-0.5">
        {isRepositioning ? (
          <>
            <Button variant="ghost" size="xs" onClick={saveRepositioning}>
              Save position
            </Button>
            <Button variant="ghost" size="xs" onClick={cancelRepositioning}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="xs">
                  Change
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                align="end" 
                alignOffset={-2}
                className="w-[540px] min-w-[180px] max-w-[calc(-24px+vw)] h-full max-h-[485px]"
              >
                <TabsMenu 
                  triggers={[
                    {
                      value: "gallery",
                      label: "Gallery",
                      content: <CoverImageTab onChange={onChange} />
                    }
                  ]}
                  customMenu={
                    <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
                      Remove
                    </Button>
                  }
                />
              </PopoverContent>
            </Popover>
            <div className="w-px h-4 mx-1 bg-border-secondary rounded-xs" />
            <Button variant="ghost" size="xs" onClick={startRepositioning}>
              Reposition
            </Button>
          </>
        )}
      </div>
    </div>
  );
}