import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { MitandaButton } from "./MitandaButton";

type FeedbackMessageProps = {
    message: string
    status: "SUCCESS" | "ERROR" | "WARNING" | "INFORMATION"
}

const FeedbackMessage = ({ message, status }: FeedbackMessageProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            {
                status === "ERROR" && <div className="flex gap-2 items-center flex-col max-w-96 w-full">
                    <div className="flex gap-2 items-center">
                        <ExclamationCircleIcon className="h-6 w-6 text-grayMain" />
                        <span className=" text-grayMain text-sm">{message}</span>
                    </div>
                    <MitandaButton size="sm" variant="link">Enviar reporte</MitandaButton>
                </div>
            }
            {
                status === "SUCCESS" && <div className="flex gap-2 items-center max-w-96 w-full">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span className=" text-grayMain text-sm">{message}</span>
                </div>
            }
            {
                status === "WARNING" &&
                <div className="flex gap-2 items-center max-w-96 w-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-grayMain" />
                    <span className=" text-grayMain text-sm">{message}</span>
                </div>
            }
            {
                status === "INFORMATION" &&
                <div className="flex gap-2 items-center max-w-96 w-full">
                    <InformationCircleIcon className="h-6 w-6 text-grayMain" />
                    <span className=" text-grayMain text-sm">{message}</span>
                </div>
            }
        </div>
    )
}

export default FeedbackMessage;