import type { InfoPageContent } from "../components/marketplace/InfoPage";
import type { Job, TalentProfile } from "./types";

function countOpen(jobs: Job[], skill: string) {
  return jobs.filter((job) => job.status === "open" && job.skills.some((item) => item.toLowerCase().includes(skill.toLowerCase()))).length;
}

function countTalent(talent: TalentProfile[], skill: string) {
  return talent.filter((profile) => profile.skills.some((item) => item.toLowerCase().includes(skill.toLowerCase()))).length;
}

export function careerRoadmapContent(jobs: Job[], talent: TalentProfile[]): InfoPageContent {
  const openRoleCount = jobs.filter((job) => job.status === "open").length;
  return {
    eyebrow: "Career development",
    title: "Build a technology career with a clear path",
    intro: "Technology careers move faster when you know the lane you are aiming for, the evidence employers expect, and the milestones that show you are ready for the next level.",
    image: "/assets/community-mentorship-session.jpg",
    imageAlt: "Technology professionals discussing career direction in a mentorship session",
    primaryCta: { label: "Browse jobs", href: "/jobs" },
    secondaryCta: { label: "Build profile", href: "/talent/profile" },
    stats: [{ title: "Open roles", body: `${openRoleCount} open technology role${openRoleCount === 1 ? "" : "s"} available now.` }, { title: "Professional profiles", body: `${talent.length} technical profile${talent.length === 1 ? "" : "s"} currently ready for employer review.` }, { title: "Career focus", body: "The strongest applications connect role requirements, practical evidence, and clear availability." }],
    sections: [{ eyebrow: "Choose a lane", title: "Focus before you apply", body: "A career lane helps you choose better projects, describe your value clearly, and avoid scattering effort across unrelated roles.", cards: [{ title: "Beginner", body: "Learn the fundamentals, build small projects, write clear README files, and practice explaining how the work was built." }, { title: "Junior", body: "Show reliable delivery: bug fixes, features, tests, documentation, code review habits, and examples of working from requirements." }, { title: "Mid-level and beyond", body: "Demonstrate ownership, architecture decisions, mentoring, incident handling, product judgment, and measurable impact." }] }, { eyebrow: "Career tracks", title: "Match your evidence to the work", body: "Different technology paths need different proof. Make the most relevant examples easy to find before you apply.", cards: [{ title: "Software engineering", body: "Interfaces, APIs, databases, authentication, testing, accessibility, performance, and maintainable code." }, { title: "Cloud, DevOps, and security", body: "Deployments, CI/CD, Linux, networking, monitoring, incident response, access control, and safe security practice." }, { title: "Data, product, QA, and design", body: "Dashboards, analysis, research, test plans, prototypes, user flows, product decisions, and business interpretation." }] }],
    links: [{ title: "Portfolio guide", body: "Shape project evidence before employers review your profile.", href: "/portfolio", label: "Open guide" }, { title: "Interview prep", body: "Prepare examples and questions for technical conversations.", href: "/interview-prep", label: "Prepare" }, { title: "Skill tracks", body: "Compare technology lanes before choosing your next move.", href: "/skill-tracks", label: "Explore tracks" }],
    faq: [{ title: "How do I choose a career lane?", body: "Start with the work you can practice consistently, then compare it with real job descriptions and portfolio evidence you can create." }, { title: "When is the right time to apply?", body: "Apply when you can explain the core requirements, show related proof, and commit to the role constraints." }],
  };
}

