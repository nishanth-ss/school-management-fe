// ...existing code...
import React from "react";

/**
 * Small reusable stat card
 */
function StatCard({ title, value = 0, icon, accent = "indigo" }) {
  const formatted =
    typeof value === "number"
      ? value >= 1000
        ? `${(value / 1000).toFixed(1)}k`
        : value.toString()
      : value;

  const accentFrom = {
    indigo: "from-indigo-500",
    green: "from-green-500",
    rose: "from-rose-500",
  }[accent];

  const accentTo = {
    indigo: "to-indigo-400",
    green: "to-green-400",
    rose: "to-rose-400",
  }[accent];

  return (
    <div className="rounded-2xl shadow-sm p-6 bg-white flex items-center gap-4 transform transition hover:-translate-y-1">
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-xl text-white bg-gradient-to-br ${accentFrom} ${accentTo} shrink-0`}
        aria-hidden
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-bold text-gray-900">{formatted}</p>
      </div>
    </div>
  );
}

export default function DashboardStats({
  schools = 0,
  students = 0,
  subscriptions = 0,
}) {
  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <StatCard
            title="Schools"
            value={schools}
            accent="indigo"
            icon={
              // building / school icon
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 11.5L12 6l9 5.5M4.5 20.25V11.5l7.5-4.25 7.5 4.25v8.75"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21v-6h6v6"
                />
              </svg>
            }
          />

          <StatCard
            title="Students"
            value={students}
            accent="green"
            icon={
              // users icon
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 8a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Subscriptions"
            value={subscriptions}
            accent="rose"
            icon={
              // subscription / receipt icon
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 14l2 2 4-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h11"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 7h.01"
                />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
// ...existing code...