import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[var(--glow-red)] border border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-card/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:shadow-[var(--glow-accent)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/30",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:shadow-[var(--glow-red)]",
        lightsaber: "bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/30 text-primary-foreground hover:border-primary hover:shadow-[var(--glow-red)] hover:bg-gradient-to-r hover:from-primary/30 hover:to-primary/20",
        "lightsaber-blue": "bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent/30 text-accent-foreground hover:border-accent hover:shadow-[var(--glow-blue)] hover:bg-gradient-to-r hover:from-accent/30 hover:to-accent/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
