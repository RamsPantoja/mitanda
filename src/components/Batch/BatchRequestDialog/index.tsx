import { Fragment } from "react";
import useBatchRequestLogic from "./useBatchRequestLogic";
import CustomAlertDialog from "@/components/common/AlertDialog";

const BatchRequestDialog = () => {
    const {
        displayBatchRequestDialog,
        setDisplayBatchRequestDialog,
        batchRequestData,
        checkStartBatchRequestMutation,
        checkStartBatchRequestIsPending
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
                        checkStartBatchRequestMutation({
                            batchId: batchRequestData.batchId,
                            participantIds: batchRequestData.batchRequestsToUsers.map((item) => item.userId),
                            batchRequestId: batchRequestData.id
                        })
                    }}
                    isPending={checkStartBatchRequestIsPending}
                    open={displayBatchRequestDialog}
                />
            }
        </Fragment>
    )
}

export default BatchRequestDialog;