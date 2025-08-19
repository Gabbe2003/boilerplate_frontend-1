import PostsList from './components/Main-page/PostsList';
import React from 'react';
import PopularPosts from './components/Popular/PopularPosts';
import AdPopup from './components/ads/adsPopup';
import CatsPage from './[slug]/_components/categoryWrapper';
import TradingViewScreener from './components/tickers/TradingViewScreener';
import FinanstidningSeoText from './seoTextMainPage';


export const revalidate = 3000;

const Page = async () => {

return (
  <>
    <div >
      <PopularPosts /> {/* NEEDS OPTIMIZZZEEEE */}
      <TradingViewScreener />
      <CatsPage />
      <PostsList />
      <FinanstidningSeoText />
      <AdPopup />
    </div>

  </>
  );
};

export default Page;
