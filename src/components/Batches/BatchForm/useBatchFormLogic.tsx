import { frequencyEnum } from "@/server/db/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

    return {
        useFormBatch
    }
}

export default useBatchFormLogic;