"use client"

import { Cog6ToothIcon, UserGroupIcon, CreditCardIcon, QuestionMarkCircleIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import SibedarItem from "./SidebarItem";

const Sidebar = ({ }) => {
    return (
        <nav className="flex w-full h-full">
            <ul className="flex flex-col w-full">
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
                <SibedarItem
                    Icon={Cog6ToothIcon}
                    label="Configuración"
                    href="/dashboard/settings"
                />
                <SibedarItem
                    Icon={ArrowLeftEndOnRectangleIcon}
                    label="Salir"
                    href="/logout"
                />
            </ul>
        </nav>
    )
}

export default Sidebar;