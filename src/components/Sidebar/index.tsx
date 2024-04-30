"use client"

import { ArrowLeftEndOnRectangleIcon, UserGroupIcon, QuestionMarkCircleIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import SibedarItem from "./SidebarItem";
import { signOut } from "next-auth/react"
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Session } from "next-auth";
import Notifications from "../Notifications";
import CustomAlertDialog from "../common/AlertDialog";
import useSidebarLogic from "./useSidebarLogic";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type SidebarProps = {
    session: Session
}

const Sidebar = ({ session }: SidebarProps) => {
    const {
        displaySignOutAlert,
        setDisplaySignOutAlert
    } = useSidebarLogic();

    return (
        <TooltipProvider delayDuration={200}>
            <nav className="flex w-full h-full flex-col gap-4">
                <ul className="flex flex-col w-full h-full">
                    <SibedarItem
                        Icon={UserGroupIcon}
                        label="Tandas"
                        href="/dashboard/batches"
                    />
                    <SibedarItem
                        Icon={CurrencyDollarIcon}
                        label="Balance"
                        href="/dashboard/balance"
                    />
                    <SibedarItem
                        Icon={QuestionMarkCircleIcon}
                        label="Ayuda"
                        href="https://heroicons.com/outline"
                    />
                </ul>
                <div className="flex flex-row gap-2 justify-between items-center w-full">
                    <div className="flex flex-row items-center gap-2 overflow-hidden">
                        <Avatar className=" w-6 h-6">
                            <AvatarImage src={session.user.image!} />
                            <AvatarFallback>Tú</AvatarFallback>
                        </Avatar>
                        <p className="text-whiteMain text-xs truncate">{session.user.name}</p>
                    </div>
                    <div className="flex items-center">
                        <CustomAlertDialog
                            cancelText="Cancelar"
                            actionText="Confirmar"
                            title="Cerrar sesión"
                            description={"¡Atención! ¿Estás seguro de que quieres cerrar sesión?"}
                            onCancel={() => {
                                setDisplaySignOutAlert(false);
                            }}
                            onAction={() => signOut({ callbackUrl: '/sign_in' })}
                            isPending={false}
                            open={displaySignOutAlert}
                        />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className=" h-8 m-w-8 p-0 hover:bg-blackMain"
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => {
                                        setDisplaySignOutAlert(true);
                                    }}
                                >
                                    <ArrowLeftEndOnRectangleIcon className="w-4 h-4 text-whiteMain" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className=" bg-blackMain border-none max-w-60">
                                <p className="text-whiteMain">Cerrar sesión</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Notifications session={session} />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className=" bg-blackMain border-none max-w-60">
                                <p className="text-whiteMain">Notificaciones</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </nav>
        </TooltipProvider>
    )
}

export default Sidebar;