import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { getUserSession } from "./actions";
import Feedback from "@/components/Feedback";

export const metadata: Metadata = {
  title: "Dasboard",
  description: "Plataforma para administrar tus tandas!",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  return (
    <div className="flex w-full h-screen bg-blackMain">
      <div className=" grid grid-cols-[256px_minmax(0,_1fr)] grid-rows-1 gap-2 p-2 w-full h-full">
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-full rounded-md p-4 flex flex-col bg-blackLigth">
            <Sidebar
              session={session}
            />
          </div>
        </div>
        <div className="flex w-full h-full">
          <div className="w-full h-full rounded-md p-4 gap-2 flex overflow-auto bg-blackLigth flex-col">
            <div className="flex items-center justify-end">
              <Feedback session={session} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}