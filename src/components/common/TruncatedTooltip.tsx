import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

type TruncatedTooltipProps = React.HTMLAttributes<HTMLSpanElement> & {
    text: string
    tooltipContent: JSX.Element
}

const TruncatedTooltip = ({
    text,
    tooltipContent,
    className
}: TruncatedTooltipProps) => {
    const textRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip
                open={open}
                onOpenChange={(isOpen) => {
                    if (isOpen) {
                        if (textRef?.current) {
                            if (textRef.current.scrollWidth > textRef.current.offsetWidth) {
                                setOpen(true);
                            }
                        }
                    } else {
                        setOpen(false);
                    }
                }}
            >
                <TooltipTrigger asChild>
                    <span
                        ref={textRef}
                        className={cn([
                            "truncate",
                            className
                        ])}
                    >
                        {text}
                    </span>
                </TooltipTrigger>
                <TooltipContent className=" bg-blackMain border-none">
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TruncatedTooltip;