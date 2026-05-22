import { notFound } from "next/navigation";
import DealForm from "@/app/admin/deals/DealForm";
import { updateDealAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { getDealById } from "@/lib/deals";

type Props = {
  params: { id: string };
};

export default async function AdminEditDealPage({ params }: Props) {
  await requireAdmin();

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const deal = getDealById(id);
  if (!deal) {
    notFound();
  }

  async function editAction(formData: FormData) {
    "use server";
    await updateDealAction(id, formData);
  }

  return (
    <DealForm
      title="Edit deal"
      description={`Update pricing, status, featured flags, and dates for "${deal.title}".`}
      submitLabel="Save changes"
      action={editAction}
      deal={deal}
    />
  );
}
