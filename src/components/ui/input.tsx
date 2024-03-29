import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  status?: "SUCCESS" | "ERROR" | "WARNING"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, status, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn([
          "flex h-10 w-full rounded-md border border-blackMain text-whiteLigth bg-grayStrong px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grayMain focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          {
            "border-red-500": status === 'ERROR',
            "border-green-500": status === 'SUCCESS',
            "border-yellow-500": status === 'WARNING'
          },
          className
        ])}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
