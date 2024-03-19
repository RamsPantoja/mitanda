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