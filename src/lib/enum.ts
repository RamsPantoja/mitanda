import { batchStatusEnum, frequencyEnum, paymentCaseEnum } from "@/server/db/schema";
import { z } from "zod";

const frequency = z.enum(frequencyEnum.enumValues);
export type Frequency = z.infer<typeof frequency>

const batchStatus = z.enum(batchStatusEnum.enumValues);
export type BatchStatus = z.infer<typeof batchStatus>;

const paymentCase = z.enum(paymentCaseEnum.enumValues);
export type PaymentCase = z.infer<typeof paymentCase>;

export enum TranslatedFrequency {
    WEEKLY = "Semanalmente",
    BIWEEKLY = "Quincenalmente",
    MONTHLY = "Mensualmente"
}