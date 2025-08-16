"use client";
import React, { useEffect, useRef } from "react";

export default function TradingViewMarketsDashboard() {
  const cryptoRef = useRef<HTMLDivElement>(null);
  const cryptoTARef = useRef<HTMLDivElement>(null);

  const stocksRef = useRef<HTMLDivElement>(null);
  const stocksTARef = useRef<HTMLDivElement>(null);

  const resourcesRef = useRef<HTMLDivElement>(null);
  const resourcesTARef = useRef<HTMLDivElement>(null);

  const loadWidget = (
    ref: React.RefObject<HTMLDivElement>,
    scriptSrc: string,
    config: object
  ) => {
    if (ref.current) {
      ref.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(config);
      ref.current.appendChild(script);
    }
  };

  useEffect(() => {
    // --- CRYPTO ---
    loadWidget(
      cryptoRef,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
      {
        symbols: [
          ["BINANCE:BTCUSDT|1D"],
          ["BINANCE:ETHUSDT|1D"],
          ["BINANCE:XRPUSDT|1D"],
        ],
        chartOnly: false,
        width: "100%",
        height: "400",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
      }
    );
    loadWidget(
      cryptoTARef,
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
      {
        interval: "1D",
        width: "100%",
        height: "400",
        symbol: "BINANCE:BTCUSDT",
        showIntervalTabs: true,
        locale: "en",
        colorTheme: "light",
      }
    );

    // --- STOCKS ---
    loadWidget(
      stocksRef,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
      {
        symbols: [
          ["NASDAQ:AAPL|1D"],
          ["NASDAQ:TSLA|1D"],
          ["NASDAQ:AMZN|1D"],
        ],
        chartOnly: false,
        width: "100%",
        height: "400",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
      }
    );
    loadWidget(
      stocksTARef,
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
      {
        interval: "1D",
        width: "100%",
        height: "400",
        symbol: "NASDAQ:AAPL",
        showIntervalTabs: true,
        locale: "en",
        colorTheme: "light",
      }
    );

    // --- RESOURCES (Commodities) ---
    loadWidget(
      resourcesRef,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
      {
        symbols: [
          ["OANDA:XAUUSD|1D"], // Gold
          ["OANDA:WTIUSD|1D"], // Oil
          ["OANDA:NGUSD|1D"],  // Natural Gas
        ],
        chartOnly: false,
        width: "100%",
        height: "400",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
      }
    );
    loadWidget(
      resourcesTARef,
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
      {
        interval: "1D",
        width: "100%",
        height: "400",
        symbol: "OANDA:XAUUSD",
        showIntervalTabs: true,
        locale: "en",
        colorTheme: "light",
      }
    );
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-10">
      {/* CRYPTO SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Crypto Markets</h2>
        <div ref={cryptoRef} className="tradingview-widget-container" />
        <h3 className="text-lg font-medium mt-4 mb-2">Technical Analysis (BTC)</h3>
        <div ref={cryptoTARef} className="tradingview-widget-container" />
      </section>
      <hr className="border-gray-300" />

      {/* STOCKS SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Stock Markets</h2>
        <div ref={stocksRef} className="tradingview-widget-container" />
        <h3 className="text-lg font-medium mt-4 mb-2">Technical Analysis (AAPL)</h3>
        <div ref={stocksTARef} className="tradingview-widget-container" />
      </section>
      <hr className="border-gray-300" />

      {/* RESOURCES SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Resources & Commodities</h2>
        <div ref={resourcesRef} className="tradingview-widget-container" />
        <h3 className="text-lg font-medium mt-4 mb-2">Technical Analysis (Gold)</h3>
        <div ref={resourcesTARef} className="tradingview-widget-container" />
      </section>
    </div>
  );
}
