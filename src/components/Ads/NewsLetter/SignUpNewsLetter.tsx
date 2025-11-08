import { useState } from "react";

export default function SignUpNewsLetter(){
    const [email, setEmail] = useState('');
        
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            window.setRuleSubmitSuccess?.();
        } else {
            const errorData = await res.json();
            alert(`Prenumerationen misslyckades: ${errorData.message || 'Okänt fel'}`);
        }
        } catch (err: unknown) {
        let message = 'Okänt fel';
        if (err && typeof err === 'object' && 'message' in err) {
            message = String((err as { message: unknown }).message);
        } else {
            message = String(err);
        }
        alert(`Nätverks- eller oväntat fel: ${message}`);
        }
    };

    return(
        <>
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
                    Genom att skicka in min e-postadress samtycker jag till att ta emot dagliga uppdateringar och marknadsföringsmejl.
                </p>
            </form>
        </>
    )
}