export function portfolioContent(): InfoPageContent {
  return {
    eyebrow: "Portfolio",
    title: "Show practical work employers can evaluate",
    intro: "A strong technology portfolio proves how you think, what you can build, and the kind of technical problems you are ready to solve for an employer.",
    image: "/assets/portfolio-code-review.jpg",
    imageAlt: "Technology professional reviewing portfolio work and code",
    primaryCta: { label: "Update profile", href: "/talent/profile" },
    secondaryCta: { label: "Browse roles", href: "/jobs" },
    sections: [{ eyebrow: "Portfolio structure", title: "Make every project easy to review", body: "Recruiters and technical reviewers need the problem, your contribution, the stack, and the result without digging through everything you have ever built.", cards: [{ title: "Problem and context", body: "Explain who the work helped, what was broken or missing, and why the project mattered." }, { title: "Technical decisions", body: "Name the tools, architecture, constraints, tradeoffs, testing approach, and what you would improve next." }, { title: "Evidence links", body: "Add live demos, repositories, case studies, screenshots, dashboards, design files, or short walkthroughs where appropriate." }] }, { eyebrow: "Presentation", title: "Use proof that matches the role", body: "A backend reviewer, design lead, data manager, and security engineer look for different signals. Put the relevant work first.", cards: [{ title: "Developers", body: "Show clean code, APIs, data models, tests, accessibility, performance, deployment, and thoughtful pull request history." }, { title: "Data professionals", body: "Show SQL, datasets, dashboards, assumptions, analysis, business interpretation, and where decisions changed because of the work." }, { title: "Design and product", body: "Show research, flows, prototypes, tradeoffs, delivery context, usability decisions, and measurable product thinking." }] }],
    links: [{ title: "Create profile", body: "Add portfolio links and project summaries to your Flowpilot profile.", href: "/talent/profile", label: "Open profile" }, { title: "Career roadmap", body: "Choose the lane your portfolio supports.", href: "/career-roadmap", label: "Plan career" }, { title: "Interview prep", body: "Practice explaining the work in your portfolio.", href: "/interview-prep", label: "Prepare" }],
    faq: [{ title: "How many projects belong in a portfolio?", body: "Two or three strong, relevant projects are usually better than a long list of unfinished work." }, { title: "Does private work count?", body: "Yes, but describe the problem, your contribution, constraints, and outcomes without exposing confidential details." }],
  };
}

export function interviewContent(): InfoPageContent {
  return {
    eyebrow: "Interview preparation",
    title: "Prepare for technical hiring conversations",
    intro: "Technical interviews reward preparation that is specific: know the role, prepare relevant examples, practice explaining decisions, and bring thoughtful questions about the work.",
    image: "/assets/technical-interview-review.jpg",
    imageAlt: "Hiring team reviewing technical interview notes",
    primaryCta: { label: "Browse jobs", href: "/jobs" },
    secondaryCta: { label: "Update profile", href: "/talent/profile" },
    sections: [{ eyebrow: "Before the call", title: "Know the role and your evidence", body: "Preparation starts by matching your strongest examples to the role requirements instead of rehearsing generic answers.", cards: [{ title: "Screening call", body: "Be ready to explain your background, salary context, availability, work mode, and why the role fits your next step." }, { title: "Technical discussion", body: "Prepare to discuss architecture, tradeoffs, debugging, testing, performance, security, and the decisions behind your work." }, { title: "Practical exercise", body: "Practice reading requirements, asking clarifying questions, naming assumptions, writing clean code, and explaining your approach." }] }, { eyebrow: "During review", title: "Communicate like a teammate", body: "Strong candidates make their thinking easy to follow and ask questions that reveal how the team actually works.", cards: [{ title: "Use clear stories", body: "Frame examples with context, action, result, impact, and what you learned." }, { title: "Ask better questions", body: "Ask about code review, deployment, product planning, incident response, roadmap ownership, and success measures." }, { title: "Follow up with proof", body: "Send relevant links, notes, or clarifications when they help the hiring team understand your experience." }] }],
    links: [{ title: "Portfolio guide", body: "Make your examples easier to review before interviews.", href: "/portfolio", label: "Review portfolio" }, { title: "Salary guide", body: "Prepare compensation conversations with a clear range.", href: "/salary-guide", label: "Review salary" }, { title: "Applications", body: "Keep your active applications organized and prepare for each next conversation.", href: "/talent/applications", label: "Review applications" }],
    faq: [{ title: "What comes first in interview prep?", body: "Start with the job description, then choose portfolio examples that map directly to the required skills." }, { title: "How do I handle unknown questions?", body: "Explain your reasoning, ask clarifying questions, and show how you would investigate safely." }],
  };
}

