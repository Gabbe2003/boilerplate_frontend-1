'use client';

import { memo, useEffect, useRef } from 'react';

const SRC =
  'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';

const CONFIG = {
  symbols: [
    { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
    { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
    { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
    { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
    { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
    { proName: 'OMXSTO:OMXS30', title: 'OMX S30' }, // Sweden index (from your snippet)
    { proName: 'NASDAQ:TSLA', title: 'Tesla' },
  ],
  colorTheme: 'light',
  locale: 'en',
  largeChartUrl: '',
  isTransparent: false,
  showSymbolLogo: true,
  displayMode: 'adaptive',
} as const;

function TradingViewTickerTapeImpl() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean slate (handles Strict Mode double-invoke in dev, remounts, etc.)
    container.replaceChildren();

    const script = document.createElement('script');
    script.src = SRC;
    script.type = 'text/javascript';
    script.async = true;
    // TradingView supports reading JSON from the <script> contents:
    script.innerHTML = JSON.stringify(CONFIG);

    container.appendChild(script);

    return () => {
      // Ensure widget is torn down on unmount/remount
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{ backgroundColor: '#fff', overflow: 'hidden' }}
    >
      <div className="tradingview-widget-container__widget" ref={containerRef} />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Ticker tape by TradingView</span>
        </a>
      </div>
    </div>
  );
}

const TradingViewTickerTape = memo(TradingViewTickerTapeImpl);
export default TradingViewTickerTape;
