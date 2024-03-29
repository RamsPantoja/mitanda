import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "text-blackMain bg-greenMain hover:bg-greenMain/80",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-blackMain text-whiteMain hover:bg-blackMain/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
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
    isPending?: boolean
    children: string
    startIcon?: JSX.Element
    endIcon?: JSX.Element
}

const MitandaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isPending, children, endIcon, startIcon, ...props }, ref) => {
        const Comp = "button";

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isPending}
                {...props}
            >
                {
                    isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin bg-blackLigth" />
                }
                {
                    !isPending && startIcon
                }
                {
                    isPending ? "Espera" : children
                }
                {
                    !isPending && endIcon
                }
            </Comp>
        )
    }
)

MitandaButton.displayName = "MitandaButton"

export { MitandaButton, buttonVariants }