import { batchStatusEnum, frequencyEnum } from "@/server/db/schema";
import { z } from "zod";

const frequency = z.enum(frequencyEnum.enumValues);
export type Frequency = z.infer<typeof frequency>

const batchStatus = z.enum(batchStatusEnum.enumValues);
export type BatchStatus = z.infer<typeof batchStatus>;

export enum TranslatedFrequency {
    WEEKLY = "Semanalmente",
    BIWEEKLY = "Quincenalmente",
    MONTHLY = "Mensualmente"
}