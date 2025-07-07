import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Logo } from "./logo"

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

export const SidebarHeader = () => <div>Sidebar Header</div>;

export const SidebarFooter = () => <div>Sidebar Footer</div>;

export const SidebarNav = () => <div>Sidebar Nav</div>;

export const SidebarNavItem = () => <div>Sidebar Item</div>;

export const SidebarNavItemIcon = () => <span>🔘</span>;

export const SidebarNavItemText = () => <span>Text</span>;

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

// Enhanced Sidebar with Logo
export const SidebarWithLogo: React.FC<SidebarProps> = ({ className, ...props }) => (
  <Sidebar className={className} {...props}>
    <SidebarHeader>
      <Logo size="md" className="mx-auto" />
    </SidebarHeader>
    {props.children}
  </Sidebar>
)
