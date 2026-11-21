"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import { type AdminWebinar, formatIstDateTime, manageApi, type Member, productOptions } from "@/lib/admin";

/** Usual length of each product, shown as a hint. */
const usualDays = (slug: string) =>
  slug === "pdf-course" ? 30 : slug.endsWith("-1m") ? 30 : slug.endsWith("-3m") ? 90 : slug.endsWith("-6m") ? 180 : null;

/** Admin: give someone a product by hand, look a person up, end access. */
export default function AdminAccess() {
  return (
    <AdminShell
      title="Manual access"
      intro="For people who paid outside the website (bank transfer, UPI) or who get something free. If they have no account yet, one is made with their email; they log in later with that email. Giving the same product again adds the time after their current access ends."
    >
      <AccessContent />
    </AdminShell>
  );
}

function AccessContent() {
  const [lookup, setLookup] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [notice, setNotice] = useState("");

  const find = useCallback(async (email: string) => {
    setLookupError("");
    setMember(null);
    if (!email) return;
    try {
      setMember(await manageApi.member(email));
    } catch (e) {
      setLookupError(adminErrorMessage(e));
    }
  }, []);

  async function end(accessId: string, name: string) {
    if (!member) return;
    if (!window.confirm(`End ${name} for ${member.email} now? Their badge and content go at once.`)) return;
    try {
      await manageApi.endAccess(accessId);
      setNotice(`${name} ended for ${member.email}.`);
      await find(member.email);
    } catch (e) {
      setLookupError(adminErrorMessage(e));
    }
  }

  return (
    <>
      {notice && (
        <p role="status" className={adminUi.success}>
          {notice}
        </p>
      )}

      <GrantForm
        onGranted={(email, message) => {
          setNotice(message);
          setLookup(email);
          void find(email);
        }}
      />

      <section aria-labelledby="find-title" className="flex flex-col gap-4">
        <h2 id="find-title" className={adminUi.sectionTitle}>
          Find a person
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotice("");
            void find(lookup.trim().toLowerCase());
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <div className="flex w-full max-w-[420px] flex-col gap-1.5">
            <label htmlFor="find-email" className={adminUi.label}>
              Email
            </label>
            <input
              id="find-email"
              type="email"
              required
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              className={adminUi.input}
            />
          </div>
          <button type="submit" className={adminUi.smallButton("dark")}>
            Show
          </button>
        </form>

        {lookupError && (
          <p role="alert" className={adminUi.error}>
            {lookupError}
          </p>
        )}

        {member && (
          <div className={`${adminUi.card} flex flex-col gap-4`}>
            <div>
              <p className="m-0 font-serif text-[28px] font-medium leading-[1.15]">{member.name ?? "No name yet"}</p>
              <p className="m-0 text-[15px] text-ink-soft">
                {member.email}
                {member.phone && ` · ${member.phone}`} · joined {formatIstDateTime(member.createdAt)}
                {member.lastLoginAt ? ` · last login ${formatIstDateTime(member.lastLoginAt)}` : " · never logged in"}
              </p>
            </div>

            <div className="relative overflow-x-auto">
              <table className={`${adminUi.table} min-w-[640px]`}>
                <thead>
                  <tr className="border-b border-line text-[13px] text-ink-soft">
                    <th scope="col" className={adminUi.th}>Access</th>
                    <th scope="col" className={adminUi.th}>From</th>
                    <th scope="col" className={adminUi.th}>Until</th>
                    <th scope="col" className={adminUi.th}>How</th>
                    <th scope="col" className={adminUi.th}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {member.accesses.map((a) => {
                    const upcoming = new Date(a.startsAt) > new Date() && (!a.endsAt || new Date(a.endsAt) > new Date());
                    return (
                      <tr key={a.id} className="border-b border-line align-top last:border-0">
                        <td className={adminUi.td}>
                          <span className="font-semibold">{a.product.name}</span>
                          <span
                            className={`${adminUi.badge} ml-2 ${a.active ? "bg-peach" : upcoming ? "border border-line" : "bg-sand"}`}
                          >
                            {a.active ? "Active" : upcoming ? "Starts later" : "Ended"}
                          </span>
                        </td>
                        <td className={`${adminUi.td} whitespace-nowrap`}>{formatIstDateTime(a.startsAt)}</td>
                        <td className={`${adminUi.td} whitespace-nowrap`}>
                          {a.endsAt ? formatIstDateTime(a.endsAt) : "No end"}
                        </td>
                        <td className={adminUi.td}>
                          {a.order.status === "REFUNDED" ? "Refunded" : a.order.manual ? `Manual: ${a.order.note ?? ""}` : "Bought on the site"}
                        </td>
                        <td className={`${adminUi.td} text-right`}>
                          {(a.active || upcoming) && (
                            <button
                              type="button"
                              onClick={() => end(a.id, a.product.name)}
                              className={`${adminUi.smallButton()} bg-white`}
                            >
                              End now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {member.webinarRegistrations.map((r) => (
                    <tr key={r.webinar.id} className="border-b border-line align-top last:border-0">
                      <td className={adminUi.td}>
                        <span className="font-semibold">Webinar: {r.webinar.title}</span>
                      </td>
                      <td className={`${adminUi.td} whitespace-nowrap`}>{formatIstDateTime(r.webinar.startsAt)}</td>
                      <td className={adminUi.td}>—</td>
                      <td className={adminUi.td}>{r.order.manual ? "Manual" : "Bought on the site"}</td>
                      <td className={adminUi.td} />
                    </tr>
                  ))}
                  {member.accesses.length === 0 && member.webinarRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-ink-soft">
                        Nothing bought or given yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function GrantForm({ onGranted }: { onGranted: (email: string, message: string) => void }) {
  const [product, setProduct] = useState("pdf-course");
  const [webinars, setWebinars] = useState<AdminWebinar[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (product !== "webinar") return;
    manageApi.webinars().then(
      (r) => setWebinars(r.webinars.filter((w) => w.status !== "CANCELLED" && new Date(w.startsAt) > new Date())),
      (e: unknown) => setError(adminErrorMessage(e)),
    );
  }, [product]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (k: string) => String(data.get(k) ?? "").trim();
    setBusy(true);
    setError("");
    try {
      const result = await manageApi.grant({
        email: read("email"),
        name: read("name"),
        product,
        webinarId: read("webinarId") || undefined,
        days: read("days") ? Number(read("days")) : null,
        amountPaise: Math.round(Number(read("amount") || 0) * 100),
        note: read("note"),
        sendEmail: data.get("sendEmail") === "on",
      });
      const parts = [
        `Done: ${productOptions.find((p) => p.slug === product)?.label ?? product} for ${result.email}`,
        result.endsAt ? `until ${formatIstDateTime(result.endsAt)}` : "",
      ].filter(Boolean);
      onGranted(
        result.email,
        `${parts.join(" ")}.${result.newAccount ? " A new account was made." : ""}${
          data.get("sendEmail") === "on" ? (result.emailed ? " They were emailed." : " The email could not be sent.") : ""
        }`,
      );
      setFormKey((k) => k + 1);
      setProduct("pdf-course");
    } catch (e) {
      setError(adminErrorMessage(e));
    }
    setBusy(false);
  }

  const days = usualDays(product);

  return (
    <form key={formKey} onSubmit={submit} className={`${adminUi.card} flex flex-col gap-4`}>
      <h2 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">Give access</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-email" className={adminUi.label}>
            Their email
          </label>
          <input id="g-email" name="email" type="email" required maxLength={254} className={adminUi.input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-name" className={adminUi.label}>
            Name <span className="font-normal text-ink-soft">(for a new account)</span>
          </label>
          <input id="g-name" name="name" maxLength={80} className={adminUi.input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-product" className={adminUi.label}>
            Product
          </label>
          <select id="g-product" value={product} onChange={(e) => setProduct(e.target.value)} className={adminUi.input}>
            {productOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        {product === "webinar" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="g-webinar" className={adminUi.label}>
              Which webinar
            </label>
            <select id="g-webinar" name="webinarId" required className={adminUi.input}>
              {webinars.length === 0 && <option value="">No upcoming webinars</option>}
              {webinars.map((w) => (
                <option key={w.id} value={w.id}>
                  {formatIstDateTime(w.startsAt)}: {w.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="g-days" className={adminUi.label}>
              Days{" "}
              <span className="font-normal text-ink-soft">
                (empty = {days ? `the usual ${days}` : "no end date"})
              </span>
            </label>
            <input id="g-days" name="days" type="number" min={1} max={3650} step="1" className={adminUi.input} />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="g-amount" className={adminUi.label}>
            Amount they paid <span className="font-normal text-ink-soft">(₹, 0 if free)</span>
          </label>
          <input id="g-amount" name="amount" type="number" required min={0} step="1" defaultValue={0} className={adminUi.input} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="g-note" className={adminUi.label}>
          Note <span className="font-normal text-ink-soft">(how they paid; saved with the order)</span>
        </label>
        <input
          id="g-note"
          name="note"
          required
          minLength={3}
          maxLength={300}
          placeholder="e.g. Paid by UPI, ref 1234"
          className={adminUi.input}
        />
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
        <input type="checkbox" name="sendEmail" defaultChecked className="h-4.5 w-4.5 accent-ink" />
        Email them that they have access and how to log in
      </label>
      {error && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={`${adminUi.smallButton("dark")} self-start`}>
        {busy ? "Giving access…" : "Give access"}
      </button>
    </form>
  );
}
