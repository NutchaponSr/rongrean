"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const useEditable = (
  initialValue: string | null | null = "",
  onSave: (value: string) => void,
  options?: { syncKey?: string },
) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [value, setValue] = useState(initialValue);

  const syncKey = options?.syncKey || initialValue;

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.textContent = initialValue || "";
    }
  }, []);

  useEffect(() => {
    if (!ref.current || ref.current === document.activeElement) return;

    const value = initialValue || "";

    ref.current.textContent = value;
    setValue(value);
  }, [initialValue, syncKey]);

  const onInput = useCallback(() => {
    if (ref.current) {
      setValue(ref.current.textContent || "");
    };
  }, []);

  const onBlur = useCallback(() => {
    if (ref.current) {
      const text = ref.current.textContent?.trim() || "";
      setValue(text);
      onSave(text);
    }
  }, [onSave]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
  }, []);

  return {
    ref,
    value,
    onInput,
    onBlur,
    onKeyDown,
  };
}