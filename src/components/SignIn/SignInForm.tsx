"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";

const SignInForm = ({ }) => {
    const onSignInWithGoogle = async () => {
        await signIn("google")
    }

    return (
        <Card className=" bg-blackNormal max-w-72 border-none">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-center flex-col gap-4">
                        <Image
                            src='/mitanda-isotipo.svg'
                            alt="mitanda icon"
                            unoptimized
                            sizes="100vw"
                            width={60}
                            height={60}
                        />

                        <p className="text-whiteMain">miTanda</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-grayMain">Al crear una cuenta, acepta los Términos de servicio y nuestra Política de privacidad.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={onSignInWithGoogle} className=" bg-greenMain text-blackMain flex gap-2 hover:text-whiteMain">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="none"><g clipPath="url(#clip0_46_9139)"><path d="M10 8.18188V12.0546H15.3818C15.1455 13.3001 14.4363 14.3547 13.3727 15.0638L16.6182 17.582C18.5091 15.8366 19.6 13.2729 19.6 10.2275C19.6 9.51837 19.5364 8.83648 19.4182 8.18199L10 8.18188Z" fill="#1976D2"></path><path d="M4.39569 11.9033L3.66372 12.4636L1.07275 14.4818C2.71821 17.7454 6.09071 20 9.99979 20C12.6997 20 14.9634 19.1091 16.618 17.5819L13.3725 15.0636C12.4816 15.6636 11.3452 16.0273 9.99979 16.0273C7.39979 16.0273 5.19075 14.2728 4.39978 11.9091L4.39569 11.9033Z" fill="#4CAF50"></path><path d="M1.07278 5.51831C0.390993 6.86372 0.00012207 8.38193 0.00012207 10.0001C0.00012207 11.6183 0.390993 13.1365 1.07278 14.4819C1.07278 14.4909 4.40013 11.9 4.40013 11.9C4.20013 11.3 4.08191 10.6637 4.08191 9.99999C4.08191 9.33626 4.20013 8.69993 4.40013 8.09993L1.07278 5.51831Z" fill="#FFC107"></path><path d="M10 3.98184C11.4728 3.98184 12.7818 4.49092 13.8273 5.47276L16.6909 2.60914C14.9545 0.990977 12.7 0 10 0C6.09091 0 2.71821 2.24546 1.07275 5.51822L4.4 8.10005C5.19087 5.73638 7.4 3.98184 10 3.98184Z" fill="#FF3D00"></path></g><defs><clipPath id="clip0_46_9139"><rect width="19.6" height="20" fill="white"></rect></clipPath></defs></svg>
                    Iniciar sesión con Google
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SignInForm;