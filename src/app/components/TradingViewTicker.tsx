"use client";

import React, { useEffect, useRef } from "react";

const TradingViewTickerTape = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear any existing widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
        { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
      ],
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
      displayMode: "adaptive",
      largeChartUrl: "",
      showSymbolLogo: true,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{ backgroundColor: "#fff", overflow: "hidden" }}
    >
      <div
        className="tradingview-widget-container__widget"
        ref={containerRef}
      ></div>
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
};

export default TradingViewTickerTape;
