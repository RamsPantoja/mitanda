"use client"

import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { type Session } from "next-auth";
import useFeedbackLogic from "./useFeedbackLogic";
import { MitandaButton } from "../common/MitandaButton";
import { Textarea } from "../ui/textarea";
import InputFeedbackMessage from "../common/ErrorMessageInput";

type FeedbackProps = {
    session: Session
}

const Feedback = ({ }: FeedbackProps) => {
    const {
        openCommentsBox,
        setOpenCommentsBox,
        onSendFeedback,
        createFeedbackIsPending,
        useFormFeedback
    } = useFeedbackLogic();

    const { register, formState, handleSubmit } = useFormFeedback;

    return (
        <Popover
            open={openCommentsBox}
            onOpenChange={(open) => {
                setOpenCommentsBox(open);
            }}
        >
            <PopoverTrigger asChild>
                <MitandaButton
                    size='sm'
                    variant="secondary"
                    startIcon={<ChatBubbleLeftEllipsisIcon className="w-5 h-5" />}
                >
                    Comentarios
                </MitandaButton>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] overflow-auto">
                <div className="flex gap-2 flex-col items-end w-full">
                    <div className="flex flex-col w-full h-full">
                        <Textarea
                            placeholder="Comentarios para mejorar la plataforma..."
                            className="resize-none"
                            rows={7}
                            {...register("content")}
                        />
                        {
                            formState.errors.content && <InputFeedbackMessage status="ERROR" message={formState.errors.content.message} />
                        }
                    </div>
                    <MitandaButton
                        size='sm'
                        variant='default'
                        isPending={createFeedbackIsPending}
                        onClick={handleSubmit(onSendFeedback)}
                    >Enviar</MitandaButton>
                </div>
            </PopoverContent>
        </Popover >
    )
}

export default Feedback;