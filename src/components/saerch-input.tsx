import { BsFillXCircleFill } from "react-icons/bs";
import { GoSearch } from "react-icons/go";
import { Hint } from "./hint";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchInput = ({ 
  placeholder,
  value,
  onChange,
  onClear
}: Props) => {
  return (
    <div role="presentation" className="flex">
      <div className="w-full shadow-[0_0_0_1.25px_#1c13011c] bg-secondary-accent h-7 py-[3px] px-1.5 relative leading-5 text-sm flex cursor-text rounded items-center">
        <div className="me-1.5">
          <GoSearch className="size-4 block text-icon-secondary shrink-0 grow-0 stroke-[0.25]" />
        </div>
        <input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ unicodeBidi: "plaintext" }}
          className="w-full pt-0 pb-0 resize-none px-0 focus:outline-none block"
        />
        {!!value && (
          <div className="contents">
            <Hint content="Clear Input" side="bottom" align="start" sideOffset={4}>
              <div 
                role="button" 
                className="inline-flex items-center justify-center gap-0 size-6 rounded-full text-sm font-medium whitespace-nowrap leading-[1.2] text-tertiary shrink-0 grow-0 -me-1 hover:bg-muted"
                onClick={onClear}
              >
                <BsFillXCircleFill className="size-4 block text-icon-tertiary shrink-0" />
              </div>
            </Hint>
          </div>
        )}
      </div>
    </div>
  );
}