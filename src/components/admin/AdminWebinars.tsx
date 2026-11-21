"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell, { adminErrorMessage, adminUi } from "@/components/admin/AdminShell";
import {
  type AdminWebinar,
  downloadCsv,
  formatIstDateTime,
  istInputToIso,
  isoToIstInput,
  manageApi,
} from "@/lib/admin";
import { formatPaise } from "@/lib/payments";

const statusLabel: Record<AdminWebinar["status"], string> = {
  UPCOMING: "Upcoming",
  FINISHED: "Finished",
  CANCELLED: "Cancelled",
};

/** Admin: schedule, edit and cancel webinars; download buyers. */
export default function AdminWebinars() {
  return (
    <AdminShell
      title="Webinars"
      intro="Schedule a webinar and it appears on the webinar page for booking. Times are Indian time (IST). Buyers see the meeting link in My account 15 minutes before the start."
    >
      <WebinarsContent />
    </AdminShell>
  );
}

function WebinarsContent() {
  const [webinars, setWebinars] = useState<AdminWebinar[] | null>(null);
  const [editing, setEditing] = useState<AdminWebinar | "new" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);

  const handleError = useCallback((e: unknown) => setError(adminErrorMessage(e)), []);

  useEffect(() => {
    manageApi.webinars().then((r) => setWebinars(r.webinars), handleError);
  }, [reload, handleError]);

  async function cancel(w: AdminWebinar) {
    const sold = w.seatsSold > 0 ? ` ${w.seatsSold} people bought a seat: refund them in Orders & refunds.` : "";
    if (!window.confirm(`Cancel “${w.title}”? It will no longer be sold.${sold}`)) return;
    setError("");
    try {
      await manageApi.updateWebinar(w.id, { status: "CANCELLED" });
      setNotice(`“${w.title}” is cancelled.${sold}`);
      setReload((r) => r + 1);
    } catch (e) {
      handleError(e);
    }
  }

  async function buyers(w: AdminWebinar) {
    setError("");
    try {
      const { buyers } = await manageApi.webinarBuyers(w.id);
      downloadCsv(`webinar-buyers-${isoToIstInput(w.startsAt).slice(0, 10)}.csv`, [
        ["Name", "Email", "Phone", "Bought at (IST)", "Paid (₹)", "Manual"],
        ...buyers.map((b) => [
          b.name,
          b.email,
          b.phone,
          formatIstDateTime(b.boughtAt),
          b.amountPaise / 100,
          b.manual ? "yes" : "",
        ]),
      ]);
    } catch (e) {
      handleError(e);
    }
  }

  return (
    <section aria-label="Webinars" className="flex flex-col gap-4">
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

      {editing ? (
        <WebinarForm
          webinar={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={(w, created) => {
            setEditing(null);
            setNotice(created ? `“${w.title}” is scheduled and open for booking.` : `“${w.title}” is saved.`);
            setReload((r) => r + 1);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setNotice("");
            setEditing("new");
          }}
          className={`${adminUi.smallButton("dark")} self-start`}
        >
          Schedule a webinar
        </button>
      )}

      <div className="relative overflow-x-auto rounded-3xl border border-line bg-white">
        <table className={`${adminUi.table} min-w-[860px]`}>
          <thead>
            <tr className="border-b border-line text-[13px] text-ink-soft">
              <th scope="col" className={adminUi.th}>When (IST)</th>
              <th scope="col" className={adminUi.th}>Title</th>
              <th scope="col" className={`${adminUi.th} text-right`}>Price</th>
              <th scope="col" className={`${adminUi.th} text-right`}>Seats sold</th>
              <th scope="col" className={adminUi.th}>Status</th>
              <th scope="col" className={adminUi.th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {webinars?.map((w) => {
              const past = new Date(w.startsAt) <= new Date();
              return (
                <tr key={w.id} className="border-b border-line align-top last:border-0">
                  <td className={`${adminUi.td} whitespace-nowrap`}>
                    {formatIstDateTime(w.startsAt)}
                    <span className="block text-ink-soft">{w.durationMinutes} min</span>
                  </td>
                  <td className={adminUi.td}>
                    <span className="font-semibold">{w.title}</span>
                    <span className="block text-ink-soft">
                      {w.meetingUrl ? "Meeting link added" : "No meeting link yet"}
                    </span>
                  </td>
                  <td className={`${adminUi.td} text-right tabular-nums`}>{formatPaise(w.pricePaise)}</td>
                  <td className={`${adminUi.td} text-right tabular-nums`}>{w.seatsSold}</td>
                  <td className={adminUi.td}>
                    <span
                      className={`${adminUi.badge} ${w.status === "CANCELLED" ? "bg-sand" : past ? "border border-line" : "bg-peach"}`}
                    >
                      {w.status === "UPCOMING" && past ? "Started" : statusLabel[w.status]}
                    </span>
                  </td>
                  <td className={adminUi.td}>
                    <div className="flex flex-wrap justify-end gap-2">
                      {w.status !== "CANCELLED" && (
                        <button
                          type="button"
                          onClick={() => {
                            setNotice("");
                            setEditing(w);
                          }}
                          className={`${adminUi.smallButton()} bg-white`}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => buyers(w)}
                        disabled={w.seatsSold === 0}
                        className={`${adminUi.smallButton()} bg-white`}
                      >
                        Buyers (CSV)
                      </button>
                      {w.status === "UPCOMING" && !past && (
                        <button type="button" onClick={() => cancel(w)} className={`${adminUi.smallButton()} bg-white`}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {webinars && webinars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No webinars yet.
                </td>
              </tr>
            )}
            {!webinars && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  Loading webinars…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Create a webinar, or edit one (only the changed fields are sent). */
function WebinarForm({
  webinar,
  onCancel,
  onSaved,
}: {
  webinar: AdminWebinar | null;
  onCancel: () => void;
  onSaved: (w: AdminWebinar, created: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (k: string) => String(data.get(k) ?? "").trim();
    const input = {
      title: read("title"),
      startsAt: istInputToIso(read("startsAt")),
      durationMinutes: Number(read("duration")),
      pricePaise: Math.round(Number(read("price")) * 100),
      meetingUrl: read("meetingUrl") || null,
    };
    setBusy(true);
    setError("");
    try {
      const saved = webinar ? await manageApi.updateWebinar(webinar.id, input) : await manageApi.createWebinar(input);
      onSaved(saved, !webinar);
    } catch (e) {
      setError(adminErrorMessage(e));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={`${adminUi.card} flex flex-col gap-4`}>
      <h2 className="m-0 font-serif text-[28px] font-medium leading-[1.15]">
        {webinar ? "Edit webinar" : "Schedule a webinar"}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="w-title" className={adminUi.label}>
            Title
          </label>
          <input
            id="w-title"
            name="title"
            required
            minLength={3}
            maxLength={120}
            defaultValue={webinar?.title ?? "Live webinar with Pragy"}
            className={adminUi.input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-start" className={adminUi.label}>
            Date and time <span className="font-normal text-ink-soft">(IST)</span>
          </label>
          <input
            id="w-start"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={webinar ? isoToIstInput(webinar.startsAt) : undefined}
            className={adminUi.input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-duration" className={adminUi.label}>
            Length <span className="font-normal text-ink-soft">(minutes)</span>
          </label>
          <input
            id="w-duration"
            name="duration"
            type="number"
            required
            min={15}
            max={600}
            defaultValue={webinar?.durationMinutes ?? 90}
            className={adminUi.input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="w-price" className={adminUi.label}>
            Price <span className="font-normal text-ink-soft">(₹)</span>
          </label>
          <input
            id="w-price"
            name="price"
            type="number"
            required
            min={1}
            step="1"
            defaultValue={webinar ? webinar.pricePaise / 100 : 250}
            className={adminUi.input}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="w-link" className={adminUi.label}>
            Meeting link <span className="font-normal text-ink-soft">(Google Meet or Zoom; can be added later)</span>
          </label>
          <input
            id="w-link"
            name="meetingUrl"
            type="url"
            pattern="https://.*"
            placeholder="https://meet.google.com/…"
            defaultValue={webinar?.meetingUrl ?? ""}
            className={adminUi.input}
          />
        </div>
      </div>
      {webinar && webinar.seatsSold > 0 && (
        <p className="m-0 text-sm text-ink-soft">
          {webinar.seatsSold} people already bought a seat. A new price only applies to new buyers. If you move the date,
          tell them on WhatsApp.
        </p>
      )}
      {error && (
        <p role="alert" className="m-0 rounded-2xl bg-cream p-3.5 text-sm text-rust-dark">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={adminUi.smallButton("dark")}>
          {busy ? "Saving…" : webinar ? "Save changes" : "Schedule"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={`${adminUi.smallButton()} bg-white`}>
          Cancel
        </button>
      </div>
    </form>
  );
}
