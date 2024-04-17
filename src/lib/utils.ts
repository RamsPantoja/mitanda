import { env } from "@/env"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type MapSkeletonsProps = {
  numberOfSkeletons: number
  skeleton: JSX.Element
}

export const mapSkeletons = ({ numberOfSkeletons, skeleton }: MapSkeletonsProps) => {
  const skeletons: JSX.Element[] = [];

  for (let index = 0; index < numberOfSkeletons; index++) {
    skeletons.push(skeleton);
  }

  return skeletons
}

export const getPublicBaseUrl = () => {
  if (env.NEXT_PUBLIC_BASE_URL) return env.NEXT_PUBLIC_BASE_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);
