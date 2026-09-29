"use client";

import { useState } from "react";

type FAQItem = {
  category: string;
  question: string;
  answer: string;
};

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold uppercase text-green-700">FAQ</p>
        <h2 className="mt-2 text-3xl font-black">Common questions</h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600">Everything you need to know about accounts, jobs, talent, employer tools, and support.</p>

        <div className="mt-6 space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={`${item.category}-${item.question}`} className="rounded-lg border border-gray-200 bg-[#f8fafc]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">{item.category}</p>
                    <p className="mt-1 text-lg font-black text-gray-900">{item.question}</p>
                  </div>
                  <span className="text-2xl font-light text-gray-500">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <p className="border-t border-gray-200 px-4 py-4 text-sm leading-7 text-gray-700 md:px-5">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
