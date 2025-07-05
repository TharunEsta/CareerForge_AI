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
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const sidebarTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "mb-2 px-4 text-lg font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
sidebarTitle.displayName = "SidebarTitle"

const sidebarDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mb-2 px-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
sidebarDescription.displayName = "SidebarDescription"

const sidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col gap-2", className)}
    {...props}
  />
))
sidebarSection.displayName = "SidebarSection"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4 p-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const sidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col gap-2", className)}
    {...props}
  />
))
sidebarNav.displayName = "SidebarNav"

const sidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
  }
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground [&[data-state=active]]:bg-accent [&[data-state=active]]:text-accent-foreground",
      active && "bg-accent text-accent-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItem.displayName = "SidebarNavItem"

const sidebarNavItemIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mr-2 h-4 w-4 shrink-0 [&_svg]:absolute [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemIcon.displayName = "SidebarNavItemIcon"

const sidebarNavItemText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate", className)}
    {...props}
  />
))
sidebarNavItemText.displayName = "SidebarNavItemText"

const sidebarNavItemBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemBadge.displayName = "SidebarNavItemBadge"

const sidebarNavItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
sidebarNavItemGroup.displayName = "SidebarNavItemGroup"

const sidebarNavItemGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemGroupLabel.displayName = "SidebarNavItemGroupLabel"

const sidebarNavItemGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
sidebarNavItemGroupContent.displayName = "SidebarNavItemGroupContent"

const sidebarNavItemGroupItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
  }
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground [&[data-state=active]]:bg-accent [&[data-state=active]]:text-accent-foreground",
      active && "bg-accent text-accent-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemGroupItem.displayName = "SidebarNavItemGroupItem"

const sidebarNavItemGroupItemIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mr-2 h-4 w-4 shrink-0 [&_svg]:absolute [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemGroupItemIcon.displayName = "SidebarNavItemGroupItemIcon"

const sidebarNavItemGroupItemText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate", className)}
    {...props}
  />
))
sidebarNavItemGroupItemText.displayName = "SidebarNavItemGroupItemText"

const sidebarNavItemGroupItemBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
      className
    )}
    {...props}
  />
))
sidebarNavItemGroupItemBadge.displayName = "SidebarNavItemGroupItemBadge"

export {
  Sidebar,
  SidebarHeader,
  sidebarTitle,
  sidebarDescription,
  sidebarSection,
  SidebarFooter,
  sidebarNav,
  sidebarNavItem,
  sidebarNavItemIcon,
  sidebarNavItemText,
  sidebarNavItemBadge,
  sidebarNavItemGroup,
  sidebarNavItemGroupLabel,
  sidebarNavItemGroupContent,
  sidebarNavItemGroupItem,
  sidebarNavItemGroupItemIcon,
  sidebarNavItemGroupItemText,
  sidebarNavItemGroupItemBadge,
}
