import { Fragment } from "react";
import useBatchRequestLogic from "./useBatchRequestLogic";
import CustomAlertDialog from "@/components/common/AlertDialog";

const BatchRequestDialog = () => {
    const {
        displayBatchRequestDialog,
        setDisplayBatchRequestDialog,
        batchRequestData
    } = useBatchRequestLogic();

    return (
        <Fragment>
            {
                batchRequestData && batchRequestData.type === "START" &&
                <CustomAlertDialog
                    cancelText="Descartar"
                    actionText="Confirmar"
                    title="Solicitud de tanda"
                    description={"El administrador ha solicitado iniciar la tanda. Para confirmar tu participación, dá click en el botón `Confirmar`"}
                    onCancel={() => {
                        setDisplayBatchRequestDialog(false);
                    }}
                    onAction={() => {
                        console.log("Acepto")
                    }}
                    isPending={false}
                    open={displayBatchRequestDialog}
                />
            }
        </Fragment>
    )
}

export default BatchRequestDialog;