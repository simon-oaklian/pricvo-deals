"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { publishDeal, rejectDeal } from "@/lib/actions";

type Props = {
  dealId: number;
};

export default function ReviewDealActions({ dealId }: Props) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function run(action: typeof publishDeal | typeof rejectDeal) {
    setError("");
    startTransition(async () => {
      try {
        await action(dealId, note);
        setNote("");
        router.refresh();
      } catch {
        setError("Action failed");
      }
    });
  }

  return (
    <div className="flex min-w-[200px] flex-col gap-3">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add review note..."
        rows={3}
        className="field resize-y text-sm"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(publishDeal)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Publish
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(rejectDeal)}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          Reject
        </button>
        <Link
          href={`/admin/deals/${dealId}/edit`}
          className="text-center text-sm text-blue-600 underline decoration-blue-200 underline-offset-2 hover:text-blue-800"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