export function skillsContent(jobs: Job[], talent: TalentProfile[]): InfoPageContent {
  return {
    eyebrow: "Technology tracks",
    title: "Explore the skills behind modern technology roles",
    intro: "Skill choices matter most when they point toward real work. Compare technology tracks by the problems they solve, the tools they use, and the evidence employers expect.",
    image: "/assets/agency-market-notes.jpg",
    imageAlt: "Technology hiring market notes and planning materials",
    primaryCta: { label: "Search jobs", href: "/jobs" },
    secondaryCta: { label: "Browse talent", href: "/talent" },
    stats: [{ title: "React demand", body: `${countOpen(jobs, "React")} open role${countOpen(jobs, "React") === 1 ? "" : "s"} mention React.` }, { title: "Cloud profiles", body: `${countTalent(talent, "AWS") + countTalent(talent, "Azure")} profile${countTalent(talent, "AWS") + countTalent(talent, "Azure") === 1 ? "" : "s"} mention AWS or Azure.` }, { title: "Security signals", body: `${countOpen(jobs, "Security") + countTalent(talent, "Security")} current job or profile signal${countOpen(jobs, "Security") + countTalent(talent, "Security") === 1 ? "" : "s"} mention security.` }],
    sections: [{ eyebrow: "Core tracks", title: "Choose skills by the work they support", body: "Skills are most valuable when they connect to a role, responsibility, and evidence of delivery.", cards: [{ title: "Frontend, backend, and full-stack", body: "Frontend focuses on interfaces, accessibility, state, and user experience. Backend centers on APIs, databases, authentication, queues, and reliability. Full-stack roles need enough depth to connect both sides responsibly." }, { title: "Cloud, DevOps, and security", body: "Cloud and DevOps cover Linux, networking, CI/CD, containers, infrastructure as code, monitoring, and production reliability. Security adds threat awareness, access control, incident response, and risk communication." }, { title: "Data, design, product, and QA", body: "Data roles need SQL, dashboards, analysis, and interpretation. Design and product need research, flows, prioritization, and delivery judgment. QA needs test design, automation, and a sharp eye for risk." }] }, { eyebrow: "Evidence", title: "Turn skills into credible signals", body: "A skill list is only useful when it points to work a reviewer can inspect or discuss.", cards: [{ title: "Candidates", body: "List skills you can explain under interview pressure and connect each major skill to a project, job, course, or portfolio artifact." }, { title: "Employers", body: "Separate must-have skills from trainable preferences so qualified candidates do not self-reject unnecessarily." }, { title: "Reviewers", body: "Compare skills with portfolio evidence, project depth, communication quality, and the actual responsibility level of the role." }] }],
    links: [{ title: "Cybersecurity", body: "Explore security career and hiring signals.", href: "/cybersecurity", label: "Open track" }, { title: "Cloud and DevOps", body: "Explore infrastructure and reliability work.", href: "/cloud-devops", label: "Open track" }, { title: "Career roadmap", body: "Turn skill choices into a career plan.", href: "/career-roadmap", label: "Plan next" }],
    faq: [{ title: "Does every tool belong on a profile?", body: "No. Prioritize skills you can explain, demonstrate, and connect to relevant work." }, { title: "What makes skill requirements useful?", body: "Name the tools needed for the work and explain which are required versus helpful." }],
  };
}

