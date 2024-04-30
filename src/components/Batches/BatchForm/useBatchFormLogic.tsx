import { frequencyEnum } from "@/server/db/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { getPublicBaseUrl } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const batchValidationSchema = z
    .object({
        name: z.string({
            required_error: "Campo requerido"
        }).min(1, "Campo requerido"),
        contributionAmount: z
            .number({
                required_error: "Campo requerido",
            })
            .min(50)
            .max(1000),
        seats: z
            .number({
                required_error: "Campo requerido"
            })
            .min(1)
            .max(10),
        frequency: z
            .enum(frequencyEnum.enumValues, {
                required_error: "Frecuencia requerida"
            }),
        agreeTerms: z.literal<boolean>(true, { errorMap: () => ({ message: "Acepta los terminos y condiciones para continuar" }) })
    })

export type BatchValidationSchema = z.infer<typeof batchValidationSchema>

const useBatchFormLogic = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const utils = api.useUtils();
    const [displayBatchForm, setDisplayBatchForm] = useState<boolean>(false);
    const useFormBatch = useForm<BatchValidationSchema>({
        resolver: zodResolver(batchValidationSchema),
        defaultValues: {
            name: '',
            contributionAmount: 100,
            seats: 1,
            frequency: "BIWEEKLY",
            agreeTerms: false
        }
    });

    const { mutate: createBatchMutation, isPending: createBatchMutationIsPending } = api.batch.create.useMutation({
        onSuccess: async () => {
            useFormBatch.reset();
            setDisplayBatchForm(false);
            toast.success('Tanda creada!');
            await utils.batch.ownBatches.invalidate();
            await utils.batch.batches.invalidate();
            await utils.batch.needToPayForBatch.invalidate();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const { mutate: batchPaymentLinkMutation, isPending: batchPaymentLinkIsPending } = api.batch.batchPaymentLink.useMutation({
        onSuccess: async (data) => {
            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { data: needToPayForBatchData, isLoading: needToPayForBatchIsLoading } = api.batch.needToPayForBatch.useQuery();

    const onCreateBatch = (data: BatchValidationSchema) => {
        if (needToPayForBatchData) {
            batchPaymentLinkMutation({
                data: {
                    items: [{
                        unitPrice: 99,
                        concept: "Creación de tanda",
                        quantity: 1
                    }],
                    currency: "MXN",
                    cancelUrl: `${getPublicBaseUrl()}${pathname}`,
                    successUrl: `${getPublicBaseUrl()}${pathname}`,
                    metadata: {
                        batchData: {
                            name: data.name,
                            contributionAmount: data.contributionAmount,
                            seats: data.seats,
                            frequency: data.frequency,
                        },
                        paymentCase: "BATCH",
                        userId: session?.user.id,
                    }
                }
            });
        } else {
            createBatchMutation({
                batchInput: {
                    name: data.name,
                    contributionAmount: data.contributionAmount,
                    seats: data.seats,
                    frequency: data.frequency
                }
            });
        }
    }

    return {
        onCreateBatch,
        useFormBatch,
        displayBatchForm,
        setDisplayBatchForm,
        createBatchMutationIsPending,
        needToPayForBatchIsLoading,
        needToPayForBatchData,
        batchPaymentLinkIsPending
    }
}

export default useBatchFormLogic;