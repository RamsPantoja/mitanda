import { api } from "@/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useBatchStore from "../useBatchStore";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { usePathname, useRouter } from "next/navigation";
import { getPublicBaseUrl } from "@/lib/utils";
import { type StripeItem } from "@/server/services/stripe";

const useBatchInformationLogic = () => {
    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();
    const { batch } = useBatchStore((state) => state);
    const { data: session } = useSession();
    const [canContribute, setCanContribute] = useState<boolean>(true);

    const currentBatchRegister = useMemo(() => {
        return batch?.batchRegisters.find((register) => {
            const startDate = DateTime.fromJSDate(register.startDate);
            const endDate = DateTime.fromJSDate(register.endDate);
            const currentDate = DateTime.now();

            if (currentDate > startDate && currentDate < endDate) {
                return true;
            } else {
                return false;
            }
        });
    }, [batch]);

    const { mutate: startBatchMutation, isPending: startBatchIsPending } = api.batch.startBatch.useMutation({
        onSuccess: async () => {
            toast.success("Muy bien! La tanda ha comenzado.")
            await utils.batch.batchById.invalidate();
        },
        onError: (error) => {
            toast.error("Algo salió mal!", {
                description: error.message,
                action: {
                    label: 'Enviar reporte',
                    onClick: () => console.log("R")
                },
            })
        }
    });

    const { mutate: finishBatchMutation } = api.batch.finishBatch.useMutation({
        onSuccess: async () => {
            toast.success("Genial! La tanda ha terminado.")
            await utils.batch.batchById.invalidate();
        },
        onError: (error) => {
            toast.error("Algo salió mal!", {
                description: error.message,
                action: {
                    label: 'Enviar reporte',
                    onClick: () => console.log("R")
                },
            })
        }
    });

    const { mutate: batchPaymentLinkData, isPending: batchPaymentLinkIsPending } = api.batch.batchPaymentLink.useMutation({
        onSuccess: async (data) => {
            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            }
        },
        onError: (error) => {
            toast.error("Algo salió mal!", {
                description: error.message,
                action: {
                    label: 'Enviar reporte',
                    onClick: () => console.log("R")
                },
            })
        }
    });

    useEffect(() => {
        if (currentBatchRegister) {
            const startDate = DateTime.fromJSDate(currentBatchRegister.startDate);
            const nowDate = DateTime.now()
            const diffInDays = nowDate.diff(startDate, "days").toObject();

            if (diffInDays.days && diffInDays.days !== undefined && diffInDays.days >= 2) {
                setCanContribute(false);
            }

            if (currentBatchRegister.batchContributions.find((item) => item.userId === session?.user.id)) {
                setCanContribute(false);
            }
        }
    }, [currentBatchRegister, session]);

    //Finish the batch if all batch registers have expired and the batch has "InProgress" status
    useEffect(() => {
        if (!currentBatchRegister && batch?.status === "IN_PROGRESS") {
            finishBatchMutation({
                batchId: batch.id
            });
        }
    }, [currentBatchRegister, batch, finishBatchMutation]);

    const onContribute = () => {
        if (batch && currentBatchRegister) {
            const items: StripeItem[] = [{
                unitPrice: parseFloat(batch.contributionAmount),
                quantity: 1,
                concept: `Ronda ${currentBatchRegister.batchNumber}`
            }];

            batchPaymentLinkData({
                data: {
                    items,
                    currency: "MXN",
                    cancelUrl: `${getPublicBaseUrl()}${pathname}`,
                    successUrl: `${getPublicBaseUrl()}${pathname}`,
                    metadata: {
                        userId: session?.user.id,
                        batchRegisterId: currentBatchRegister.id,
                        paymentCase: "BATCH",
                        items,
                        batchId: batch.id
                    }
                }
            })
        }
    };

    return {
        startBatchIsPending,
        startBatchMutation,
        currentBatchRegister,
        batch,
        session,
        canContribute,
        setCanContribute,
        batchPaymentLinkData,
        batchPaymentLinkIsPending,
        onContribute
    }
}

export default useBatchInformationLogic;