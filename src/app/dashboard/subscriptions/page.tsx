"use client";

import React, { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; 

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [defaultPM, setDefaultPM] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          sessionStorage.getItem("access_token") ||
          localStorage.getItem("access_token");
        if (!token) {
          setError("No access token found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}stripe/billing/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || data?.error || "Failed");

        setSubscriptions(data.subscriptions || []);
        setInvoices(data.invoices || []);
        setDefaultPM(data.defaultPaymentMethod || null);
        console.log("defaultPM =", data.defaultPaymentMethod);
      } catch (e: any) {
        setError(e?.message || "Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const hasSubs = subscriptions.length > 0;

  const cardText = useMemo(() => {
    const card = defaultPM?.card;
    if (!card) return "**** **** ****";
    return `**** **** **** ${card.last4 ?? ""}`.trim();
  }, [defaultPM]);

  const cardMeta = useMemo(() => {
    const card = defaultPM?.card;
    if (!card) return null;
    const brand = (card.brand || "").toUpperCase();
    const exp = `${card.exp_month}/${card.exp_year}`;
    return `${brand} • EXP ${exp}`;
  }, [defaultPM]);

  const subRows = useMemo(() => {
  return subscriptions.map((s) => {
    const item = s.items?.data?.[0];
    const price = item?.price;

    const interval = price?.recurring?.interval; // "month" | "year"

    const planName =
      interval === "year"
        ? "Yearly - AbleVu"
        : interval === "month"
        ? "Monthly - AbleVu"
        : "Plan - AbleVu";

    const amount = price?.unit_amount
      ? `$${(price.unit_amount / 100).toFixed(2)}`
      : "-";

    return {
      id: s.id,
      business: s.businessName || "—",
      plan: planName, // ✅ same style as first one
      status: s.status,
      start: s.current_period_start
        ? new Date(s.current_period_start * 1000).toLocaleDateString()
        : "-",
      end: s.current_period_end
        ? new Date(s.current_period_end * 1000).toLocaleDateString()
        : "-",
      amount,
    };
  });
}, [subscriptions]);


  const invoiceRows = useMemo(() => {
    return invoices.map((inv) => ({
      id: inv.id,
      number: inv.number || inv.id,
      date: inv.created
        ? new Date(inv.created * 1000).toLocaleDateString()
        : "-",
      status: inv.status || "-",
      amount: inv.amount_paid
        ? `$${(inv.amount_paid / 100).toFixed(2)}`
        : `$${((inv.amount_due || 0) / 100).toFixed(2)}`,
      pdf: inv.invoice_pdf,
    }));
  }, [invoices]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white px-6 py-5">
          {/* Header */}
          <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Manage Subscriptions
            </h1>
          </div>

          {/* States */}
          {loading && (
            <div className="text-sm text-gray-500">Loading billing data...</div>
          )}
          {!loading && error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          {/* Card */}
          <section className="mt-4">
            <div className="w-[400px] h-[230px] rounded-2xl bg-[url('/assets/images/subscription-card.avif')] bg-cover bg-center shadow-lg relative overflow-hidden p-5">
              <div className="absolute inset-0">
                <div className="absolute w-[300px] h-[300px] bg-[#101b45] opacity-40 rounded-full top-10 -left-20 blur-2xl"></div>
              </div>

              <div className="relative">
                <div className="w-10 h-8 bg-[url('/assets/images/Chip.svg')] bg-cover bg-center rounded-sm"></div>
              </div>

              <div className="absolute right-5 top-5 text-white font-bold underline text-md cursor-pointer">
                Change Card
              </div>

              {/* Card brand / exp */}
              <div className="absolute bottom-12 left-5 text-white font-semibold text-sm">
                {cardMeta ? cardMeta : "No card on file"}
              </div>

              {/* Card masked number */}
              <div className="absolute bottom-5 left-5 text-white font-bold tracking-normal text-2xl">
                {cardText}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mt-10">
              Billing History
            </h2>
          </section>

          {/* Empty subscriptions */}
          {!loading && !hasSubs && (
            <section>
              <div className="flex flex-wrap gap-y-4 items-center justify-center mb-8">
                <h2 className="text-md font-semibold text-gray-900 tracking-tight mt-5">
                  No subscriptions yet!
                </h2>
              </div>
            </section>
          )}

          {/* Subscriptions table */}
          {!loading && hasSubs && (
            <section className="mt-6">
              <div className="h-fit rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="border border-gray-200 text-gray-500 text-sm">
                    <tr>
                      <th className="py-3 pr-3 pl-3">Business</th>
                      <th className="px-6 py-3">Plan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Start Date</th>
                      <th className="px-6 py-3">End Date</th>
                      <th className="px-3 py-3 text-start">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subRows.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 pr-4 pl-3">{item.business}</td>
                        <td className="px-6 pr-4 pl-3">{item.plan}</td>
                        <td className="px-6 py-4">{item.status}</td>
                        <td className="px-6 py-4">{item.start}</td>
                        <td className="px-6 py-4 font-medium">{item.end}</td>
                        <td className="px-6 py-4">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Billing History (Invoices) */}
          {!loading && invoiceRows.length > 0 && (
            <section className="mt-8">
              <div className="h-fit rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="border border-gray-200 text-gray-500 text-sm">
                    <tr>
                      <th className="w-auto py-3 pr-3 pl-3">Invoice</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-3 py-3 text-start">Amount</th>
                      <th className="px-6 py-3">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceRows.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 pr-4 pl-3">{r.number}</td>
                        <td className="px-6 py-4">{r.date}</td>
                        <td className="px-6 py-4">{r.status}</td>
                        <td className="px-6 py-4">{r.amount}</td>
                        <td className="px-6 py-4">
                          {r.pdf ? (
                            <a
                              href={r.pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              Download
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