export function cybersecurityContent(jobs: Job[], talent: TalentProfile[]): InfoPageContent {
  return {
    eyebrow: "Cybersecurity",
    title: "Cybersecurity careers built on trust and judgment",
    intro: "Cybersecurity work spans monitoring, secure engineering, cloud security, governance, penetration testing, incident response, and risk communication. The best candidates show responsibility as clearly as technical skill.",
    image: "/assets/remote-work-dashboard.jpg",
    imageAlt: "Security and operations dashboard on a technology workstation",
    primaryCta: { label: "Find security jobs", href: "/jobs?skill=Cyber%20Security" },
    secondaryCta: { label: "Find security talent", href: "/talent?skill=Cyber%20Security" },
    stats: [{ title: "Security roles", body: `${countOpen(jobs, "Security")} open role${countOpen(jobs, "Security") === 1 ? "" : "s"} mention security.` }, { title: "Security profiles", body: `${countTalent(talent, "Security")} profile${countTalent(talent, "Security") === 1 ? "" : "s"} mention security.` }, { title: "Trust first", body: "Strong security hiring depends on safe examples, practical judgment, and responsible access to sensitive information." }],
    sections: [{ eyebrow: "Security paths", title: "Know the specialization before you apply", body: "Security titles can hide very different jobs. Match your learning and portfolio to the responsibility you want.", cards: [{ title: "SOC and incident response", body: "Monitoring, alert triage, log analysis, escalation, containment, reporting, and calm communication during incidents." }, { title: "Application and cloud security", body: "Secure coding, authentication, authorization, secrets handling, dependency review, IAM, network controls, and cloud posture." }, { title: "GRC and penetration testing", body: "Policy, risk assessment, compliance evidence, vulnerability testing, responsible reporting, and clear remediation guidance." }] }, { eyebrow: "Hiring security talent", title: "Screen for evidence and responsibility", body: "Security hiring works best when employers define scope, authority, tools, and risk ownership clearly.", cards: [{ title: "Define the environment", body: "Name cloud providers, systems, compliance needs, on-call expectations, data sensitivity, and security tooling." }, { title: "Ask for safe proof", body: "Review labs, writeups, dashboards, policies, threat models, or sanitized incident examples instead of confidential details." }, { title: "Look for judgment", body: "Strong security professionals know when to escalate, how to prioritize risk, and how to explain tradeoffs to non-security teams." }] }],
    links: [{ title: "Skill tracks", body: "Compare security with adjacent technical tracks.", href: "/skill-tracks", label: "Explore skills" }, { title: "Hiring process", body: "Write clearer security role briefs.", href: "/hiring-process", label: "Open hiring guide" }, { title: "Interview prep", body: "Prepare security examples for interviews.", href: "/interview-prep", label: "Prepare" }],
    faq: [{ title: "What evidence matters in security?", body: "Show safe examples of analysis, remediation, tooling, documentation, and communication." }, { title: "What clarifies a security role?", body: "Clarify authority, environment, tooling, compliance context, and response expectations." }],
  };
}

