import { api } from "@/trpc/react";
import { type Session } from "next-auth";

type UseNotificationsLogicProps = {
    session: Session
}

const useNotificationsLogic = ({ session }: UseNotificationsLogicProps) => {
    const { data: notificationsData, isLoading: notificationsIsLoading, error: notificationsError } = api.notification.notificationsByUser.useQuery({
        userId: session.user.id
    });

    const { mutate: markAsSeenMutation } = api.notification.markAsSeen.useMutation();

    const onSeeNotification = (notificationId: string) => {
        markAsSeenMutation({
            notificationId
        });
    }

    return {
        notificationsData,
        notificationsIsLoading,
        notificationsError,
        onSeeNotification
    }
}

export default useNotificationsLogic;