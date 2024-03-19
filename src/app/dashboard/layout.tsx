import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import { type Session, getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Dasboard",
  description: "Plataforma para administrar tus tandas!",
};

const getUserSession = async () => {
  let session: Session | null = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    throw new Error('Failed to create task')
  }

  if (session === null) {
    redirect(`/sign_in`) // Navigate to the new post page
  }

  return session
}

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
          <div className="w-full h-full rounded-md p-4 flex overflow-auto bg-blackLigth">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}