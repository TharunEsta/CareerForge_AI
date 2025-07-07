import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-soft hover:shadow-lg transition-all duration-300 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced Card Variants
const CardGlass = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 shadow-xl hover:shadow-2xl transition-all duration-300",
      className
    )}
    {...props}
  />
))
CardGlass.displayName = "CardGlass"

const CardGradient = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gradient?: "primary" | "secondary" | "success" | "warning" | "danger" }
>(({ className, gradient = "primary", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border-0 text-white shadow-xl hover:shadow-2xl transition-all duration-300",
      {
        "bg-gradient-primary": gradient === "primary",
        "bg-gradient-secondary": gradient === "secondary",
        "bg-gradient-success": gradient === "success",
        "bg-gradient-warning": gradient === "warning",
        "bg-gradient-danger": gradient === "danger",
      },
      className
    )}
    {...props}
  />
))
CardGradient.displayName = "CardGradient"

const CardInteractive = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-soft hover:shadow-glow hover:scale-105 transform transition-all duration-300 cursor-pointer",
      className
    )}
    {...props}
  />
))
CardInteractive.displayName = "CardInteractive"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardGlass, CardGradient, CardInteractive }
