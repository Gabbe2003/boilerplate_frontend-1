"use client";
import React, { useEffect, useRef } from "react";

export default function TradingViewMarketsDashboard() {
  const cryptoRef = useRef<HTMLDivElement>(null);
  const stocksRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

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
    // --- CRYPTO (expanded) ---
    loadWidget(
      cryptoRef,
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
      {
        symbols: [
          ["BINANCE:BTCUSDT|1D"],
          ["BINANCE:ETHUSDT|1D"],
          ["BINANCE:XRPUSDT|1D"],
          ["BINANCE:SOLUSDT|1D"],
          ["BINANCE:ADAUSDT|1D"],
          ["BINANCE:DOGEUSDT|1D"],
          ["BINANCE:MATICUSDT|1D"],
          ["BINANCE:DOTUSDT|1D"],
          ["BINANCE:BNBUSDT|1D"],
          ["BINANCE:AVAXUSDT|1D"],
        ],
        chartOnly: false,
        width: "100%",
        height: "500",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
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
          ["NASDAQ:MSFT|1D"],
          ["NASDAQ:GOOGL|1D"],
        ],
        chartOnly: false,
        width: "100%",
        height: "500",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
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
          ["TVC:SILVER|1D"],   // Silver
          ["TVC:CORN|1D"],     // Corn
          ["TVC:COFFEE|1D"],   // Coffee
        ],
        chartOnly: false,
        width: "100%",
        height: "500",
        locale: "en",
        colorTheme: "light",
        autosize: true,
        showVolume: true,
        showMA: true,
      }
    );
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-10">
      {/* CRYPTO SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Crypto Markets</h2>
        <div ref={cryptoRef} className="tradingview-widget-container" />
      </section>
      <hr className="border-gray-300" />

      {/* STOCKS SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Stock Markets</h2>
        <div ref={stocksRef} className="tradingview-widget-container" />
      </section>
      <hr className="border-gray-300" />

      {/* RESOURCES SECTION */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Resources & Commodities</h2>
        <div ref={resourcesRef} className="tradingview-widget-container" />
      </section>
    </div>
  );
}
