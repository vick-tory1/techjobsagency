import Link from "next/link";
import Image from "next/image";

type GuideItem = {
  title: string;
  body: string;
  href?: string;
};

export const careerGuides: GuideItem[] = [
  { title: "Choose a target role", body: "Focus your search around the work you want to do next: frontend, backend, data, cloud, security, QA, product, or design.", href: "/jobs" },
  { title: "Show evidence", body: "Use projects, portfolio links, case studies, repositories, and concise explanations to prove the skills you list.", href: "/talent/profile" },
  { title: "Prepare before applying", body: "Compare your experience with the job skills, update your profile, and write a focused cover note for the specific role.", href: "/talent/applications" },
];

export const hiringGuides: GuideItem[] = [
  { title: "Write a clear role brief", body: "Describe the problem, stack, level, salary, location, work mode, and evaluation process so qualified people can self-select.", href: "/employer/jobs/create" },
  { title: "Screen for proof", body: "Review projects, communication, portfolio quality, relevant skills, and role fit before scheduling interviews.", href: "/employer/talent" },
  { title: "Keep the pipeline current", body: "Move applications through status stages quickly and give job seekers a clear next step when possible.", href: "/employer/applications" },
];

export const supportGuides: GuideItem[] = [
  { title: "Account access", body: "Check email/password, Google signup availability, role selection, and whether you are using the right login page.", href: "/login" },
  { title: "Profile quality", body: "Add specific skills, portfolio proof, location, availability, and links that help employers understand your fit.", href: "/talent/profile" },
  { title: "Application issues", body: "Confirm the role is still open, your profile is complete, and your cover note explains why the job fits.", href: "/jobs" },
];

export function GuideGrid({ eyebrow, title, intro, items }: { eyebrow: string; title: string; intro: string; items: GuideItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase text-green-700">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">{title}</h2>
        <p className="mt-3 leading-7 text-gray-600">{intro}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const body = <><h3 className="text-xl font-black text-gray-900">{item.title}</h3><p className="mt-3 leading-7 text-gray-600">{item.body}</p>{item.href ? <p className="mt-4 text-sm font-bold text-green-700">Open resource</p> : null}</>;
          return item.href ? <Link key={item.title} href={item.href} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">{body}</Link> : <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">{body}</article>;
        })}
      </div>
    </section>
  );
}

export function FAQBlock({ items }: { items: GuideItem[] }) {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-bold uppercase text-green-700">FAQ</p>
          <h2 className="mt-2 text-3xl font-black">Common questions</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 p-5"><h3 className="font-black text-gray-900">{item.title}</h3><p className="mt-2 leading-7 text-gray-600">{item.body}</p></article>)}
        </div>
      </div>
    </section>
  );
}

export function VisualBand({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  points,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  points: string[];
  cta?: { label: string; href: string };
}) {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <Image src={image} alt={imageAlt} width={900} height={560} loading="lazy" decoding="async" sizes="(min-width: 1024px) 46vw, 100vw" className="h-full max-h-[460px] w-full rounded-lg object-cover shadow-xl" />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase text-green-700">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">{title}</h2>
          <p className="mt-4 leading-7 text-gray-600">{body}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((point) => <p key={point} className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700">{point}</p>)}
          </div>
          {cta ? <Link href={cta.href} className="mt-7 w-fit rounded-lg bg-gray-950 px-5 py-3 font-bold text-white shadow-sm">{cta.label}</Link> : null}
        </div>
      </div>
    </section>
  );
}

export function ProcessGrid({ eyebrow, title, intro, steps }: { eyebrow: string; title: string; intro: string; steps: GuideItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase text-green-700">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">{title}</h2>
        <p className="mt-3 leading-7 text-gray-600">{intro}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => <article key={step.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 text-sm font-black text-white">{index + 1}</span><h3 className="mt-4 text-xl font-black text-gray-900">{step.title}</h3><p className="mt-3 leading-7 text-gray-600">{step.body}</p></article>)}
      </div>
    </section>
  );
}

export function CTASection({ title, body, primary, secondary }: { title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-lg border border-gray-800 bg-gray-950 p-8 text-white shadow-xl md:flex md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black">{title}</h2>
          <p className="mt-3 leading-7 text-gray-300">{body}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
          <Link href={primary.href} className="rounded-lg bg-green-500 px-5 py-3 font-bold text-gray-950">{primary.label}</Link>
          {secondary ? <Link href={secondary.href} className="rounded-lg border border-white/20 px-5 py-3 font-bold text-white">{secondary.label}</Link> : null}
        </div>
      </div>
    </section>
  );
}
