import React, { useCallback } from "react";
import { ApiOutputs } from "@convex/api";

import { ElementEdit } from "@/components/element-edit";
import { Cell, PropertyType } from "../../types";
import type { PropertyValue } from "../../../../../convex/shared/zod-schema";

type Property = ApiOutputs["database"]["getOne"]["properties"][0];

export interface CellEditorProps {
  cell: Cell | undefined;
  property: Property;
  onSave: (value: PropertyValue) => void;
}

type CellValue = NonNullable<Cell>;

function getCellValue<T extends CellValue["type"]>(
  cell: Cell | undefined,
  type: T
): Extract<CellValue, { type: T }> | null {
  if (!cell || cell.type !== type) return null;
  return cell as Extract<CellValue, { type: T }>;
}

const TitleEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "title");

  const handleSave = useCallback((raw: string) => {
    onSave({ type: "title", value: raw });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value ?? null}
      className={{ input: "max-w-full w-full wrap-break-word caret-primary font-medium text-sm" }}
    />
  );
};

const TextEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "text");

  const handleSave = useCallback((raw: string) => {
    onSave({ type: "text", value: raw });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value ?? null}
      className={{ input: "max-w-full w-full wrap-break-word caret-primary" }}
    />
  );
};

const NumberEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "number");

  const handleSave = useCallback((raw: string) => {
    const num = Number(raw);
    if (!isNaN(num)) onSave({ type: "number", value: num });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value != null ? String(value.value) : null}
      placeholder="0"
      className={{ input: "max-w-full w-full wrap-break-word caret-primary" }}
    />
  );
};

const UrlEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "url");

  const handleSave = useCallback((raw: string) => {
    onSave({ type: "url", value: raw });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value ?? null}
      placeholder="https://"
      className={{ input: "max-w-full w-full wrap-break-word caret-primary" }}
    />
  );
};

const EmailEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "email");

  const handleSave = useCallback((raw: string) => {
    onSave({ type: "email", value: raw });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value ?? null}
      placeholder={property.name}
      className={{ input: "max-w-full w-full wrap-break-word caret-primary" }}
    />
  );
};

const PhoneEditor = ({ cell, property, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "phone");

  const handleSave = useCallback((raw: string) => {
    onSave({ type: "phone", value: raw });
  }, [onSave]);

  return (
    <ElementEdit
      onSave={handleSave}
      syncKey={property._id}
      initialValue={value?.value ?? null}
      placeholder={property.name}
      className={{ input: "max-w-full w-full wrap-break-word caret-primary" }}
    />
  );
};

const CheckboxEditor = ({ cell, onSave }: CellEditorProps) => {
  const value = getCellValue(cell, "checkbox");
  const checked = value?.value ?? false;

  return (
    <div className="flex items-center h-full px-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onSave({ type: "checkbox", value: e.target.checked })}
        className="size-4 rounded cursor-pointer accent-primary"
      />
    </div>
  );
};

const editorComponents: Partial<Record<PropertyType, React.ComponentType<CellEditorProps>>> = {
  title: TitleEditor,
  text: TextEditor,
  number: NumberEditor,
  url: UrlEditor,
  email: EmailEditor,
  phone: PhoneEditor,
  checkbox: CheckboxEditor,
};

export const CellEditorRender = ({ cell, property, onSave }: CellEditorProps) => {
  const Component = editorComponents[property.type as PropertyType];

  if (!Component) return null;

  return <Component cell={cell} property={property} onSave={onSave} />;
};
