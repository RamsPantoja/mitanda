import { frequencyEnum } from "@/server/db/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

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
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const onCreateBatch = (data: BatchValidationSchema) => {
        createBatchMutation({
            batchInput: {
                name: data.name,
                contributionAmount: data.contributionAmount,
                seats: data.seats,
                frequency: data.frequency
            }
        });
    }

    return {
        onCreateBatch,
        useFormBatch,
        displayBatchForm,
        setDisplayBatchForm,
        createBatchMutationIsPending,
    }
}

export default useBatchFormLogic;