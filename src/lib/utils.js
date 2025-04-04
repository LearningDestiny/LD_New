import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const  formatDate =(isoString)  => {
  const date = new Date(isoString);

  // Extract the day
  const day = date.getDate();

  // Extract the full month name
  const month = date.toLocaleString("default", { month: "long" });

  // Extract the year
  const year = date.getFullYear();

  return { day, month, year };
}