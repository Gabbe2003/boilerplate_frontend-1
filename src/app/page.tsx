import PostsList from './components/Main-page/PostsList';
import React from 'react';
import CategorySections from './components/categories/CategoryFeed';
import PopularPosts from './components/Popular/PopularPosts';
// import AdPopup from './components/ads/adsPopup';

export const revalidate = 3000;


const Page = async () => {

return (
  <>
    <div className='grid gap-10'>
      <PopularPosts  />
      <CategorySections />
      <PostsList />
    </div>
    {/* <AdPopup /> */}

    <div className="flex w-full flex-col gap-8 px-4 py-10 md:flex-row">
      
      <section className="w-full md:w-4/5 lg:w-3/1">
      </section>
      {/* <aside className="w-full md:w-1/5 lg:w-1/2 shrink-0">
        <ViewedPosts />
      </aside> */}
    </div>
  </>
  );
};

export default Page;
