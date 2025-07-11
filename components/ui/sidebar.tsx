import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarVariants = cva(
  "group relative flex h-full w-full flex-col gap-4 border-r bg-background p-4",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        secondary: "border-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof SidebarVariants> {}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(SidebarVariants({ variant }), className)}
      {...props}
    />
  )
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-2", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter"; 