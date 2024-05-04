"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from 'nanoid';
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { type Session } from "next-auth";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const messageValidationSchema = z.object({
    message: z.string({
        required_error: "Campo requerido"
    }).min(1, "Campo requerido"),
})

export type Message = {
    id: string
    user: {
        id: string
        name: string
        image: string
    }
    message: string
    createdAt: Date
}

export type MessageValidationSchema = z.infer<typeof messageValidationSchema>;

type ChatProps = {
    session: Session
}

const Chat = ({ session }: ChatProps) => {
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const messagesContainer = useRef<HTMLDivElement | null>(null);
    const params = useParams();

    const { data: chatData, isLoading: chatIsLoading } = api.chat.chatByBatchId.useQuery({
        batchId: params.id as string,
    });

    const { mutate: createMessageMutation } = api.chat.createMessage.useMutation({
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const { register, handleSubmit, reset } = useForm<MessageValidationSchema>({
        resolver: zodResolver(messageValidationSchema),
        defaultValues: {
            message: ""
        }
    });

    const handleOnIcon = async () => {
        await handleSubmit(onSubmit)();
        reset({ message: '' });
    }

    const handleOnEnter = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleSubmit(onSubmit)();
            reset({ message: '' });
        }
    }

    const onSubmit = (data: MessageValidationSchema) => {
        if (session && chatData) {
            if (data.message !== '' && data.message != '\n') {
                setCurrentMessages([...currentMessages, {
                    message: data.message,
                    user: {
                        id: session.user.id,
                        name: session.user.name!,
                        image: session.user.image!
                    },
                    createdAt: new Date(),
                    id: nanoid()
                }]);


                createMessageMutation({
                    message: data.message,
                    chatId: chatData.id
                });
            }
        }
    }

    useEffect(() => {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTo({ top: messagesContainer.current.scrollHeight });
        }
    }, [messagesContainer, currentMessages.length]);

    return (
        <div className="flex flex-col gap-2 bg-blackNormal h-full">
            <p className="text-lg font-bold text-whiteMain"># Canal de texto</p>
            {
                chatIsLoading && <div className="flex h-full flex-col justify-between">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-unit-lg w-full" />
                        <Skeleton className="h-unit-sm w-32" />
                        <Skeleton className="h-unit-lg w-full" />
                        <Skeleton className="h-unit-sm w-32" />
                    </div>
                    <Skeleton className=" h-unit-2xl w-full" />
                </div>
            }
            {
                !chatIsLoading && chatData &&
                <div ref={messagesContainer} className="h-full overflow-auto gap-2 flex flex-col">
                    <Messages
                        messages={currentMessages}
                        chatId={chatData.id}
                        setCurrentMessages={setCurrentMessages}
                        session={session}
                    />
                </div>
            }
            {
                !chatIsLoading && chatData &&
                <MessageInput
                    register={register}
                    onClickIcon={handleOnIcon}
                    onHitEnter={handleOnEnter}
                />
            }

        </div>
    )
}

export default Chat;