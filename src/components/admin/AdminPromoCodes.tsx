"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { formatIstDateTime, istInputToIso, manageApi, productLabel, type PromoCode } from "@/lib/admin";
import { formatPaise } from "@/lib/payments";

/** Product groups a code can be limited to. */
const productGroups: { id: string; label: string; slugs: string[] }[] = [
  { id: "webinar", label: "Webinar seats", slugs: ["webinar"] },
  { id: "pdf", label: "PDF course", slugs: ["pdf-course"] },
  {
    id: "pt",
    label: "Coaching plans (all 9)",
    slugs: ["premium", "elite", "diamond"].flatMap((p) => ["1m", "3m", "6m"].map((d) => `pt-${p}-${d}`)),
  },
];

const describeValue = (c: Pick<PromoCode, "kind" | "value">) =>
  c.kind === "PERCENT" ? `${c.value}% off` : `${formatPaise(c.value)} off`;

function describeProducts(slugs: string[]) {
  if (slugs.length === 0) return "Every product";
  const whole = productGroups.filter((g) => g.slugs.every((s) => slugs.includes(s)));
  const covered = new Set(whole.flatMap((g) => g.slugs));
  return [...whole.map((g) => g.label), ...slugs.filter((s) => !covered.has(s)).map(productLabel)].join(", ");
}

/** Admin: create promo codes and switch them on or off. */
export default function AdminPromoCodes() {
  return (
    <AdminShell
      title="Promo codes"
      intro="Customers type a code before paying. Each person can use a code once. A code never brings the price below ₹1. For the ₹999 discovery call: create a code worth ₹999 for coaching plans, limited to 1 use, and send it to that person."
    >
      <PromoContent />
    </AdminShell>
  );
}

