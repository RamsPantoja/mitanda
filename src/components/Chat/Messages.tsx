import { type Dispatch, Fragment, type SetStateAction, useEffect } from "react";
import MessageCard from "./MessageCard";
import { type Message } from ".";
import { api } from "@/trpc/react";
import { mapSkeletons } from "@/lib/utils";
import MessageCardSkeleton from "./MessageCardSkeleton";
import FeedbackMessage from "../common/FeedbackMessage";
import { type Session } from "next-auth";

type MessagesProps = {
    messages: Message[]
    chatId: string
    setCurrentMessages: Dispatch<SetStateAction<Message[]>>
    session: Session
}

const Messages = ({ messages, chatId, setCurrentMessages, session }: MessagesProps) => {
    const { data: messagesData, isLoading: messagesIsLoading, isError: messagesIsError } = api.chat.getMessagesByChatId.useQuery(
        {
            chatId
        }
    );

    useEffect(() => {
        if (messagesData) {
            setCurrentMessages(messagesData.map((item) => {
                return {
                    id: item.id,
                    user: {
                        id: item.userId,
                        name: item.user.name!,
                        image: item.user.image!
                    },
                    message: item.message,
                    createdAt: item.createdAt
                }
            }));
        }
    }, [messagesData, setCurrentMessages]);

    const skeletons = mapSkeletons({ numberOfSkeletons: 15, skeleton: <MessageCardSkeleton /> });

    return (
        <Fragment>
            {
                messagesIsLoading && skeletons.map((skeleton, index) => {
                    return <Fragment key={index}>
                        {skeleton}
                    </Fragment>
                })
            }
            {
                !messagesIsLoading && !messagesIsError && messages.map((item) => {
                    return (
                        <MessageCard
                            key={item.id}
                            message={item}
                            session={session}
                        />
                    )
                })
            }
            {
                !messagesIsLoading && !messagesIsError && messages.length === 0 &&
                <p>Comienza una conversación</p>
            }
            {
                !messagesIsLoading &&
                messagesIsError &&
                <FeedbackMessage status="ERROR" message="Algo salio mal! No se pueden obtener las contribuciones." />
            }
        </Fragment>
    )
}

export default Messages;