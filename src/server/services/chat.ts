
import { type z } from "zod";
import { messages } from "../db/schema";
import { type TRPCContext } from "../trpc";
import { type createMessageInputSchema } from "../schema/chat";
import { type Session } from "next-auth";
import { TRPCError } from "@trpc/server";
import { type User } from "./user";

type ChatServiceContructor = {
    ctx: TRPCContext
}

type CreateMessageInput = z.infer<typeof createMessageInputSchema>;
type Message = typeof messages.$inferSelect;
export type MessageWithUser = Message & { user: User }

class ChatService {
    ctx: TRPCContext

    constructor({ ctx }: ChatServiceContructor) {
        this.ctx = ctx;
    }

    public async createMessage(input: CreateMessageInput, session: Session) {
        const {
            message,
            chatId
        } = input;

        const [createdMessage] = await this.ctx.db.insert(messages).values({
            chatId,
            message,
            userId: session.user.id
        }).returning();

        if (!createdMessage) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Message was not sent',
            });
        }

        return createdMessage;
    }

    public async getMessagesByChatId(chatId: string): Promise<MessageWithUser[]> {
        const messageList = await this.ctx.db.query.messages.findMany({
            where: (messages, { eq }) => {
                return eq(messages.chatId, chatId)
            },
            with: {
                user: true
            }
        });

        return messageList;
    }

    public async getChatByBatchId(batchId: string) {
        const chat = await this.ctx.db.query.chats.findFirst({
            where: (chats, { eq }) => {
                return eq(chats.batchId, batchId)
            },
        })

        if (!chat) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Chat not found',
            });
        }

        return chat;
    }
}

export default ChatService;