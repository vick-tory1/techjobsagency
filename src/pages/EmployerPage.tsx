import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth, useRegisteredUsers } from "../hooks/useAuth";
import { useTechJobs } from "../hooks/useTechJobs";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function EmployerPage() {
  const { clientId } = useParams();
  const { user, logout, hasRegisteredAccount } = useAuth();
  const registeredUsers = useRegisteredUsers();
  const { jobs } = useTechJobs(120);
  const employer = registeredUsers.find((registeredUser) => registeredUser.role === "employer" && `registered-${registeredUser.id}` === clientId);

  if (!employer) {
    return <Navigate to="/" replace />;
  }

  const companyName = employer.company ?? employer.name;
  const openRoles = jobs.filter((job) => normalize(job.company) === normalize(companyName));
  const desiredSkills = Array.from(new Set(openRoles.flatMap((role) => role.skills)));
  const registeredJobSeekers = registeredUsers.filter((registeredUser) => registeredUser.role === "job-seeker");
  const matchedRegisteredJobSeekers = registeredJobSeekers.filter((registeredUser) => {
    if (!registeredUser.primarySkill) return true;
    const primarySkill = registeredUser.primarySkill ?? "";
    return desiredSkills.some((skill) => normalize(skill).includes(normalize(primarySkill))) || openRoles.length === 0;
  });
  const visibleRegisteredJobSeekers = matchedRegisteredJobSeekers.length > 0 ? matchedRegisteredJobSeekers : registeredJobSeekers;
  const startActionLabel = user ? "Logout" : hasRegisteredAccount ? "Login" : "SignUp";
  const startActionPath = hasRegisteredAccount ? "/login" : "/signup";

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-gray-950">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 font-black text-white">TH</span>
            <span>
              <span className="block text-xl font-black tracking-tight">TechHire Market</span>
              <span className="block text-xs font-semibold uppercase text-gray-500">Employer profile</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <Link to="/jobs" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Jobs</Link>
            <Link to="/talent" className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Talent</Link>
            {user ? (
              <button type="button" onClick={logout} className="rounded-lg bg-gray-950 px-4 py-2 text-white shadow-sm">
                Logout
              </button>
            ) : (
              <Link to={startActionPath} className="rounded-lg bg-gray-950 px-4 py-2 text-white shadow-sm">
                {startActionLabel}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-green-700">Registered employer</p>
            <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">{companyName} hiring page</h1>
            <p className="mt-5 leading-8 text-gray-600">
              This employer page is built from the registered employer profile and live jobs API data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" state={{ role: "employer" }} className="rounded-lg bg-gray-950 px-5 py-3 font-bold text-white shadow-sm">
                Manage employer access
              </Link>
              <Link to="/user/applicants" className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-sm">
                Search registered job hunters
              </Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-lg border border-gray-200 bg-[#f8fafc] p-5 shadow-sm">
            <div>
              <p className="text-sm font-bold uppercase text-gray-500">Hiring contact</p>
              <h2 className="mt-2 text-2xl font-black">{employer.name}</h2>
              <p className="mt-1 text-gray-600">{employer.email}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-2xl font-black">{openRoles.length}</p>
                <p className="text-sm text-gray-500">open roles</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-2xl font-black">{desiredSkills.length}</p>
                <p className="text-sm text-gray-500">target skills</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-2xl font-black">{visibleRegisteredJobSeekers.length}</p>
                <p className="text-sm text-gray-500">registered job hunters</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {desiredSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase text-green-700">Open hiring needs</p>
          <h2 className="mt-2 text-3xl font-black">Roles shaped for {companyName}.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Candidates can use this page to understand the employer's current role mix before connecting.
          </p>
        </div>
        <div className="grid gap-4">
          {openRoles.length === 0 ? (
            <article className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-gray-600">
              No live API roles currently match this registered employer company name.
            </article>
          ) : openRoles.map((role) => (
            <article key={role.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-black">{role.title}</h3>
                  <p className="mt-1 text-gray-600">{role.location} - {role.workMode} - {role.level}</p>
                </div>
                <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">{role.salary}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-green-700">Registered job hunters</p>
            <h2 className="mt-2 text-3xl font-black">Connect with job seekers registered on this website.</h2>
            <p className="mt-4 leading-7 text-gray-600">
              When a job seeker creates an account, employers can contact them from this tailored employer page and from the authenticated applicant search.
            </p>
          </div>

          {visibleRegisteredJobSeekers.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleRegisteredJobSeekers.map((candidate) => (
                <article key={candidate.id} className="rounded-lg border border-gray-200 bg-[#f8fafc] p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    {candidate.profileImage ? (
                      <img src={candidate.profileImage} alt={candidate.name} className="h-14 w-14 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-lg font-black text-green-700">
                        {candidate.name[0].toUpperCase()}
                      </span>
                    )}
                    <div>
                      <h3 className="text-xl font-black">{candidate.name}</h3>
                      <p className="mt-1 text-gray-600">{candidate.primarySkill ? `${candidate.primarySkill} Specialist` : "Technical Candidate"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Registered job-hunting user available for employer outreach through their saved website profile.
                  </p>
                  <div className="mt-4 grid gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm">
                    <p><span className="font-bold text-gray-800">Email:</span> <a href={`mailto:${candidate.email}`} className="text-green-700 underline">{candidate.email}</a></p>
                    <p><span className="font-bold text-gray-800">WhatsApp:</span> {candidate.whatsapp}</p>
                    <p><span className="font-bold text-gray-800">Facebook:</span> <a href={candidate.facebook} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.facebook}</a></p>
                    <p><span className="font-bold text-gray-800">X:</span> <a href={candidate.x} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.x}</a></p>
                    <p><span className="font-bold text-gray-800">LinkedIn:</span> <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.linkedin}</a></p>
                    <p><span className="font-bold text-gray-800">Portfolio:</span> <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="text-green-700 underline">{candidate.portfolio}</a></p>
                  </div>
                  <a
                    href={`mailto:${candidate.email}?subject=${encodeURIComponent(`${companyName} would like to connect`)}&body=${encodeURIComponent(`Hi ${candidate.name},\n\n${companyName} found your TechHire Market job-hunting profile and would like to connect about a technical role.`)}`}
                    className="mt-5 inline-block rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Connect with {candidate.name}
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-[#f8fafc] p-6">
              <p className="text-lg font-black">No registered job hunters yet.</p>
              <p className="mt-2 text-gray-600">Create a candidate account first, then this employer page will show a direct connect link to that registered user.</p>
              <Link to="/signup" state={{ role: "job-seeker" }} className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-bold text-white">
                Register as job seeker
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
