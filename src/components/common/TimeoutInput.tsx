import { type ChangeEvent, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { type Timeout } from 'react-number-format/types/types';

type TimeoutInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    onDelay: (value: string) => void
    delay?: number
    startIcon?: JSX.Element
}

const DelayInput = ({
    onDelay,
    delay = 1000,
    startIcon,
    ...props
}: TimeoutInputProps) => {
    const timeoutRef = useRef<Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (timeoutRef) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                onDelay(e.target.value);
            }, delay)
        }
    }

    return (
        <div className="flex flex-row gap-2 items-center relative">
            {
                startIcon && startIcon
            }
            <Input
                type='text'
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};

export default DelayInput;
