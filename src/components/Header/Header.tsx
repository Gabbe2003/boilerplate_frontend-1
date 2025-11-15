import "server-only";

import Image from "next/image";
import Link from "next/link";
import { DesktopHeader } from "./Header_breakpoint/Desktop";
import SearchBar from "./Search_Component/SearchBar";
import { MobileHeader } from "./Header_breakpoint/Moblie";
import { get_all_categories_by_name } from "@/lib/graphql_queries/getCategories";
import { getAllPostsByTitle } from "@/lib/graphql_queries/getPost";

const links = [
  { name: "ANNONSERA", href: "/advertisement" },
  { name: "NYHETSBREV", href: "/nyhetsbrev" },
];

export default async function Header() {
  const data = await get_all_categories_by_name();
  const allPost = await getAllPostsByTitle();

  return (
    <header className="w-full bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="base-width-for-all-pages mx-auto "> 
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Finanstidning.se startsida" className="block">
            <Image
              src="/Finanstidning_with_slogan.png"
              overrideSrc="/Finanstidning_with_slogan.png"
              alt="Finanstidning.se logotyp"
              width={70}
              height={50}
              className="!w-[100px] !h-[60px] object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex flex-1 justify-end">
            <DesktopHeader links={links} all_categories={data} />
          </div>

          <div className="flex lg:hidden">
            <MobileHeader links={links} all_categories={data} />
          </div>
        </div>
        <div className=" md:flex w-full justify-center pb-3">
          <SearchBar posts={allPost} action="/search" />
        </div>
      </div>
    </header>
  );
}
