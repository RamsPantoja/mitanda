import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mitanda",
  description: "Plataforma para administrar tus tandas!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
