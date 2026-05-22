import { createDealAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import DealForm from "@/app/admin/deals/DealForm";

export default async function AdminNewDealPage() {
  await requireAdmin();

  return (
    <DealForm
      title="Create deal"
      description="Add a new deal, publish it, and optionally pin it as today's featured recommendation."
      submitLabel="Create deal"
      action={createDealAction}
    />
  );
}
