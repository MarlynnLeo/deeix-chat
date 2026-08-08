"use client";

import * as React from "react";
import { Clock3, RectangleHorizontal, Scan } from "lucide-react";

import type { ModelOptionControl } from "@/features/chat/types/chat-runtime";
import type { ConversationOptions } from "@/shared/api/conversation.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Paths shown as compact composer chips for image/video generation. */
const MEDIA_QUICK_PARAM_PATHS = new Set([
  "duration",
  "aspect_ratio",
  "aspectRatio",
  "resolution",
  "size",
  "image_size",
  "imageSize",
]);

const PATH_ORDER = [
  "duration",
  "aspect_ratio",
  "aspectRatio",
  "resolution",
  "size",
  "image_size",
  "imageSize",
];

export type ChatMediaQuickParamsProps = {
  disabled?: boolean;
  visible: boolean;
  options: ConversationOptions;
  optionControls: ModelOptionControl[];
  onOptionsChange: React.Dispatch<React.SetStateAction<ConversationOptions>>;
  className?: string;
};

function normalizeSelectValues(values: string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((item) => item.trim()).filter(Boolean)));
}

function readOptionValue(options: ConversationOptions, path: string): string {
  const value = options[path];
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function resolveIcon(path: string) {
  if (path === "duration") {
    return Clock3;
  }
  if (path === "resolution" || path === "image_size" || path === "imageSize" || path === "size") {
    return Scan;
  }
  return RectangleHorizontal;
}

function resolveLabel(control: ModelOptionControl): string {
  const path = control.path.trim();
  if (control.label?.trim()) {
    return control.label.trim();
  }
  if (path === "duration") return "时长";
  if (path === "aspect_ratio" || path === "aspectRatio") return "比例";
  if (path === "resolution" || path === "image_size" || path === "imageSize") return "分辨率";
  if (path === "size") return "尺寸";
  return path;
}

function coerceOptionValue(
  path: string,
  raw: string,
  type?: ModelOptionControl["type"],
): string | number {
  if (type === "number" || path === "duration") {
    const n = Number(raw);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return raw;
}

/**
 * Compact media parameter selectors rendered next to the image/video mode badge
 * in the chat composer (not buried inside model settings).
 */
export function ChatMediaQuickParams({
  disabled = false,
  visible,
  options,
  optionControls,
  onOptionsChange,
  className,
}: ChatMediaQuickParamsProps) {
  const controls = React.useMemo(() => {
    const filtered = optionControls.filter((control) => {
      const path = control.path.trim();
      if (!MEDIA_QUICK_PARAM_PATHS.has(path)) {
        return false;
      }
      return normalizeSelectValues(control.options).length > 0 || control.type === "select";
    });
    return filtered.sort((a, b) => {
      const ai = PATH_ORDER.indexOf(a.path.trim());
      const bi = PATH_ORDER.indexOf(b.path.trim());
      return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
    });
  }, [optionControls]);

  if (!visible || controls.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-[min(62vw,28rem)] shrink-0 items-center gap-1 overflow-hidden",
        className,
      )}
      data-testid="chat-media-quick-params"
    >
      {controls.map((control) => {
        const path = control.path.trim();
        const selectValues = normalizeSelectValues(control.options);
        if (selectValues.length === 0) {
          return null;
        }
        const current = readOptionValue(options, path);
        const value = selectValues.includes(current) ? current : selectValues[0];
        const Icon = resolveIcon(path);
        const label = resolveLabel(control);
        const displayValue =
          path === "duration" && value && !String(value).endsWith("s")
            ? `${value}s`
            : value;

        return (
          <Select
            key={path}
            value={value}
            disabled={disabled}
            onValueChange={(next) => {
              const coerced = coerceOptionValue(path, next, control.type);
              onOptionsChange((prev) => ({
                ...prev,
                [path]: coerced,
              }));
            }}
          >
            <SelectTrigger
              size="sm"
              className={cn(
                "h-8 w-auto max-w-[7.5rem] gap-1 rounded-lg border-border/50 bg-muted/60 px-2 text-[11px] font-medium text-muted-foreground shadow-none",
                "hover:bg-muted focus:ring-0 data-[state=open]:bg-muted",
              )}
              aria-label={label}
              title={control.description?.trim() || label}
            >
              <Icon className="size-3.5 shrink-0 opacity-80" strokeWidth={1.7} />
              <span className="hidden text-[10px] opacity-70 sm:inline">{label}</span>
              <SelectValue placeholder={displayValue || label} />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-[7rem]">
              {selectValues.map((item) => (
                <SelectItem key={item} value={item} className="text-xs">
                  {path === "duration" ? `${item}s` : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
    </div>
  );
}
