import { frequencyEnum } from "@/server/db/schema";
import { z } from "zod";

export const Frequency = z.enum(frequencyEnum.enumValues).Enum;
export enum TranslatedFrequency {
    WEEKLY = "Semanalmente",
    BIWEEKLY = "Quincenalmente",
    MONTHLY = "Mensualmente"
}