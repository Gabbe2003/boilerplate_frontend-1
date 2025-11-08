"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ITOCItem } from "@/lib/types";

type Props = { toc: ITOCItem[]; defaultOpen?: boolean };

export default function TableOfConet({ toc, defaultOpen = true }: Props) {
  if (!toc || toc.length <= 1) return null;

  const [open, setOpen] = useState(defaultOpen);
  const headingId = useId();
  const panelId = `${headingId}-panel`;

  return (
    <section className="mb-6 border rounded-xl">
      <h2 className="text-base font-semibold">
        <button
          id={headingId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 cursor-pointer "
        >
          <span>Innehållsförtäckning</span>
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </h2>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={open ? "block" : "hidden"}
      >
        <nav aria-label="Table of contents" className="px-4 pb-4">
          <ul className="space-y-1 text-sm list-disc">
            {toc.map((item) => (
              <li key={item.id} className="">
                <Link href={`#${item.id}`} prefetch={false} className="hover:underline">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
