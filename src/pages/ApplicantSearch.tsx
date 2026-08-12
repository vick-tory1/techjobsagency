import { useMemo, useState } from "react";
import { useRegisteredUsers } from "../hooks/useAuth";

const salary = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ApplicantSearch() {
  const registeredUsers = useRegisteredUsers();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All");
  const applicantRecords = useMemo(() => {
    const registeredApplicants = registeredUsers
      .filter((user) => user.role === "job-seeker")
      .map((user) => ({
        id: `registered-${user.id}`,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        whatsapp: user.whatsapp,
        facebook: user.facebook,
        x: user.x,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        isRegisteredUser: true,
        title: user.primarySkill ? `${user.primarySkill} Specialist` : "Technical Candidate",
        location: "Profile location pending",
        experience: "Registered candidate",
        availability: "Open to interviews",
        salaryExpectation: 0,
        skills: user.primarySkill ? [user.primarySkill, "Technical Delivery"] : ["Technical Delivery"],
      }));

    return registeredApplicants;
  }, [registeredUsers]);

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return applicantRecords.filter((candidate) => {
      const searchable = [candidate.name, candidate.title, candidate.location, candidate.experience, ...candidate.skills]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (availability === "All" || candidate.availability === availability)
      );
    });
  }, [applicantRecords, availability, query]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-green-700">Authenticated employer workspace</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Search Tech Applicants</h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          Employers can search registered job-hunting users by full name, email, role, skill, and availability.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search React, AWS, Figma, security, frontend..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
        <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-lg border border-gray-300 px-4 py-3">
          <option>All</option>
          <option>Open immediately</option>
          <option>2 weeks notice</option>
          <option>Open to interviews</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredCandidates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
            No registered job seekers match this search yet.
          </div>
        ) : filteredCandidates.map((candidate) => (
          <article key={candidate.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  {candidate.profileImage ? (
                    <img src={candidate.profileImage} alt={candidate.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-lg font-black text-green-700">
                      {candidate.name[0].toUpperCase()}
                    </span>
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{candidate.name}</h2>
                    <p className="mt-1 text-gray-600">{candidate.title} - {candidate.location}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  {candidate.experience} experience, {candidate.availability.toLowerCase()}, expected salary {candidate.salaryExpectation ? salary.format(candidate.salaryExpectation) : "pending"}.
                </p>
              </div>
              <a
                href={`mailto:${candidate.email}?subject=${encodeURIComponent("Employer connection from TechHire Market")}&body=${encodeURIComponent(`Hi ${candidate.name},\n\nI found your registered job-hunting profile on TechHire Market and would like to connect about a technical role.`)}`}
                className="rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white"
              >
                Email candidate
              </a>
            </div>
            <div className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm md:grid-cols-2">
              <p><span className="font-bold text-gray-800">Email:</span> <a href={`mailto:${candidate.email}`} className="text-green-700 underline">{candidate.email}</a></p>
              <p><span className="font-bold text-gray-800">WhatsApp:</span> {candidate.whatsapp}</p>
              <p><span className="font-bold text-gray-800">Facebook:</span> <a href={candidate.facebook} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.facebook}</a></p>
              <p><span className="font-bold text-gray-800">X:</span> <a href={candidate.x} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.x}</a></p>
              <p><span className="font-bold text-gray-800">LinkedIn:</span> <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.linkedin}</a></p>
              <p><span className="font-bold text-gray-800">Portfolio:</span> <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.portfolio}</a></p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
