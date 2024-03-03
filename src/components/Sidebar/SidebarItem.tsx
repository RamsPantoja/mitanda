"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItemProps } from "./_types";


const SibedarItem = ({ href, Icon, label }: SidebarItemProps) => {
    const pathname = usePathname();

    return (
        <li className="flex flex-row gap-2 items-center">
            <Link className="flex w-full" href={href}>
                <div className={cn({
                    "flex flex-row gap-2 items-center p-2 w-full rounded-md": pathname !== href,
                    "flex flex-row gap-2 items-center p-2 w-full rounded-md bg-blackMain": pathname === href
                })}>
                    <Icon className={cn({
                        "w-4 h-4": true,
                        "text-grayMain": pathname !== href,
                        " text-whiteMain": pathname === href
                    })} />
                    <p
                        className={cn({
                            "text-sm font-bold": true,
                            "text-grayMain": pathname !== href,
                            " text-whiteMain": pathname === href
                        })}
                    >{label}</p>
                </div>
            </Link>
        </li>
    )
}

export default SibedarItem;