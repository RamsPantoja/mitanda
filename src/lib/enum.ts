import { frequencyEnum } from "@/server/db/schema";
import { z } from "zod";

export const Frequency = z.enum(frequencyEnum.enumValues).Enum;