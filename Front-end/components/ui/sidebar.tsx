import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const SidebarVariants = cva(
  "group relative flex h-full w-full flex-col gap-4 border-r bg-background p-4",
  {
    variants: {
      variant: {
        default: "border-border",
        secondary: "border-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "secondary";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    { className, variant, ...props }: SidebarProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(SidebarVariants({ variant }), className)}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn("flex h-[60px] items-center px-2", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 p-4", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-2", className)}
      {...props}
    />
  )
)
SidebarNav.displayName = "SidebarNav"

export const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(
  (
    { className, active, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean },
    ref: React.Ref<HTMLAnchorElement>
  ) => (
    <a
      ref={ref}
      className={cn(
        "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground [&[data-state=active]]:bg-accent [&[data-state=active]]:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )
)
SidebarNavItem.displayName = "SidebarNavItem"

export const SidebarNavItemIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(
        "mr-2 h-4 w-4 shrink-0 [&_svg]:absolute [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-foreground",
        className
      )}
      {...props}
    />
  )
)
SidebarNavItemIcon.displayName = "SidebarNavItemIcon"

export const SidebarNavItemText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLSpanElement>,
    ref: React.Ref<HTMLSpanElement>
  ) => (
    <span
      ref={ref}
      className={cn("truncate", className)}
      {...props}
    />
  )
)
SidebarNavItemText.displayName = "SidebarNavItemText"

export const SidebarNavItemBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn("ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground", className)}
      {...props}
    />
  )
)
SidebarNavItemBadge.displayName = "SidebarNavItemBadge"
