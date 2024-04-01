import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from 'usehooks-ts';
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { getPublicBaseUrl } from "@/lib/utils";

type BatchInviteLinkData = {
    batchId: string
}

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

    const handleCopyInviteLink = async (batchData: BatchInviteLinkData) => {
        const token = jwt.sign(batchData, env.NEXT_PUBLIC_INVITE_LINK_SECRET, { expiresIn: "1h" });
        const copied = await copy(`${getPublicBaseUrl()}/api/invite_link/${token}`);
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