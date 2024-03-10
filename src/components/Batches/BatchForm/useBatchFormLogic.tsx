import { frequencyEnum } from "@/server/db/schema";
import { z, type ZodType } from "zod";

export type FormData = {
    name: string;
    contributionAmount: number;
    seats: number;
    frequency: string;
    agreeTerms: boolean;
};

export const batchSchema: ZodType<FormData> = z
    .object({
        name: z.string(),
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
        agreeTerms: z.boolean({
            required_error: "Acepta los terminos y condiciones para continuar"
        })
    })