function PromoContent() {
  const [codes, setCodes] = useState<PromoCode[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const handleError = useCallback((e: unknown) => setError(adminErrorMessage(e)), []);

  useEffect(() => {
    manageApi.promoCodes().then((r) => setCodes(r.codes), handleError);
  }, [reload, handleError]);

  async function toggle(c: PromoCode) {
    setError("");
    try {
      await manageApi.setPromoActive(c.id, !c.active);
      setNotice(`${c.code} is ${c.active ? "switched off" : "switched on"}.`);
      setReload((r) => r + 1);
    } catch (e) {
      handleError(e);
    }
  }

  const now = new Date();
  const state = (c: PromoCode) =>
    !c.active
      ? "Off"
      : c.endsAt && new Date(c.endsAt) <= now
        ? "Expired"
        : c.startsAt && new Date(c.startsAt) > now
          ? "Not started"
          : c.maxUses !== null && c.uses >= c.maxUses
            ? "Used up"
            : "Active";

  return (
    <section aria-label="Promo codes" className="flex flex-col gap-4">
      {error && (
        <p role="alert" className={adminUi.error}>
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className={adminUi.success}>
          {notice}
        </p>
      )}

      {creating ? (
        <PromoForm
          onCancel={() => setCreating(false)}
          onSaved={(c) => {
            setCreating(false);
            setNotice(`${c.code} is ready: ${describeValue(c)}.`);
            setReload((r) => r + 1);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setNotice("");
            setCreating(true);
          }}
          className={`${adminUi.smallButton("dark")} self-start`}
        >
          Create a code
        </button>
      )}

      <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[900px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>Code</th>
              <th scope="col" className={adminUi.th}>Discount</th>
              <th scope="col" className={adminUi.th}>Works on</th>
              <th scope="col" className={adminUi.th}>Valid</th>
              <th scope="col" className={`${adminUi.th} text-right`}>Used</th>
              <th scope="col" className={adminUi.th}>Status</th>
              <th scope="col" className={adminUi.th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {codes?.map((c) => {
              const s = state(c);
              return (
                <tr key={c.id} className="border-b border-line align-top last:border-0">
                  <td className={adminUi.td}>
                    <span className="font-mono font-semibold">{c.code}</span>
                    {c.note && <span className="block text-ink-soft">{c.note}</span>}
                  </td>
                  <td className={`${adminUi.td} whitespace-nowrap`}>{describeValue(c)}</td>
                  <td className={adminUi.td}>{describeProducts(c.productSlugs)}</td>
                  <td className={`${adminUi.td} whitespace-nowrap`}>
                    {c.startsAt || c.endsAt ? (
                      <>
                        {c.startsAt && <span className="block">From {formatIstDateTime(c.startsAt)}</span>}
                        {c.endsAt && <span className="block">Until {formatIstDateTime(c.endsAt)}</span>}
                      </>
                    ) : (
                      <span className="text-ink-soft">No time limit</span>
                    )}
                  </td>
                  <td className={`${adminUi.td} whitespace-nowrap text-right tabular-nums`}>
                    {c.uses}
                    {c.maxUses !== null && ` of ${c.maxUses}`}
                    {c.discountGivenPaise > 0 && (
                      <span className="block text-ink-soft">{formatPaise(c.discountGivenPaise)} off in total</span>
                    )}
                  </td>
                  <td className={adminUi.td}>
                    <span className={`${adminUi.badge} ${s === "Active" ? "bg-peach" : "bg-sand"}`}>{s}</span>
                  </td>
                  <td className={`${adminUi.td} text-right`}>
                    <button type="button" onClick={() => toggle(c)} className={`${adminUi.smallButton()} bg-white`}>
                      {c.active ? "Switch off" : "Switch on"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {codes && codes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  No codes yet.
                </td>
              </tr>
            )}
            {!codes && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-soft">
                  Loading codes…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PromoForm({ onCancel, onSaved }: { onCancel: () => void; onSaved: (c: PromoCode) => void }) {
  const [kind, setKind] = useState<"PERCENT" | "AMOUNT">("AMOUNT");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (k: string) => String(data.get(k) ?? "").trim();
    const groups = data.getAll("products").map(String);
    const value = Number(read("value"));
    setBusy(true);
    setError("");
    try {
      const saved = await manageApi.createPromo({
        code: read("code"),
        kind,
        value: kind === "AMOUNT" ? Math.round(value * 100) : value,
        productSlugs: productGroups.filter((g) => groups.includes(g.id)).flatMap((g) => g.slugs),
        startsAt: read("startsAt") ? istInputToIso(read("startsAt")) : null,
        endsAt: read("endsAt") ? istInputToIso(read("endsAt")) : null,
        maxUses: read("maxUses") ? Number(read("maxUses")) : null,
        note: read("note"),
      });
      onSaved(saved);
    } catch (e) {
      setError(adminErrorMessage(e));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={`${adminUi.card} flex flex-col gap-4`}>
      <h2 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">Create a code</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-code" className={adminUi.label}>
            Code <span className="font-normal text-ink-soft">(letters and digits, no spaces)</span>
          </label>
          <input
            id="p-code"
            name="code"
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_\-]{3,30}"
            placeholder="e.g. DIWALI20"
            className={`${adminUi.input} font-mono uppercase`}
          />
        </div>
        <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
          <legend className={`${adminUi.label} mb-1.5 p-0`}>Discount type</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["AMOUNT", "Fixed ₹ amount"],
                ["PERCENT", "Percentage"],
              ] as const
            ).map(([k, label]) => (
              <label
                key={k}
                className="flex min-h-[48px] cursor-pointer items-center gap-2 rounded-[14px] border border-field bg-white px-3 text-[15px] has-[:checked]:border-ink has-[:checked]:bg-peach"
              >
                <input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} className="accent-ink" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-value" className={adminUi.label}>
            {kind === "AMOUNT" ? "Amount off (₹)" : "Percent off (%)"}
          </label>
          <input
            id="p-value"
            name="value"
            type="number"
            required
            min={1}
            max={kind === "PERCENT" ? 100 : 100000}
            step="1"
            defaultValue={kind === "AMOUNT" ? 999 : 10}
            key={kind}
            className={adminUi.input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-max" className={adminUi.label}>
            Total uses <span className="font-normal text-ink-soft">(empty = no limit)</span>
          </label>
          <input id="p-max" name="maxUses" type="number" min={1} step="1" className={adminUi.input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-start" className={adminUi.label}>
            Starts <span className="font-normal text-ink-soft">(IST; empty = now)</span>
          </label>
          <input id="p-start" name="startsAt" type="datetime-local" className={adminUi.input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-end" className={adminUi.label}>
            Ends <span className="font-normal text-ink-soft">(IST; empty = never)</span>
          </label>
          <input id="p-end" name="endsAt" type="datetime-local" className={adminUi.input} />
        </div>
      </div>
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className={`${adminUi.label} mb-1.5 p-0`}>
          Works on <span className="font-normal text-ink-soft">(none ticked = every product)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {productGroups.map((g) => (
            <label
              key={g.id}
              className="flex min-h-[48px] cursor-pointer items-center gap-2 rounded-[14px] border border-field bg-white px-3.5 text-[15px] has-[:checked]:border-ink has-[:checked]:bg-peach"
            >
              <input type="checkbox" name="products" value={g.id} className="accent-ink" />
              {g.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="p-note" className={adminUi.label}>
          Note for the team <span className="font-normal text-ink-soft">(optional, customers never see it)</span>
        </label>
        <input id="p-note" name="note" maxLength={200} placeholder="e.g. Discovery call: Rahul" className={adminUi.input} />
      </div>
      {error && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={adminUi.smallButton("dark")}>
          {busy ? "Creating…" : "Create code"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={`${adminUi.smallButton()} bg-white`}>
          Cancel
        </button>
      </div>
    </form>
  );
}
