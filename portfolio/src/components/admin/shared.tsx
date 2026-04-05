import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const FormField = ({
  children,
  description,
  htmlFor,
  label,
}: {
  children: ReactNode;
  description?: string;
  htmlFor: string;
  label: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground" htmlFor={htmlFor}>
      {label}
    </label>
    {description && <p className="text-xs leading-5 text-muted-foreground">{description}</p>}
    {children}
  </div>
);

export const ItemEditorCard = ({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: string;
}) => (
  <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {action}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export const RemoveItemButton = ({ onClick }: { onClick: () => void }) => (
  <Button type="button" variant="ghost" size="icon" onClick={onClick}>
    <span className="sr-only">Remove item</span>
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6h18M8 6V4h8v2m-7 4v8m6-8v8M5 6l1 14h12l1-14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  </Button>
);
