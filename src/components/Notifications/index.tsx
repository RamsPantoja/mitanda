import { BellIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import useNotificationsLogic from "./useNotificationsLogic";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NotificationCard from "./NotificationCard";
import { type Session } from "next-auth";
import { mapSkeletons } from "@/lib/utils";
import NotificationSkeletonCard from "./NotificationSkeletonCard";
import { Fragment } from "react";
import FeedbackMessage from "../common/FeedbackMessage";

type NotificationsProps = {
    session: Session
}

const Notifications = ({ session }: NotificationsProps) => {
    const {
        notificationsData,
        notificationsIsLoading,
        notificationsError,
        onSeeNotification
    } = useNotificationsLogic({ session });

    const skeletons = mapSkeletons({ numberOfSkeletons: 10, skeleton: <NotificationSkeletonCard /> });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className=" h-8 m-w-8 p-0 hover:bg-blackMain"
                    variant='ghost'
                    size='icon'
                >
                    <BellIcon className="w-4 h-4 text-whiteMain" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[--radix-popover-content-available-height] overflow-auto p-0">
                {
                    notificationsIsLoading && skeletons.map((skeleton, index) => {
                        return <Fragment key={index}>
                            {skeleton}
                        </Fragment>
                    })
                }
                {
                    !notificationsIsLoading && !notificationsError && notificationsData?.map((item) => {
                        return (
                            <NotificationCard
                                key={item.id}
                                id={item.id}
                                link={item.link}
                                iconUrl={item.iconUrl}
                                seen={item.seen}
                                content={item.content}
                                createdAt={item.createdAt}
                                onSee={onSeeNotification}
                            />
                        )
                    })
                }
                {
                    !notificationsIsLoading && !notificationsError && notificationsData?.length === 0 &&
                    <div className="p-4">
                        <FeedbackMessage status="INFORMATION" message="No hay notificaciones" />
                    </div>
                }
                {
                    !notificationsIsLoading &&
                    notificationsError &&
                    <div className="p-4">
                        <FeedbackMessage status="ERROR" message="Algo salio mal! No se pueden obtener las notificaciones." />
                    </div>
                }
            </PopoverContent>
        </Popover >
    )
}

export default Notifications;