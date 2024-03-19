import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth";
import SignInForm from "@/components/SignIn/SignInForm";
import { redirect } from 'next/navigation'
import { type Session } from "next-auth";

const getUserSession = async () => {
    let session: Session | null = null;

    try {
        session = await getServerSession(authOptions);
    } catch (error) {
        throw new Error('Failed to create task')
    }

    if (session !== null) {
        redirect(`/dasboard`) // Navigate to the new post page
    }
}

const SignIn = async ({ }) => {
    await getUserSession();
    
    return (
        <div className="flex w-full h-full absolute">
            <div className="flex w-full h-full items-center justify-center relative">
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-blackLigth bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                <SignInForm />
            </div>
        </div>
    )
}

export default SignIn;