"use client"

import { ArrowLeftEndOnRectangleIcon, UserGroupIcon, CreditCardIcon, QuestionMarkCircleIcon, BellIcon } from "@heroicons/react/24/outline";
import SibedarItem from "./SidebarItem";
import { signOut } from "next-auth/react"
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type Session } from "next-auth";

type SidebarProps = {
    session: Session
}

const Sidebar = ({ session }: SidebarProps) => {
    return (
        <nav className="flex w-full h-full flex-col gap-4">
            <ul className="flex flex-col w-full h-full">
                <SibedarItem
                    Icon={UserGroupIcon}
                    label="Tandas"
                    href="/dashboard/batches"
                />
                <SibedarItem
                    Icon={CreditCardIcon}
                    label="Balance"
                    href="/dashboard/balance"
                />
                <SibedarItem
                    Icon={QuestionMarkCircleIcon}
                    label="Ayuda"
                    href="/dashboard/help"
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
                    <Button
                        className=" h-8 m-w-8 p-0 hover:bg-blackMain"
                        variant='ghost'
                        size='icon'
                        onClick={() => signOut({ callbackUrl: '/sign_in' })}
                    >
                        <ArrowLeftEndOnRectangleIcon className="w-4 h-4 text-whiteMain" />
                    </Button>
                    <Button
                        className=" h-8 m-w-8 p-0 hover:bg-blackMain"
                        variant='ghost'
                        size='icon'
                        onClick={() => signOut({ callbackUrl: '/sign_in' })}
                    >
                        <BellIcon className="w-4 h-4 text-whiteMain" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar;