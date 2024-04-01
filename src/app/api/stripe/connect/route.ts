import { type NextRequest } from "next/server";

const handler = async (
    request: NextRequest,
) => {
    console.log(request.body);
    console.log("Logica para escuchar notificaciones webhook de stripe Connect");
}

export { handler as POST };