import { api } from "@/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useBatchStore from "../useBatchStore";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import { usePathname, useRouter } from "next/navigation";
import { getPublicBaseUrl } from "@/lib/utils";
import { type StripeItem } from "@/server/services/stripe";
import { type BatchRegister } from "@/server/services/batchRegister";
import { type BatchContribution } from "@/server/services/batchContribution";

type BatchRegisterWithContributions = BatchRegister & { batchContributions: BatchContribution[] };

const useBatchInformationLogic = () => {
    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();
    const { batch, participantIds } = useBatchStore((state) => state);
    const { data: session } = useSession();
    const [canContribute, setCanContribute] = useState<boolean>(true);
    const [displayAlertForInitBatch, setDisplayAlertForInitBatch] = useState<boolean>(false);

    const previousBatchRegistersWithoutUserContribution = useMemo(() => {
        if (batch) {
            return batch.batchRegisters.reduce<BatchRegisterWithContributions[]>((acc, item) => {
                const endDate = DateTime.fromJSDate(item.endDate);
                const userContribution = item.batchContributions.find((item) => item.userId === session?.user.id);

                if (DateTime.now() > endDate && !userContribution) {
                    acc = [...acc, item];
                }

                return acc;
            }, []);
        } else {
            return [];
        }
    }, [batch, session]);

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

    const { mutate: startBatchRequestMutation, isPending: startBatchRequestIsPending } = api.batchRequest.startBatchRequest.useMutation({
        onSuccess: async () => {
            toast.success("La solicitud para iniciar la tanda ha sido enviada a todos los participantes.")
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
            const items: StripeItem[] = [
                {
                    unitPrice: parseFloat(batch.contributionAmount),
                    quantity: 1,
                    concept: `Ronda ${currentBatchRegister.batchNumber}`,
                },
                ...previousBatchRegistersWithoutUserContribution.map((item) => {
                    return {
                        unitPrice: parseFloat(batch.contributionAmount),
                        quantity: 1,
                        concept: `Ronda ${item.batchNumber}`,
                    }
                })
            ];

            batchPaymentLinkData({
                data: {
                    items,
                    currency: "MXN",
                    cancelUrl: `${getPublicBaseUrl()}${pathname}`,
                    successUrl: `${getPublicBaseUrl()}${pathname}`,
                    connectedAccountId: "",//TODO add the connected account id for user
                    metadata: {
                        userId: session?.user.id,
                        batchRegisterIds: [
                            currentBatchRegister.id,
                            ...previousBatchRegistersWithoutUserContribution.map((item) => item.id)
                        ],
                        paymentCase: "BATCH",
                        batchId: batch.id
                    }
                }
            });
        }
    };

    return {
        currentBatchRegister,
        batch,
        session,
        canContribute,
        setCanContribute,
        batchPaymentLinkData,
        batchPaymentLinkIsPending,
        onContribute,
        participantIds,
        setDisplayAlertForInitBatch,
        displayAlertForInitBatch,
        startBatchRequestIsPending,
        startBatchRequestMutation
    }
}

export default useBatchInformationLogic;