import { CATEGORIES } from "@/data/deals";

export function getCategoryLabel(categoryValue: string): string {
  return CATEGORIES.find((c) => c.value === categoryValue)?.label ?? categoryValue;
}

/** Breadcrumb link for vanity/mirror; null if no dedicated category page */
export function getCategoryBrowsePath(categoryValue: string): string | null {
  if (categoryValue === "vanity") return "/category/bathroom-vanity";
  if (categoryValue === "mirror") return "/category/bathroom-mirror";
  return null;
}
