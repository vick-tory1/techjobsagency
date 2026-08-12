import Card from "../components/ui/Card";
import { useStoredList } from "../hooks/useStoredList";
import { useRegisteredUsers } from "../hooks/useAuth";
import { useTechJobs } from "../hooks/useTechJobs";
import type { Client } from "../types/client";
import type { Project, TeamMember } from "../types/workspace";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function salaryToBudget(salary: string) {
  const amounts = salary.match(/\d[\d,]*/g)?.map((amount) => Number(amount.replace(/,/g, ""))) ?? [];
  return amounts.length ? Math.max(...amounts) : 0;
}

export default function Dashboard() {
  const registeredUsers = useRegisteredUsers();
  const { jobs: liveJobs } = useTechJobs(80);
  const [clientList] = useStoredList<Client>("flowpilot-clients", []);
  const [projects] = useStoredList<Project>("flowpilot-projects", []);
  const [team] = useStoredList<TeamMember>("flowpilot-team", []);
  const registeredApplicants = registeredUsers.filter((user) => user.role === "job-seeker");
  const registeredRecruiters: TeamMember[] = registeredUsers
    .filter((user) => user.role === "employer")
    .map((user) => ({
      id: `registered-${user.id}`,
      name: user.name,
      role: user.company ? `${user.company} Hiring Contact` : "Registered Hiring Contact",
      capacity: 70,
    }));
  const visibleTeam = [
    ...registeredRecruiters,
    ...team.filter(
      (member) =>
        !registeredRecruiters.some((registeredMember) => registeredMember.name.toLowerCase() === member.name.toLowerCase())
    ),
  ];
  const applicantCount = registeredApplicants.length;
  const liveProjects: Project[] = liveJobs.map((job) => {
    const postedAt = Number.isNaN(new Date(job.postedAt).getTime()) ? new Date() : new Date(job.postedAt);
    const closesAt = new Date(postedAt);
    closesAt.setDate(closesAt.getDate() + 30);

    return {
      id: `live-${job.id}`,
      name: job.title,
      client: job.company,
      status: "Active",
      dueDate: closesAt.toISOString().slice(0, 10),
      budget: salaryToBudget(job.salary),
      location: job.location,
      workMode: job.workMode,
      level: job.level,
      employmentType: job.employmentType,
      skills: job.skills,
    };
  });
  const visibleProjects = [
    ...liveProjects,
    ...projects.filter(
      (project) =>
        !liveProjects.some(
          (liveProject) =>
            liveProject.name.toLowerCase() === project.name.toLowerCase() &&
            liveProject.client.toLowerCase() === project.client.toLowerCase()
        )
    ),
  ];

  const activeEmployers = clientList.filter((client) => client.status === "Active").length + registeredRecruiters.length;
  const jobsNeedingAttention = projects.filter((project) => project.status === "At Risk").length;
  const salaryPipeline = visibleProjects
    .filter((project) => project.status !== "Completed")
    .reduce((total, project) => total + project.budget, 0);
  const averageCapacity = visibleTeam.length
    ? Math.round(visibleTeam.reduce((total, member) => total + member.capacity, 0) / visibleTeam.length)
    : 0;

  const upcomingProjects = [...visibleProjects]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-green-700">Live job marketplace dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950 md:text-4xl">Hiring Operations Center</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Monitor employer accounts, open roles, candidate tasks, salary demand, and recruiter capacity from the data updated across the job platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="text-gray-500">Employers</p>
              <p className="text-2xl font-bold text-gray-950">{activeEmployers}</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="text-gray-500">Open roles</p>
              <p className="text-2xl font-bold text-gray-950">{visibleProjects.length}</p>
            </div>
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <p className="text-gray-500">Recruiters</p>
              <p className="text-2xl font-bold text-gray-950">{visibleTeam.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Active Employers" value={String(activeEmployers)} detail="Hiring companies with live job posts" trend="Employer demand" />
        <Card title="Applicants" value={String(applicantCount)} detail={`${registeredApplicants.length} registered candidate profiles`} trend="Candidate supply" />
        <Card title="Salary Pipeline" value={currency.format(salaryPipeline)} detail="Combined salary value across active roles" trend="Market opportunity" />
        <Card title="Recruiter Capacity" value={`${averageCapacity}%`} detail="Average workload across recruiting team" trend={averageCapacity > 80 ? "Balance queues" : "Capacity available"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">Priority Job Posts</h2>
              <p className="text-sm text-gray-500">Open roles ordered by closing date so recruiters can protect time-sensitive hiring pipelines.</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
              {jobsNeedingAttention} needs review
            </span>
          </div>

          <div className="space-y-4">
            {upcomingProjects.map((project) => (
              <article key={project.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-950">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.client} - applications close {project.dueDate}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-gray-950">{project.budget ? currency.format(project.budget) : "Salary not listed"}</p>
                    <p className="text-sm text-gray-500">{project.status}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-950">Recruiter Load</h2>
          <p className="mb-5 text-sm text-gray-500">Capacity from the recruiting team page, used to decide who can own new employer requests.</p>

          <div className="space-y-5">
            {visibleTeam.map((member) => (
              <div key={member.id}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-800">{member.name}</span>
                  <span className="text-gray-500">{member.capacity}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: `${member.capacity}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
