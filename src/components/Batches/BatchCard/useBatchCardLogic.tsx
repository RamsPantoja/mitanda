import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from 'usehooks-ts'


const useBatchCardLogic = () => {
    const utils = api.useUtils();
    const [displayDeleteBatchAlert, setDisplayDeleteBatchAlert] = useState<boolean>(false);
    const [copiedText, copy] = useCopyToClipboard();
    const [inviteLinkCopied, setInviteLinkCopied] = useState<boolean>(false);


    const { mutate: deleteBatchMutation, isPending: deleteBatchMutationIsPending } = api.batch.delete.useMutation({
        onSuccess: async (data) => {
            toast.success(`La tanda <<${data?.name}>> ha sido eliminada`);
            await utils.batch.ownBatches.invalidate();
            await utils.batch.batches.invalidate();
            setDisplayDeleteBatchAlert(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const onDelete = (batchId: string) => {
        deleteBatchMutation({
            batchId
        });
    }

    const handleCopyInviteLink = async (text: string) => {
        const copied = await copy(text);
        setInviteLinkCopied(copied);
    }

    return {
        onDelete,
        deleteBatchMutationIsPending,
        displayDeleteBatchAlert,
        setDisplayDeleteBatchAlert,
        handleCopyInviteLink,
        inviteLinkCopied,
        setInviteLinkCopied,
        copiedText
    }
}

export default useBatchCardLogic;