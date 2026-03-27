import { coverImages } from "@/constants/cover-images";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Hint } from "@/components/hint";

interface Props {
  onChange: (value: string) => void;
}

export const CoverImageTab = ({ onChange }: Props) => {
  return (
    <ScrollArea className="grow min-h-0 overflow-y-auto overflow-x-hidden">
      <div className="pb-2">
        {coverImages.map((c, index) => (
          <div key={index} className="flex flex-col p-1 relative gap-px">
            <div className="flex px-2 mt-1.5 mb-2 text-secondary fill-icon-secondary text-xs font-normal leading-[120%] select-none">
              <div className="flex self-center">
                {c.category}
              </div>
            </div>

            <div className="flex flex-wrap items-start px-2">
              {c.images.map((i, index) => (
                <div key={index} className="w-1/4 p-0.5">
                  <div className="contents">
                    <Hint content={i.alt} side="bottom" align="center" sideOffset={2}>
                      <div role="button" className="select-none cursor-pointer transition" onClick={() => onChange(i.url)}>
                        <div className="w-full h-full">
                          <img 
                            src={i.url}
                            className="block object-cover rounded w-full h-16 object-[center_60%]"
                          />
                        </div>
                      </div>
                    </Hint>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}