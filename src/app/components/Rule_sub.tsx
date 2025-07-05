import * as React from "react";
import { X } from "lucide-react";
import Image from "next/image";

declare global {
  interface Window {
    setRuleSubmitSuccess?: () => void;
  }
}

type PopupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  onSubmit?: () => void;
};
const MODAL_SUBMIT_KEY = "modalFormSubmittedAt";

// HTML from Rule.io
const RULEMAILER_HTML = `
  <style>
    .grecaptcha-badge { display: none; }
    .rulemailer-subscriber-form {
      font-family: 'Inter', sans-serif;
      width: 100%;
      max-width: 312px;
      margin: 0 auto;
      text-align: center;
    }
    .rulemailer-subscriber-form label {
      display: inline-block;
      font-weight: 700;
      margin-bottom: 8px;
      color: #3F4752;
      font-size: 14px;
      text-align: left;
    }
    .rulemailer-subscriber-form input {
      margin-bottom: 24px;
      padding: 9px 12px;
      width: 100%;
      border: 1px solid #E7E9EE;
      border-radius: 8px;
      font-size: 14px;
    }
    .rulemailer-subscriber-form input:focus {
      outline: none;
      border-color: #3A36DB;
    }
    .rulemailer-subscriber-form button {
      width: 100%;
      margin-top: 12px;
      background: #FFA94D;
      color: #fff;
      padding: 10px;
      height: 40px;
      border-radius: 10px;
      border: 2px solid #333;
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
    }
    .rulemailer-subscriber-form button:hover { background: #FF871E; }
    .rulemailer-subscriber-form button:active { background: #E66A00; }
    .rulemailer-email-check { display: none !important; }
    .rulemailer-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-bottom: 12px;
    }
    .rulemailer-header p {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    .rulemailer-disclaimer {
      font-size: 12px;
      color: #999;
      margin-top: 16px;
    }
  </style>

  <div class="rulemailer-subscriber-form">
    <div style="margin-bottom: 16px;"></div>

    <div class="rulemailer-header">
      <h2>FINANSNYHETER<br />RAKT I DIN INBOX!</h2>
      <p>
        Få även en exklusiv handbok<br />
        från Analyst Group:<br />
        <em>"Bli expert på aktier – Så hittar du vinnare"</em>
      </p>
    </div>

    <form id="rule-optin-form" action="https://app.rule.io/subscriber-form/subscriber" method="POST">
      <input type="hidden" value="174903" name="tags[]" />
      <input type="hidden" name="token" value="9fb5fa63-18b29eb-911ef2e-e8be117-5f1b203-8c4" />
      <input id="rule_email" type="email" placeholder="ex: Finanstid@info.se" name="rule_email" required />
      <label class="rulemailer-email-check">Are you a machine?</label>
      <input type="checkbox" name="email_field" class="rulemailer-email-check" value="1" tabindex="-1" autocomplete="off" />
      <input type="hidden" name="language" value="111" />
      <div id="recaptcha"></div>
      <button type="submit">Prenumerera</button>
    </form>

    <p class="rulemailer-disclaimer">
      Genom att prenumerera godkänner jag att, helt utan kostnad, emotta axplocket och erbjudanden från Finanstids samarbetspartners.
    </p>
  </div>
`;

export default function PopupModal({
  isOpen,
  onClose,
  onSubmit,
}: PopupModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(false);

  // trigger modal after 10 sec if not already submitted
  React.useEffect(() => {
    const submitted = localStorage.getItem(MODAL_SUBMIT_KEY);
    if (!submitted) {
      const timer = setTimeout(() => setInternalOpen(true), 1000 * 10);
      return () => clearTimeout(timer);
    }
  }, []);

  React.useEffect(() => {
    const shouldOpen = isOpen || internalOpen;
    if (shouldOpen) setVisible(true);
    else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, internalOpen]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setInternalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  React.useEffect(() => {
    if (!(isOpen || internalOpen)) return;

    const container = containerRef.current;

    // Global callback on success
    window.setRuleSubmitSuccess = () => {
      setIsSubmitted(true);
      if (typeof onSubmit === "function") onSubmit();
      localStorage.setItem(MODAL_SUBMIT_KEY, new Date().toISOString());
      console.log("Submission stored:", localStorage.getItem(MODAL_SUBMIT_KEY));
    };

    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit";
    script.async = true;
    script.defer = true;

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      var widgetId;
      function onloadCallback() {
        widgetId = grecaptcha.render('recaptcha', {
          sitekey: '6LfbPnAUAAAAACqfb_YCtJi7RY0WkK-1T4b9cUO8',
          size: 'invisible',
          callback: submitRuleOptin
        });
      }

      function submitRuleOptin(token) {
        const form = document.getElementById("rule-optin-form");
        const formData = new FormData(form);

        fetch(form.action, { method: "POST", body: formData })
          .then(response => {
            if (response.ok && typeof window.setRuleSubmitSuccess === "function") {
              window.setRuleSubmitSuccess();
            } else {
              console.error("Form submission failed");
            }
          }).catch(err => console.error("Form submission error", err));
      }

      setTimeout(() => {
        const form = document.getElementById('rule-optin-form');
        if (form) {
          form.addEventListener('submit', function(e) {
            if (this.checkValidity()) {
              e.preventDefault();
              grecaptcha.execute(widgetId);
            }
          });
        }
      }, 500);
    `;

    container?.appendChild(script);
    container?.appendChild(inlineScript);

    return () => {
      container?.querySelectorAll("script").forEach((s) => s.remove());
      delete window.setRuleSubmitSuccess;
    };
  }, [isOpen, internalOpen, onSubmit]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
      setInternalOpen(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${
        isOpen || internalOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative flex w-full max-w-3xl transform flex-col rounded-lg bg-white p-0 shadow-lg transition-all duration-300 md:flex-row ${
          isOpen || internalOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
      >
        <div className="flex w-auto items-center justify-center rounded-t-lg bg-[#EDE5DF] md:w-2/3 md:rounded-none md:rounded-r-lg">
          <Image
            src="/images/finanstid_logo.png"
            alt="Finanstid Promo"
            width={300}
            height={100}
            className="h-20 max-h-40 w-auto object-contain md:h-auto"
          />
        </div>

        <div className="flex w-full flex-col justify-center p-6 md:w-2/3">
          <button
            onClick={() => {
              onClose();
              setInternalOpen(false);
            }}
            className="text-gray-500 absolute right-4 top-4 z-10 rounded-full p-1 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-gray-800 mb-2 text-xl font-semibold">
                Tack för din prenumeration!
              </h2>
              <p className="text-gray-600 text-sm">
                Du kommer nu att få finansnyheter och vår exklusiva handbok
                direkt i din inbox.
              </p>
            </div>
          ) : (
            <div
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: RULEMAILER_HTML }}
            />
          )}
        </div>
      </div>
    </div>
  );
}