export function cloudContent(jobs: Job[], talent: TalentProfile[]): InfoPageContent {
  return {
    eyebrow: "Cloud and DevOps",
    title: "Cloud and DevOps careers for reliable delivery",
    intro: "Cloud and DevOps roles sit close to production. Employers look for people who understand infrastructure, automation, observability, security, cost, and the habits that keep systems reliable.",
    image: "/assets/delivery-roadmap-session.jpg",
    imageAlt: "Technical team planning delivery and infrastructure roadmap",
    primaryCta: { label: "Find cloud roles", href: "/jobs?skill=DevOps" },
    secondaryCta: { label: "Browse cloud talent", href: "/talent?skill=DevOps" },
    stats: [{ title: "DevOps roles", body: `${countOpen(jobs, "DevOps")} open role${countOpen(jobs, "DevOps") === 1 ? "" : "s"} mention DevOps.` }, { title: "Cloud talent", body: `${countTalent(talent, "AWS") + countTalent(talent, "Azure") + countTalent(talent, "DevOps")} profile signal${countTalent(talent, "AWS") + countTalent(talent, "Azure") + countTalent(talent, "DevOps") === 1 ? "" : "s"} mention cloud or DevOps.` }, { title: "Reliable delivery", body: "Use evidence of deployment, monitoring, and operational thinking when evaluating fit." }],
    sections: [{ eyebrow: "Capability areas", title: "Understand the work behind the title", body: "Cloud and DevOps roles vary widely. Strong briefs and profiles name the actual responsibility.", cards: [{ title: "Infrastructure", body: "Cloud services, Linux, networking, DNS, load balancing, containers, IaC, identity, security groups, and cost awareness." }, { title: "Delivery automation", body: "CI/CD pipelines, deployment workflows, rollback plans, test gates, artifact management, and release reliability." }, { title: "Observability", body: "Logging, metrics, alerts, tracing, SLOs, incident response, postmortems, and clear operational communication." }] }, { eyebrow: "Career evidence", title: "Show operational maturity", body: "Employers value examples that prove reliability habits, not only tool familiarity.", cards: [{ title: "Candidates", body: "Show deployment diagrams, automation scripts, monitoring examples, Kubernetes practice, Terraform modules, or sanitized postmortems." }, { title: "Employers", body: "Define production expectations, on-call load, cloud stack, security requirements, and ownership boundaries." }, { title: "Teams", body: "Clarify how engineering, operations, security, and product collaborate when releases or incidents put pressure on the system." }] }],
    links: [{ title: "Remote work guide", body: "Plan collaboration for distributed infrastructure teams.", href: "/remote-work", label: "Open guide" }, { title: "Skill tracks", body: "Compare cloud with engineering and security tracks.", href: "/skill-tracks", label: "Explore skills" }, { title: "Create job", body: "Write a cloud or DevOps hiring brief.", href: "/employer/jobs/create", label: "Create role" }],
    faq: [{ title: "What is the difference between cloud and DevOps?", body: "Cloud often focuses on platform services and infrastructure; DevOps often focuses on delivery, automation, reliability, and collaboration practices." }, { title: "What evidence matters?", body: "Deployment, automation, monitoring, incident handling, and secure infrastructure decisions are stronger than tool lists alone." }],
  };
}

export function remoteContent(jobs: Job[]): InfoPageContent {
  const remote = jobs.filter((job) => job.status === "open" && (job.remote || job.workplaceType === "remote")).length;
  return {
    eyebrow: "Remote work",
    title: "Find and hire for remote technology roles",
    intro: "Remote work succeeds when expectations are explicit: time zones, communication, delivery rituals, equipment, security, and collaboration habits.",
    image: "/assets/startup-talent-session.jpg",
    imageAlt: "Remote hiring discussion with technology team members",
    primaryCta: { label: "Browse remote jobs", href: "/jobs?remote=true" },
    secondaryCta: { label: "Post remote role", href: "/employer/jobs/create" },
    stats: [{ title: "Remote openings", body: `${remote} open role${remote === 1 ? "" : "s"} currently marked remote.` }, { title: "Fit matters", body: "Remote-ready profiles show communication, autonomy, and delivery evidence." }, { title: "Clarity helps", body: "Strong remote briefs state time-zone overlap and collaboration expectations early." }],
    sections: [{ eyebrow: "Candidate readiness", title: "Show that you can work well remotely", body: "Remote employers look for technical ability plus written communication, reliability, and ownership.", cards: [{ title: "Communication", body: "Show clear writing, async updates, documentation, and thoughtful questions." }, { title: "Delivery habits", body: "Share examples of planning, progress updates, testing, and follow-through." }, { title: "Environment", body: "Be honest about availability, location, time zones, and work setup." }] }, { eyebrow: "Employer clarity", title: "Write remote roles with operational detail", body: "Remote job posts need more than a remote label. Candidates need to understand how work actually happens.", cards: [{ title: "Time-zone overlap", body: "State required hours, meeting expectations, and collaboration windows." }, { title: "Security and equipment", body: "Clarify device, access, VPN, data handling, and onboarding requirements." }, { title: "Team rhythm", body: "Describe standups, planning, code review, documentation, and performance expectations." }] }],
    links: [{ title: "Jobs", body: "Search current roles by skill and work mode.", href: "/jobs", label: "Browse jobs" }, { title: "Hiring process", body: "Write clearer distributed team role briefs.", href: "/hiring-process", label: "Open guide" }, { title: "Support", body: "Get help with role access or profile questions.", href: "/support", label: "Get help" }],
    faq: [{ title: "What matters for remote candidates?", body: "Highlight communication habits, delivery examples, availability, and experience working across tools or time zones." }, { title: "What belongs in a remote role brief?", body: "Include time-zone needs, communication rhythm, equipment, security, and how performance is reviewed." }],
  };
}

