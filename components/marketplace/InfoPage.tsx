import Image from "next/image";
import Link from "next/link";

type Card = {
  title: string;
  body: string;
};

type LinkCard = Card & {
  href: string;
  label: string;
};

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  stats?: Card[];
  sections: Array<{
    eyebrow: string;
    title: string;
    body: string;
    cards: Card[];
  }>;
  links: LinkCard[];
  faq: Card[];
};

export default function InfoPage({ content }: { content: InfoPageContent }) {
  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-700">{content.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">{content.title}</h1>
            <p className="mt-5 leading-8 text-gray-600">{content.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={content.primaryCta.href} className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-sm">{content.primaryCta.label}</Link>
              {content.secondaryCta ? <Link href={content.secondaryCta.href} className="rounded-lg border border-gray-300 px-5 py-3 font-bold text-gray-800">{content.secondaryCta.label}</Link> : null}
            </div>
          </div>
          <Image src={content.image} alt={content.imageAlt} width={980} height={640} priority sizes="(min-width: 1024px) 56vw, 100vw" className="h-full max-h-[560px] w-full rounded-lg object-cover shadow-xl" />
        </div>
      </section>

      {content.stats?.length ? (
        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 lg:px-8">
          {content.stats.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase text-green-700">{item.title}</p><p className="mt-3 leading-7 text-gray-600">{item.body}</p></article>)}
        </section>
      ) : null}

      <section className="border-y border-gray-200 bg-gray-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase text-green-400">Work in motion</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Turn guidance into visible progress</h2>
            <p className="mt-4 leading-7 text-gray-300">A useful plan connects the next action, the evidence behind it, and the conversation it prepares you for. Keep each step practical enough to complete and clear enough to discuss.</p>
          </div>
          <div className="motion-panel" aria-label="Animated workflow visualization">
            <span className="motion-node motion-node-a" />
            <span className="motion-node motion-node-b" />
            <span className="motion-node motion-node-c" />
            <span className="motion-line motion-line-a" />
            <span className="motion-line motion-line-b" />
            <div className="motion-card motion-card-a"><b>Skills</b><span>Match the work</span></div>
            <div className="motion-card motion-card-b"><b>Evidence</b><span>Show proof</span></div>
            <div className="motion-card motion-card-c"><b>Decision</b><span>Move forward</span></div>
            <Image src="/assets/terminal-prompt.gif" alt="Animated terminal prompt" width={416} height={68} unoptimized className="absolute bottom-5 left-1/2 w-[min(78%,416px)] -translate-x-1/2 rounded border border-white/10 opacity-90 shadow-2xl" />
          </div>
        </div>
      </section>

      {content.sections.map((section, index) => (
        <section key={section.title} className={index % 2 ? "border-y border-gray-200 bg-white" : "mx-auto max-w-7xl px-4 py-14 lg:px-8"}>
          <div className={index % 2 ? "mx-auto max-w-7xl px-4 py-14 lg:px-8" : ""}>
            <div className="mb-6 max-w-3xl">
              <p className="text-sm font-bold uppercase text-green-700">{section.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">{section.title}</h2>
              <p className="mt-3 leading-7 text-gray-600">{section.body}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {section.cards.map((card) => <article key={card.title} className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm"><h3 className="text-xl font-black text-gray-900">{card.title}</h3><p className="mt-3 leading-7 text-gray-600">{card.body}</p></article>)}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-bold uppercase text-green-700">Next steps</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Move from reading to action</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {content.links.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"><h3 className="text-xl font-black text-gray-900">{item.title}</h3><p className="mt-3 leading-7 text-gray-600">{item.body}</p><p className="mt-4 text-sm font-bold text-green-700">{item.label}</p></Link>)}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm font-bold uppercase text-green-700">FAQ</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Helpful context</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.faq.map((item) => <article key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 p-5"><h3 className="font-black text-gray-900">{item.title}</h3><p className="mt-2 leading-7 text-gray-600">{item.body}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}
