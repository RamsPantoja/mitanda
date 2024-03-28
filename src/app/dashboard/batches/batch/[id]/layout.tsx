import Chat from "@/components/Chat";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tanda",
    description: "Tanda dashboard",
};

export default async function BatchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full">
            <div className="grid grid-cols-[minmax(0,_1fr)_350px] grid-rows-1 gap-2 w-full h-full">
                <div className="flex w-full h-full">
                    <div className="w-full h-full rounded-md flex overflow-auto bg-blackLigth">
                        {children}
                    </div>
                </div>
                <div className="w-full h-full flex flex-col">
                    <div className="w-full h-full rounded-md p-4 flex flex-col bg-blackNormal">
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    );
}