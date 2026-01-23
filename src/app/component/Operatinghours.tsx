"use client";

import React, { useEffect, useState } from "react";

export type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
};

interface OperatinghoursProps {
  businessId: string;
  setOpenOperatingHours: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type ScheduleRow = {
  id?: string; // existing schedule row id (for update)
  day: DayKey;
  label: string;
  active: boolean;
  openingTime: string; // "HH:MM"
  closingTime: string; // "HH:MM"
};

const DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

// 🔁 Day order map for always-sorted rows
const DAY_ORDER: Record<DayKey, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

const sortRowsByDay = (rows: ScheduleRow[]): ScheduleRow[] => {
  return [...rows].sort((a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day]);
};

// "HH:MM" -> "9 AM"
const timeToText = (time: string): string => {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr || "0", 10);

  const suffix = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours = hours - 12;

  const minPart = minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;
  return `${hours}${minPart} ${suffix}`;
};

// "HH:MM" -> ISO string
const timeToISO = (time: string): string => {
  const [hStr, mStr] = time.split(":");
  const hours = parseInt(hStr || "0", 10);
  const minutes = parseInt(mStr || "0", 10);

  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const Operatinghours: React.FC<OperatinghoursProps> = ({
  businessId,
  setOpenOperatingHours,
  onUpdated,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [rows, setRows] = useState<ScheduleRow[]>(
    sortRowsByDay(
      DAYS.map((d) => ({
        id: undefined,
        day: d.key,
        label: d.label,
        active: false,
        openingTime: "09:00",
        closingTime: "17:00",
      }))
    )
  );

  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Existing schedule load karo (profile se)
  useEffect(() => {
    const fetchExisting = async () => {
      if (!API_BASE_URL || !businessId) return;

      try {
        setLoadingExisting(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("access_token")
            : null;

        if (!token) {
          setError("Login required. No access token found.");
          setLoadingExisting(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}business/business-profile/${businessId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load business schedule (${res.status})`);
        }

        const data = await res.json();

        const schedule: {
          id: string;
          day: DayKey;
          opening_time_text: string;
          closing_time_text: string;
          active: boolean;
        }[] = data.businessSchedule || [];

        // "9 AM" / "7:30 PM" -> "HH:MM"
        const parseTextToTime = (txt: string, fallback: string) => {
          if (!txt) return fallback;

          const lower = txt.toLowerCase().trim();
          const am = lower.includes("am");
          const pm = lower.includes("pm");

          const pure = lower.replace("am", "").replace("pm", "").trim();
          const [hStr, mStr] = pure.split(":");
          let h = parseInt(hStr || "9", 10);
          const m = parseInt(mStr || "0", 10);

          if (am && h === 12) h = 0;
          if (pm && h < 12) h += 12;

          return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
        };

        // rows ko backend data se merge + sort
        setRows((prev) =>
          sortRowsByDay(
            prev.map((row) => {
              const match = schedule.find((s) => s.day === row.day);
              if (!match) return row;

              const openingTime = parseTextToTime(
                match.opening_time_text,
                row.openingTime
              );
              const closingTime = parseTextToTime(
                match.closing_time_text,
                row.closingTime
              );

              return {
                ...row,
                id: match.id, // store schedule id for updates
                active: match.active,
                openingTime,
                closingTime,
              };
            })
          )
        );

        setLoadingExisting(false);
      } catch (err: unknown) {
        console.error(err);
        const msg =
          err instanceof Error ? err.message : "Failed to load schedule";
        setError(msg);
        setLoadingExisting(false);
      }
    };

    fetchExisting();
  }, [API_BASE_URL, businessId]);

  const handleToggleDay = (index: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, active: !row.active } : row
      )
    );
  };

  const handleTimeChange = (
    index: number,
    field: "openingTime" | "closingTime",
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  // Paste Monday timings to that row
  const handlePasteFromMonday = (index: number) => {
    const mondayRow = rows.find((r) => r.day === "monday");
    if (!mondayRow) return;

    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              active: mondayRow.active,
              openingTime: mondayRow.openingTime,
              closingTime: mondayRow.closingTime,
            }
          : row
      )
    );
  };

  const handleClose = () => {
    setError(null);
    setOpenOperatingHours(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!API_BASE_URL) {
        setError("API base URL not configured.");
        return;
      }

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        setError("Login required. No access token found.");
        return;
      }

      setSaving(true);

      // Prepare full payload per row
      const fullPayload = rows.map((row) => ({
        id: row.id,
        day: row.day,
        opening_time: timeToISO(row.openingTime),
        closing_time: timeToISO(row.closingTime),
        opening_time_text: timeToText(row.openingTime),
        closing_time_text: timeToText(row.closingTime),
        active: row.active,
      }));

      const toUpdate = fullPayload.filter((s) => s.id); // existing rows
      const toCreate = fullPayload.filter((s) => !s.id && s.active); // new rows only

      // 1️⃣ Create new schedules (bulk)
      if (toCreate.length > 0) {
        const createBody = {
          businessId,
          schedules: toCreate.map(({ id, ...rest }) => rest),
        };

        const resCreate = await fetch(
          `${API_BASE_URL}business-schedules/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(createBody),
          }
        );

        const createResBody = await resCreate.json().catch(() => null);

        if (!resCreate.ok) {
          console.error("Schedule create error:", createResBody);
          const msg =
            (createResBody && createResBody.message) ||
            `Failed to create schedules (${resCreate.status})`;
          throw new Error(msg);
        }
      }

      // 2️⃣ Update existing schedules (per id)
      if (toUpdate.length > 0) {
        for (const s of toUpdate) {
          const { id: scheduleId, ...rest } = s;
          if (!scheduleId) continue;

          const resUpdate = await fetch(
            `${API_BASE_URL}business-schedules/update/${scheduleId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(rest),
            }
          );

          const updateResBody = await resUpdate.json().catch(() => null);

          if (!resUpdate.ok) {
            console.error("Schedule update error:", updateResBody);
            const msg =
              (updateResBody && updateResBody.message) ||
              `Failed to update schedule (${resUpdate.status})`;
            throw new Error(msg);
          }
        }
      }

      // ✅ Refresh profile & lift up
      if (onUpdated) {
        try {
          const profileRes = await fetch(
            `${API_BASE_URL}business/business-profile/${businessId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (profileRes.ok) {
            const profile = await profileRes.json();
            onUpdated(profile as BusinessProfile);
          }
        } catch (e) {
          console.error(
            "Failed to refresh business profile after schedule save",
            e
          );
        }
      }

      setSaving(false);
      setOpenOperatingHours(false);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to save schedule";
      setError(msg);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[630px] p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Business Schedule
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {loadingExisting ? (
          <p className="text-gray-500">Loading existing schedule...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 text-sm font-semibold text-gray-500">
                      Day of Week
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">
                      Open/Close
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">
                      Opening Time
                    </th>
                    <th className="text-center px-2 py-2 text-sm font-semibold text-gray-500">
                      /
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">
                      Closing Time
                    </th>
                    <th className="text-center px-4 py-2 text-sm font-semibold text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.day}>
                      <td className="py-3 font-semibold text-gray-800">
                        {row.label}
                      </td>

                      <td className="px-4 py-3 flex justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.active}
                          onChange={() => handleToggleDay(index)}
                          className="w-5 h-5 mt-2 text-blue-600 rounded"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={row.openingTime}
                          onChange={(e) =>
                            handleTimeChange(index, "openingTime", e.target.value)
                          }
                          className="border border-gray-300 cursor-pointer rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </td>

                      <td className="text-center px-2 py-3 font-bold">-</td>

                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={row.closingTime}
                          onChange={(e) =>
                            handleTimeChange(index, "closingTime", e.target.value)
                          }
                          className="border border-gray-300 cursor-pointer rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                        <button
                          type="button"
                          onClick={() => handlePasteFromMonday(index)}
                          title="Copy Monday hours"
                        >
                          <img
                            src="/assets/images/copy.svg"
                            alt="copy"
                            className="w-8 h-8 inline-block"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-[#0519CE] text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Operatinghours;
