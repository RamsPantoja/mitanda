import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}