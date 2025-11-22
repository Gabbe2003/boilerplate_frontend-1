"use client";

import { Mail } from "lucide-react";
import { memo, useState } from "react";

type Props = {
  variant?: "default" | "compact";
};

function SignUpNewsLetter({ variant = "default" }: Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        window.setRuleSubmitSuccess?.();
      } else {
        const errorData = await res.json();
        alert(
          `Prenumerationen misslyckades: ${errorData.message || "Okänt fel"
          }`
        );
      }
    } catch (err: unknown) {
      let message = "Okänt fel";
      if (err && typeof err === "object" && "message" in err) {
        message = String((err as { message: unknown }).message);
      } else {
        message = String(err);
      }
      alert(`Nätverks- eller oväntat fel: ${message}`);
    }
  };



  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-[#f6efe7] border border-gray-300 font-serif text-[#222]"
      >
        {/* Header row */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4 w-full">
          <div>
            <h3 className="font-semibold text-lg leading-tight">Prenumerera</h3>
            <p className="text-lg leading-tight -mt-1">på nyhetsbrevet</p>
          </div>

          <div className="flex-shrink-0">
            <Mail />
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 w-full">
          <input
            id="rule_email"
            type="email"
            placeholder="ex: info@gmail.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full flex-1 border-b border-gray-400 bg-transparent focus:outline-none py-2 text-sm"
          />
        </div>
      </form>
    );
  }


  // -----------------------------------------------------
  // DEFAULT VARIANT 
  // -----------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="rulemailer-subscriber-form">
      <h2 className="rulemailer-header mb-2 text-xl font-bold">
        DAGLIGA NYHETER DIREKT I DIN INKORG!
      </h2>
      <p className="rulemailer-header mb-4 text-sm font-semibold">
        Få de senaste nyheterna och uppdateringarna varje dag.
      </p>
      <input
        id="rule_email"
        type="email"
        placeholder="ex: info@gmail.se"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-6 w-full rounded border p-2"
      />
      <div id="recaptcha"></div>
      <button
        type="submit"
        className="w-full cursor-pointer rounded bg-[#FFA94D] p-2 text-white"
      >
        Skicka
      </button>
      <p className="mt-4 text-xs text-gray-500">
        Genom att skicka in min e-postadress samtycker jag till att ta emot
        dagliga uppdateringar och marknadsföringsmejl.
      </p>
    </form>
  );
}


export default memo(SignUpNewsLetter);
