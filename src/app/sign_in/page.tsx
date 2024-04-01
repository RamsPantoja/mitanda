import SignInForm from "@/components/SignIn/SignInForm";
import { getUserSession } from "./actions";

type SignInProps = {
    params: {
        callback_url: string
    }
}

const SignIn = async ({ params }: SignInProps) => {
    await getUserSession();

    console.log(params);

    return (
        <div className="flex w-full h-full absolute">
            <div className="flex w-full h-full items-center justify-center relative">
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-blackLigth bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                <SignInForm
                    callbackUrl=""
                />
            </div>
        </div>
    )
}

export default SignIn;