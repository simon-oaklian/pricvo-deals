export type Category =
  | "vanity"
  | "mirror"
  | "faucet"
  | "lighting"
  | "accessory"
  | "mattress";

export const CATEGORIES: { value: Category; label: string; active: boolean }[] = [
  { value: "vanity", label: "Bathroom Vanity", active: true },
  { value: "mirror", label: "Bathroom Mirror", active: true },
  { value: "faucet", label: "Faucet", active: false },
  { value: "lighting", label: "Lighting", active: false },
  { value: "accessory", label: "Accessory", active: false },
  { value: "mattress", label: "Mattress", active: false }
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function discountPercent(originalPrice: number, dealPrice: number) {
  if (!originalPrice) {
    return 0;
  }

  return Math.max(0, Math.round(((originalPrice - dealPrice) / originalPrice) * 100));
}
