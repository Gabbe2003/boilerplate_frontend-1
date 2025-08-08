// app/page.tsx  (or page.jsx/tsx)
import PostsList from './components/PostsList';
import React from 'react';
import ViewedPosts from './components/ViewsPosts';
import PopularNews from './components/PouplarQuery';
import TagList from './components/TagCard';
import CategorySections from './components/CategoryArticlesGrid';
// import AdPopup from './components/ads/adsPopup';

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
    <CategorySections />
    <PopularNews  />
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <TagList />
    {/* <AdPopup /> */}

    <div className="flex w-full flex-col gap-8 px-4 py-10 md:flex-row">
      
      <section className="w-full md:w-4/5 lg:w-3/1">
        <PostsList />
      </section>
      <aside className="w-full md:w-1/5 lg:w-1/2 shrink-0">
        <ViewedPosts />
      </aside>
    </div>
  </>
  );
};

export default Page;
