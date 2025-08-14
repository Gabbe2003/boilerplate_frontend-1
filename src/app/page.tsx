import PostsList from './components/Main-page/PostsList';
import React from 'react';
import PopularPosts from './components/Popular/PopularPosts';
import AdPopup from './components/ads/adsPopup';
import CatsPage from './[slug]/_components/categoryWrapper';
import ViewedPosts from './components/ViewsPosts';
import PopularNewsTicker from './components/PopularNewsTicker';

export const revalidate = 3000;

export async function generateStaticParams() {
  const res = await fetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          posts(first: 100) {
            nodes { slug }
          }
        }
      `,
    }),
  });

  const json = (await res.json()) as {
    data: { posts: { nodes: Array<{ slug: string }> } };
  };
  return json.data.posts.nodes.map((post) => ({ slug: post.slug }));
}

const Page = async () => {

return (
  <>
    <div className='grid gap-10 px-2'>
      <PopularPosts />
      <PopularNewsTicker
        speed={90}              // pixels/second
        showThumbnails={true}   // or false
        className="mx-auto"     // optional extra classes
      />
      <CatsPage />
      <PostsList />
    </div>
    {/* <AdPopup /> */}

    <div className="flex w-full flex-col gap-8 px-4 py-10 md:flex-row">
      
      <section className="w-full md:w-4/5 lg:w-3/1">
      </section>
      {/* <aside className="w-full md:w-1/5 lg:w-1/2 shrink-0">
      // </aside> */}
      {/* <ViewedPosts /> */}
    </div>
  </>
  );
};

export default Page;
