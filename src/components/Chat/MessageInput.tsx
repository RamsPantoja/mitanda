import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '../ui/button';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { type KeyboardEvent } from 'react';
import { type UseFormRegister } from 'react-hook-form';

type MessageInputProps = {
    onHitEnter: (e: KeyboardEvent<HTMLTextAreaElement>) => void
    onClickIcon: () => void
    register: UseFormRegister<{
        message: string;
    }>
}

const MessageInput = ({ onHitEnter, onClickIcon, register }: MessageInputProps) => {
    return (
        <div className='flex items-end justify-between gap-1'>
            <TextareaAutosize
                onKeyDown={onHitEnter}
                maxRows={4}
                className={"flex resize-none w-full rounded-md border border-blackMain text-whiteLigth bg-grayStrong px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grayMain focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"}
                placeholder='Escribe aquí...'
                {...register("message")}
            />
            <Button onClick={onClickIcon} size="icon" variant="ghost" className=" h-8 m-w-8 p-0 hover:bg-blackMain">
                <PaperAirplaneIcon className='m-w-4 h-4 text-grayMain' />
            </Button>
        </div>
    )
}

export default MessageInput;