export function salaryContent(): InfoPageContent {
  return {
    eyebrow: "Compensation",
    title: "Discuss technology salary expectations with clarity",
    intro: "Flowpilot does not invent salary benchmarks. Use real job ranges, role scope, location, seniority, and work mode to prepare better compensation conversations.",
    image: "/assets/recruitment-planning-table.jpg",
    imageAlt: "Hiring team reviewing role compensation and recruitment planning",
    primaryCta: { label: "Browse jobs with ranges", href: "/jobs" },
    secondaryCta: { label: "Create job", href: "/employer/jobs/create" },
    sections: [{ eyebrow: "For candidates", title: "Prepare your range before applying", body: "A clear range helps you avoid mismatched roles and negotiate from practical context.", cards: [{ title: "Use listed ranges", body: "Start with salary information in real job posts instead of relying on vague market claims." }, { title: "Consider scope", body: "Compare responsibility, seniority, on-call load, work mode, and location requirements." }, { title: "Know your floor", body: "Decide the minimum compensation that fits your situation before entering late-stage interviews." }] }, { eyebrow: "For employers", title: "Publish ranges that attract the right candidates", body: "Transparent compensation reduces wasted interviews and helps candidates self-select responsibly.", cards: [{ title: "State the range", body: "Add salary or budget whenever possible so qualified candidates can evaluate fit." }, { title: "Explain level", body: "Tie compensation to responsibility, autonomy, and expectations instead of title alone." }, { title: "Keep it current", body: "Update ranges when role scope changes or hiring priorities shift." }] }],
    links: [{ title: "Jobs", body: "Review roles that include salary or budget details.", href: "/jobs", label: "Browse" }, { title: "Interview prep", body: "Prepare compensation questions before calls.", href: "/interview-prep", label: "Prepare" }, { title: "Create job", body: "Publish a role with accurate compensation context.", href: "/employer/jobs/create", label: "Create role" }],
    faq: [{ title: "Does Flowpilot publish salary statistics?", body: "No. Salary conversations are strongest when grounded in listed role ranges, scope, seniority, work mode, and location rather than invented benchmarks." }, { title: "Do salary ranges help?", body: "Yes, when possible. They improve candidate fit and reduce late-stage mismatches." }],
  };
}

