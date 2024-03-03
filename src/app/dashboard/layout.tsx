import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Dasboard",
  description: "Plataforma para administrar tus tandas!",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen bg-blackMain">
      <div className=" grid grid-cols-[256px_minmax(0,_1fr)] grid-rows-1 gap-2 p-2 w-full h-full">
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-full rounded-md p-4 flex flex-col bg-blackLigth">
            <Sidebar />
          </div>
        </div>
        <div className="flex w-full h-full">
          <div className="w-full h-full rounded-md p-4 flex overflow-auto bg-blackLigth">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}