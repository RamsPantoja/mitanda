import Timer from "@/lib/timer";
import { cn } from "@/lib/utils";
import { type DetailedHTMLProps, type HTMLAttributes, useEffect, useState } from "react";

type TimerProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
    start: Date
    end: Date
    onTimerEnds: () => void
}

const TimerComponent = ({ start, end, className, onTimerEnds }: TimerProps) => {
    const [remainingTime, setRemainingTime] = useState<string>("");

    useEffect(() => {
        const timer = new Timer(start, end);

        timer.startTimer({
            catchRemainingTime: (time) => {
                setRemainingTime(time);
            },
            onTimerEnds: () => {
                onTimerEnds();
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (

        <span
            className={cn([
                " text-whiteMain font-bold text-xs",
                className
            ])}
        >{remainingTime}</span>
    )
}

export default TimerComponent;