export function hiringGuideContent(): InfoPageContent {
  return {
    eyebrow: "Employer hiring",
    title: "Build a better technology hiring process",
    intro: "A strong hiring process starts with a clear role brief, practical evidence, consistent review criteria, and respectful candidate communication.",
    image: "/assets/executive-hiring-brief.jpg",
    imageAlt: "Employer team writing a technical hiring brief",
    primaryCta: { label: "Create job", href: "/employer/jobs/create" },
    secondaryCta: { label: "Browse talent", href: "/talent" },
    sections: [{ eyebrow: "Role design", title: "Clarify the work before sourcing", body: "The best technical searches start with the problem, stack, level, constraints, and evidence required.", cards: [{ title: "Define outcomes", body: "Describe what the hire will own, improve, build, secure, analyze, automate, or deliver in the first few months." }, { title: "Name constraints", body: "State salary, location, work mode, timeline, seniority, reporting line, and interview expectations before outreach begins." }, { title: "Separate requirements", body: "Split must-have skills from helpful extras so candidates can self-select without guessing what is truly required." }] }, { eyebrow: "Pipeline quality", title: "Review candidates consistently", body: "Use the same evidence standards across applicants so the shortlist reflects fit rather than noise.", cards: [{ title: "Profile review", body: "Compare skills, portfolio, location, availability, communication quality, and role motivation before scheduling calls." }, { title: "Interview structure", body: "Prepare role-specific questions, practical exercises, and scorecards that reflect the work instead of trivia." }, { title: "Decision rhythm", body: "Keep feedback timely, document why candidates move forward, and close loops professionally when the answer is no." }] }],
    links: [{ title: "Create job", body: "Turn the role brief into a clear opening candidates can evaluate.", href: "/employer/jobs/create", label: "Start" }, { title: "Candidate screening", body: "Review practical ways to evaluate profiles.", href: "/candidate-screening", label: "Open guide" }, { title: "Applications", body: "Move applicants through review, interview, and decision stages.", href: "/employer/applications", label: "Review" }],
    faq: [{ title: "What makes a technical role brief strong?", body: "Clear outcomes, stack, seniority, salary, work mode, location, and evidence expectations." }, { title: "How do hiring teams reduce mismatches?", body: "Publish constraints early and review candidates against the same role-specific criteria." }],
  };
}

export function screeningContent(): InfoPageContent {
  return {
    eyebrow: "Candidate screening",
    title: "Evaluate technical candidates with practical evidence",
    intro: "Good screening connects profile signals, portfolio proof, role constraints, and communication quality before interviews begin.",
    image: "/assets/talent-screening-call.jpg",
    imageAlt: "Recruiter conducting a technical candidate screening call",
    primaryCta: { label: "Browse talent", href: "/talent" },
    secondaryCta: { label: "Review applications", href: "/employer/applications" },
    sections: [{ eyebrow: "Review signals", title: "Look for fit before scheduling calls", body: "A practical screen helps hiring teams spend interview time on candidates with credible alignment.", cards: [{ title: "Skill match", body: "Compare listed skills to the role requirements and look for supporting project, work, or portfolio evidence." }, { title: "Experience depth", body: "Check whether the candidate has owned similar problems, worked at the right level of autonomy, and can explain tradeoffs." }, { title: "Constraints", body: "Confirm location, availability, work mode, salary context, and timing before moving deeper into the process." }] }, { eyebrow: "Fair process", title: "Keep evaluation consistent", body: "Structured review improves candidate experience and reduces rushed decisions.", cards: [{ title: "Use the same criteria", body: "Review each candidate against the published role brief, not against shifting preferences." }, { title: "Document next steps", body: "Capture why someone is shortlisted, held, declined, or moved to interview so decisions stay clear." }, { title: "Protect privacy", body: "Request private details only when there is a credible role fit and an authorized hiring reason." }] }],
    links: [{ title: "Hiring process", body: "Design the process before screening candidates.", href: "/hiring-process", label: "Open guide" }, { title: "Talent directory", body: "Search profiles by skills and availability.", href: "/talent", label: "Browse" }, { title: "Create job", body: "Publish a brief candidates can evaluate.", href: "/employer/jobs/create", label: "Create" }],
    faq: [{ title: "What comes first in screening?", body: "Start with role fit, portfolio evidence, availability, location, and communication clarity." }, { title: "Does every candidate need the same screen?", body: "The criteria stay consistent, while follow-up questions can adapt to each candidate's evidence." }],
  };
}
