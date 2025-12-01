import "server-only";

import { ArchiveInfinity } from "./_components/ArchiveInfinity";
import { getPostsPage } from "./actions/wpClient";
import SectionBreaker from "@/components/SectionBreaker";

export default async function ArchivePage() {
  const { posts, endCursor, hasNextPage } = await getPostsPage();

  return (
    <main className="w-full flex justify-center py-12">
     <div className="base-width-for-all-pages">
       <header className="mb-12 ">
        <SectionBreaker />
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Arkiv
        </h1>
      </header>

      <ArchiveInfinity
        initialPosts={posts}
        initialEndCursor={endCursor}
        initialHasNextPage={hasNextPage}
      />
     </div>
    </main>
  );
}
