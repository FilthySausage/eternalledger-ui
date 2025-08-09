"use client";
import { useState } from "react";
import { StatusChip } from "~~/components/StatusChip";

export default function UserDashboard() {
  const [consent, setConsent] = useState({ pension: true, bank: false, dApps: true });
  const mockEvents = [
    { type: "Birth", date: "1990-03-14" },
    { type: "Death", date: "—", status: "alive" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* Identity card */}
      <div className="card bg-base-100 shadow mb-6">
        <div className="card-body">
          <h2 className="card-title">Identity Overview</h2>
          <p><strong>Birth ID:</strong> S1234567A</p>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <StatusChip status="alive" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Lifecycle Timeline</h3>
        <ul className="steps steps-vertical">
          {mockEvents.map((e, i) => (
            <li key={i} className="step step-primary">
              {e.type} – {e.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Automation toggles */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Automation Consent</h3>
          {Object.entries(consent).map(([key, val]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="capitalize">{key}</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={val}
                onChange={() => setConsent({ ...consent, [key]: !val })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}