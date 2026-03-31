"use client";

import { cn } from "@/lib/utils";

import { useEditable } from "@/hooks/use-editable";

interface Props {
  className?: {
    placeholder?: string;
    input?: string;
  };
  initialValue: string | null;
  syncKey: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

export const ElementEdit = ({ 
  className, 
  initialValue, 
  syncKey, 
  placeholder,
  onSave 
}: Props) => {
  const {
    ref,
    value,
    onInput,
    onBlur,
    onKeyDown,
  } = useEditable(
    initialValue, 
    onSave, 
    { syncKey }, 
  );

  return (
    <>
      {(!value && !!placeholder) && (
        <div className={cn(className?.placeholder)}>
          {placeholder}
        </div>
      )}
      <div 
        ref={ref}
        contentEditable={true}
        onInput={onInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        suppressContentEditableWarning
        role="textbox"
        className={cn(className?.input, "focus-visible:outline-none")}
      />
    </>
  );
}