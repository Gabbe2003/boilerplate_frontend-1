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
   <section className="mb-4 border border-[#d4c9c0] rounded-lg post-border-theme">
  <h2 className="text-sm font-medium">
    <button
      id={headingId}
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((v) => !v)}
      className="
        flex items-center justify-between w-full
        px-3 cursor-pointer select-none
      "
    >
      <span className="text-[16px] font-semibold">
        Innehållsförteckning
      </span>

      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className={`size-3 transition-transform mr-1 ${open ? "rotate-180" : ""}`}
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
    className={`
      overflow-hidden transition-all duration-300
      ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
    `}
  >
    <nav aria-label="Table of contents" className="px-3 pb-3 pt-1">
      <ul className="space-y-1 text-[11px] list-disc pl-4">
        {toc.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              prefetch={false}
              className="!text-black hover:underline"
            >
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
