import { BellIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import useNotificationsLogic from "./useNotificationsLogic";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"



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
            <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>

    )
}

export default Notifications;