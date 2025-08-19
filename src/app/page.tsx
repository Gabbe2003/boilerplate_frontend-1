// app/page.tsx
import React from 'react';

import PostsList from './components/Main-page/PostsList';
import PopularPosts from './components/Popular/PopularPosts';
import CatsPage from './[slug]/_components/categoryWrapper';
import TradingViewScreener from './components/tickers/TradingViewScreener';
import FinanstidningSeoText from './seoTextMainPage';
import AdPopup from './components/ads/adsPopup';

export default async function Page() {
 
return (
  <>
    <div >
      <PopularPosts /> 
      <TradingViewScreener />
      <CatsPage />
      <PostsList />
      <FinanstidningSeoText />
      <AdPopup />
    </div>
    </>
  );
}
