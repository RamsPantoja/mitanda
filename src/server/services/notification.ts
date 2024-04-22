import { type z } from "zod";
import { notifications } from "../db/schema";
import { type TRPCContext } from "../trpc";
import { type markAsSeenInputSchema } from "../schema/notification";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type NotificationServiceContructor = {
    ctx: TRPCContext
}

type CreateNotificationInput = {
    content: string
    iconUrl: string
    link: string
    receiverId: string
}

export type Notification = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
type MarkAsSeenInput = z.infer<typeof markAsSeenInputSchema>

class NotificationService {
    ctx: TRPCContext

    constructor({ ctx }: NotificationServiceContructor) {
        this.ctx = ctx;
    }

    public async create(input: CreateNotificationInput[]): Promise<Notification[]> {
        const newNotifications = await this.ctx.db.insert(notifications).values(input).returning();
        return newNotifications;
    }

    public async markAsSeen(input: MarkAsSeenInput): Promise<Notification> {
        const [notification] = await this.ctx.db.update(notifications)
            .set({
                seen: true
            })
            .where(eq(notifications.id, input.notificationId))
            .returning();

        if (!notification) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Notification was not updated',
            });
        }

        return notification;
    }

    public async getNotificationsByUserId(userId: string): Promise<Notification[]> {
        const notificationsByUser = await this.ctx.db.query.notifications.findMany({
            where: (notifications, { eq }) => {
                return eq(notifications.receiverId, userId)
            }
        });

        return notificationsByUser;
    }
}

export default NotificationService;