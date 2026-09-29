"use client";

import { useState } from "react";
import type { Application, ApplicationStatus } from "../../lib/types";

const statuses: ApplicationStatus[] = ["submitted", "reviewing", "shortlisted", "interview", "accepted", "rejected"];

export function ApplyButton({ jobId, employerId }: { jobId: string; employerId: string }) {
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  async function apply() {
    setPending(true);
    const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, employerId, coverLetter: "Applying with my Flowpilot profile." }) });
    setPending(false);
    if (response.status === 401) {
      setNotice("Sign in with a talent account before applying.");
      return;
    }
    setNotice(response.ok ? "Application submitted. Keep your profile and interview examples ready." : "Unable to submit application.");
  }
  return <div><button onClick={apply} disabled={pending} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Submitting..." : "Apply with profile"}</button>{notice && <p className="mt-3 text-sm font-semibold text-green-700" role="status">{notice}</p>}</div>;
}

export function ApplicationStatusControl({ application }: { application: Application }) {
  const [status, setStatus] = useState(application.status);
  const [notice, setNotice] = useState("");
  async function update(next: ApplicationStatus) {
    const previous = status;
    setStatus(next);
    const response = await fetch(`/api/applications/${application.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (!response.ok) {
      setStatus(previous);
      setNotice("Status update failed.");
      return;
    }
    setNotice("Status updated.");
  }
  return <div><select aria-label="Application status" value={status} onChange={(event) => update(event.target.value as ApplicationStatus)} className="rounded-lg border border-gray-300 px-3 py-2">{statuses.map((item) => <option key={item}>{item}</option>)}</select>{notice && <p className="mt-2 text-xs font-semibold text-gray-600" role="status">{notice}</p>}</div>;
}
