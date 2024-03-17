import { Fragment } from "react";

type ErrorMessageInputProps = {
    message?: string | undefined
    status: "SUCCESS" | "ERROR" | "WARNING"
}

const InputFeedbackMessage = ({ status, message }: ErrorMessageInputProps) => {
    return <Fragment>
        {
            status === "ERROR" && <span className=" text-red-500 text-xs">{message}</span>
        }
        {
            status === "SUCCESS" && <span className=" text-green-500 text-xs">{message}</span>
        }
        {
            status === "WARNING" && <span className=" text-yellow-500 text-xs">{message}</span>
        }
    </Fragment>
}

export default InputFeedbackMessage;