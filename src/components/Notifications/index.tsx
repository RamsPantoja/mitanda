import { BellIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import useNotificationsLogic from "./useNotificationsLogic";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import NotificationCard from "./NotificationCard";

const Notifications = () => {
    const {

    } = useNotificationsLogic();

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
                <NotificationCard
                    link="/dashboard/batches"
                    iconUrl=""
                    seen={false}
                    content="<p><strong>Ram's tanda</strong> This is a notification for you!</p>"
                />
                <NotificationCard
                    link="/dashboard/batches"
                    iconUrl=""
                    seen={false}
                    content="<p><strong>Test tanda</strong> ha sido iniciada!</p>"
                />
            </PopoverContent>
        </Popover >
    )
}

export default Notifications;