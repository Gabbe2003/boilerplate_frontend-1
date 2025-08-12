'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';

function useTradingViewWidget(
  container: React.RefObject<HTMLDivElement>,
  src: string,
  config: Record<string, any>
) {
  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.current.appendChild(script);

    return () => {
      if (container.current) container.current.innerHTML = '';
    };
  }, [container, src, JSON.stringify(config)]);
}

// --- 1) Crypto Heatmap ---
function CryptoHeatmapWidget() {
  const ref = useRef<HTMLDivElement | null>(null);

  useTradingViewWidget(
    ref,
    'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js',
    {
      dataSource: 'Crypto',
      blockSize: 'market_cap_calc',
      blockColor: 'change',
      colorTheme: 'light',
      locale: 'sv_SE',
      isTransparent: false,
      symbolUrl: 'https://www.tradingview.com/symbols/{symbol}/',
      width: '100%',
      height: 550,
    }
  );

  return (
    <div className="tradingview-widget-container w-full bg-white rounded-sm">
      <div className="tradingview-widget-container__widget" ref={ref} />
      <div className="tradingview-widget-copyright px-2 py-1">
        <a
          href="https://www.tradingview.com/heatmap/crypto/"
          rel="noopener nofollow"
          target="_blank"
          className="blue-text text-sm md:text-base"
        >
          Cryptocurrency heatmap by TradingView
        </a>
      </div>
    </div>
  );
}

// --- 2) Market Overview ---
function MarketOverviewWidget() {
  const ref = useRef<HTMLDivElement | null>(null);

  useTradingViewWidget(
    ref,
    'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
    {
      colorTheme: 'light',
      dateRange: '12M',
      locale: 'sv_SE',
      largeChartUrl: '',
      isTransparent: false,
      showFloatingTooltip: false,
      plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
      plotLineColorFalling: 'rgba(41, 98, 255, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      scaleFontColor: '#0F0F0F',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
      belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
      tabs: [
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR to USD' },
            { s: 'FX:GBPUSD', d: 'GBP to USD' },
            { s: 'FX:USDJPY', d: 'USD to JPY' },
            { s: 'FX:USDCHF', d: 'USD to CHF' },
            { s: 'FX:AUDUSD', d: 'AUD to USD' },
            { s: 'FX:USDCAD', d: 'USD to CAD' },
          ],
          originalTitle: 'Forex',
        },
      ],
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#131722',
      width: '100%',
      height: 550,
      showSymbolLogo: true,
      showChart: true,
    }
  );

  return (
    <div className="tradingview-widget-container w-full bg-white rounded-sm">
      <div className="tradingview-widget-container__widget" ref={ref} />
      <div className="tradingview-widget-copyright px-2 py-1">
        <a
          href="https://se.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
          className="blue-text text-sm md:text-base"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
}

// --- 3) Hotlists ---
function HotlistsWidget() {
  const ref = useRef<HTMLDivElement | null>(null);

  useTradingViewWidget(
    ref,
    'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js',
    {
      exchange: 'OMXSTO',
      colorTheme: 'light',
      dateRange: '12M',
      showChart: true,
      locale: 'sv_SE',
      largeChartUrl: '',
      isTransparent: false,
      showSymbolLogo: false,
      showFloatingTooltip: false,
      plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
      plotLineColorFalling: 'rgba(41, 98, 255, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      scaleFontColor: '#0F0F0F',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
      belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
      width: '100%',
      height: 550,
    }
  );

  return (
    <div className="tradingview-widget-container w-full bg-white rounded-sm">
      <div className="tradingview-widget-container__widget" ref={ref} />
      <div className="tradingview-widget-copyright px-2 py-1">
        <a
          href="https://se.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
          className="blue-text text-sm md:text-base"
        >
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
}

// --- 4) Economic Calendar ---
function EconomicCalendarWidget() {
  const ref = useRef<HTMLDivElement | null>(null);

  useTradingViewWidget(
    ref,
    'https://s3.tradingview.com/external-embedding/embed-widget-events.js',
    {
      colorTheme: 'light',
      isTransparent: false,
      locale: 'en',
      countryFilter: 'se',
      importanceFilter: '-1,0,1',
      width: '100%',
      height: 550,
    }
  );

  return (
    <div className="tradingview-widget-container w-full bg-white rounded-sm">
      <div className="tradingview-widget-container__widget" ref={ref} />
      <div className="tradingview-widget-copyright px-2 py-1">
        <a
          href="https://www.tradingview.com/economic-calendar/"
          rel="noopener nofollow"
          target="_blank"
          className="blue-text text-sm md:text-base"
        >
          Economic calendar by TradingView
        </a>
      </div>
    </div>
  );
}

export function SidebarMarkets() {
  return (
    <div className={clsx('transition-all duration-500 overflow-hidden')}>
      <div className="p-0">
        <div className="p-3 space-y-4 flex flex-col items-start">
          <section className="w-full p-3 bg-muted flex flex-col gap-2">
            <span className="text-base md:text-lg font-medium">Market Overview — Live Data</span>
          </section>
          <div className="w-full space-y-4">
            <CryptoHeatmapWidget />
            <MarketOverviewWidget />
            <HotlistsWidget />
            <EconomicCalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
