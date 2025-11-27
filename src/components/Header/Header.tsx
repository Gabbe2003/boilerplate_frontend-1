"use client";

import { CategoryName, PostTitleSlug } from "@/lib/types";
import { DesktopHeader } from "./Header_breakpoint/Desktop";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import SearchBar from "./Search_Component/SearchBar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

type HeaderProps = {
  categories_name: CategoryName[];
  allPost: PostTitleSlug[];
};

export default function Header({ categories_name, allPost }: HeaderProps) {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const lastScrollY = useRef(0);
  const direction = useRef(0);
  const lastChangePoint = useRef(0);

  const pathname = usePathname(); 
  const isHome = pathname === "/";

  useEffect(() => {
    const THRESHOLD = 10;

    const handleScroll = () => {
      const y = window.scrollY;
      const diff = y - lastScrollY.current;
      if (Math.abs(diff) < THRESHOLD) return;

      const newDir = diff > 0 ? 1 : -1;

      if (newDir !== direction.current) {
        direction.current = newDir;
        lastChangePoint.current = y;
      }

      if (direction.current === 1 && y - lastChangePoint.current > 20) {
        setShowNav(false);
      }
      if (direction.current === -1 && lastChangePoint.current - y > 20) {
        setShowNav(true);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className="w-full flex justify-center sticky top-0 z-50 bg-background py-4 lg:py-3">
      <div className="base-width-for-all-pages">

        {/* TOP ROW */}
        <div className="relative flex items-center justify-between py-4 lg:py-3 ">

          <div className="hidden lg:flex gap-4 text-sm ">
            <Link href="/about" className="border-r border-gray-400 pr-4 hover:opacity-70">
              Om oss
            </Link>
            <Link href="/contact" className="hover:opacity-70">
              Kontakta oss
            </Link>
          </div>

          <h2
            className="
              font-serif text-[#1A1A1A]
              text-2xl xs:text-3xl sm:text-4xl

              /* MOBILE: normal flow */
              lg:absolute lg:left-1/2 lg:-translate-x-1/2
            "
          >
            <Link href="/" prefetch={false}>{process.env.NEXT_PUBLIC_HOSTNAME}</Link>
          </h2>

          {/* RIGHT — MENU ON MOBILE, EMAIL ON DESKTOP */}
          <div className="lg:hidden">
            <button onClick={() => setMobileOpen((p) => !p)} className="text-3xl cursor-pointer">
              <Menu />
            </button>
          </div>

          <div className="hidden lg:flex text-sm">
            {isHome ? (
        <h1 className="block lg:hidden text-sm text-center mr-10">
          Dina dagliga nyheter inom finans, aktier & börsen
        </h1>
      ) : (
        <h2 className="block lg:hidden text-sm text-center mr-10">
          Dina dagliga nyheter inom finans, aktier & börsen
        </h2>
      )}
          </div>

        </div>

        {/* MOBILE DROPDOWN */}
        {/* Overlay (click-to-close) */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        {/* MOBILE DRAWER */}
        <div
          className={`
    fixed top-0 right-0 h-full w-64 bg-[#FCF6F0] shadow-lg z-50
    transform transition-transform duration-300 lg:hidden
    ${mobileOpen ? "translate-x-0" : "translate-x-full"}
  `}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5d8c9]">
           {isHome ? (
        <h1 className="block lg:hidden text-sm text-center mr-10">
          Dina dagliga nyheter inom finans, aktier & börsen
        </h1>
      ) : (
        <h2 className="block lg:hidden text-sm text-center mr-10">
          Dina dagliga nyheter inom finans, aktier & börsen
        </h2>
      )}

            {/* Close BTN (X) */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="text-xl font-semibold text-[#2f2a26] cursor-pointer"
            >
              X
            </button>
          </div>


          {/* NAVIGATION */}
          <nav className="flex flex-col mt-4 px-4 gap-3 text-sm font-semibold">
            {categories_name.map((cat, index) => (
              <Link
                key={cat.name + index}
                href={`/category/${cat.name.toLowerCase()}`}
                className="text-[#1A1A1A] hover:text-red-600 transition"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>


        {/* MOBILE SEARCHBAR */}
        <div className="lg:hidden mt-4">
          <SearchBar posts={allPost} action="/search" limitWidth="100%" />
        </div>

        {/* DESKTOP NAVIGATION */}
        {showNav && (
          <div className="hidden lg:block">
            <DesktopHeader categories_name={categories_name} allPost={allPost} />
          </div>
        )}

      </div>
    </header>
  );
}
