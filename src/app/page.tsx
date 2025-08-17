import PostsList from './components/Main-page/PostsList';
import React from 'react';
import PopularPosts from './components/Popular/PopularPosts';
import AdPopup from './components/ads/adsPopup';
import CatsPage from './[slug]/_components/categoryWrapper';
import TradingViewScreener from './components/tickers/TradingViewScreener';


export const revalidate = 3000;

const Page = async () => {

return (
  <>
    <div className='grid gap-10'>
      <PopularPosts />
      <TradingViewScreener />
      <CatsPage />
      <PostsList />
    {/* <AdPopup /> */}
    </div>

    <div className="flex w-full flex-col gap-8 px-4 py-10 md:flex-row">
      
      <section className="w-full md:w-4/5 lg:w-3/1">
      </section>
    </div>
  </>
  );
};

export default Page;
