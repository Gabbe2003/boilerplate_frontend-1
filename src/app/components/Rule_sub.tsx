import * as React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/store/AppContext";

declare global {
  interface Window {
    setRuleSubmitSuccess?: () => void;
  }
}

type PopupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

const MODAL_SUBMIT_KEY = "modalFormSubmittedAt";
const MODAL_DISMISS_KEY = "modalDismissedAt";
const ONE_DAY = 24 * 60 * 60 * 1000;

function recently(key: string) {
  if (typeof window === "undefined") return false;
  const ts = localStorage.getItem(key);
  console.log(`[recently] key: ${key}, value: ${ts}`);
  return ts ? Date.now() - new Date(ts).getTime() < ONE_DAY : false;
}

export default function PopupModal({
  isOpen,
  onClose,
  onSubmit,
}: PopupModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(isOpen);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { logo } = useAppContext();

const timerStartedRef = React.useRef(false);
const timerIdRef = React.useRef<NodeJS.Timeout | null>(null);

React.useEffect(() => {
  let cancelled = false;
  if (
    typeof window !== "undefined" &&
    !recently(MODAL_SUBMIT_KEY) &&
    !recently(MODAL_DISMISS_KEY) &&
    !isOpen &&
    !internalOpen &&
    !timerStartedRef.current
  ) {
    timerStartedRef.current = true;
    console.log("[Timer] Starting 10s timer for modal popup...");
    timerIdRef.current = setTimeout(() => {
      if (!cancelled) {
        console.log("[Timer] 10s passed, opening modal via timer!");
        setInternalOpen(true);
      }
    }, 10000);
  }
  return () => {
    cancelled = true;
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
      console.log("[Timer] Timer cleaned up.");
    }
  };
  // Only depend on isOpen/internalOpen
}, [isOpen, internalOpen]);


  // Effect to sync visible state with isOpen/internalOpen, handles fade out
  React.useEffect(() => {
    const shouldOpen = isOpen || internalOpen;
    if (shouldOpen && !visible) {
      console.log(`[Visibility] Modal becoming visible. isOpen: ${isOpen}, internalOpen: ${internalOpen}`);
      setVisible(true);
    }
    if (!shouldOpen && visible) {
      console.log("[Visibility] Modal starting fade-out.");
      const timer = setTimeout(() => {
        setVisible(false);
        console.log("[Visibility] Modal now hidden.");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, internalOpen, visible]);

  // Effect to set global success handler (for form submit)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.setRuleSubmitSuccess = () => {
        setIsSubmitted(true);
        onSubmit?.();
        localStorage.setItem(MODAL_SUBMIT_KEY, new Date().toISOString());
        console.log("[Global] setRuleSubmitSuccess called. Modal submitted. Timestamp saved.");
      };
      console.log("[Global] setRuleSubmitSuccess handler attached.");
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.setRuleSubmitSuccess;
        console.log("[Global] setRuleSubmitSuccess handler removed.");
      }
    };
  }, [onSubmit]);

  // Handlers
  const closeModal = () => {
    console.log("[Action] Closing modal.");
    onClose();
    setInternalOpen(false);
    localStorage.setItem(MODAL_DISMISS_KEY, new Date().toISOString());
    console.log("[Action] Modal dismissed. Timestamp saved.");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      console.log("[Action] Clicked outside modal, closing.");
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      console.log("[Action] Escape pressed, closing modal.");
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Submit] Submitting email:", email);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.issues) {
          alert(
            "Validation errors:\n" +
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              errorData.issues.map((issue: any) => issue.message).join("\n")
          );
        } else {
          alert(`Subscription failed: ${errorData.message}`);
        }
      }

      if (res.ok) {
        console.log("[Submit] Success! Calling setRuleSubmitSuccess.");
        window.setRuleSubmitSuccess?.();
      } else {
        const errorData = await res.json();
        console.error("[Frontend] Subscription failed:", errorData);
        alert(
          `Subscription failed (${errorData.path || "unknown path"}):\n` +
            `Message: ${errorData.message || "Unknown error"}\n` +
            (errorData.details
              ? `Details: ${JSON.stringify(errorData.details, null, 2)}`
              : "") +
            (errorData.email ? `\nEmail: ${errorData.email}` : "") +
            (errorData.rulePayload
              ? `\nPayload: ${JSON.stringify(errorData.rulePayload, null, 2)}`
              : "")
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[Frontend] Network or unexpected error:", err);
      alert(`Network or unexpected error: ${err.message || err}`);
    }
  };

  if (!visible) {
    console.log("[Render] Modal not visible, returning null.");
    return null;
  }

  console.log("[Render] Modal visible, rendering.");

  return (
    <div
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
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
        <div className="flex w-full md:w-1/2 items-center justify-center bg-[#EDE5DF] p-6 md:p-8">
          {logo?.sourceUrl ? (
            <Image
              src={logo.sourceUrl}
              alt={logo.altText ?? "Logo"}
              width={400}
              height={200}
              className="w-full rounded max-w-[300px] md:max-w-[360px] h-auto object-contain"
              priority
            />
          ) : (
            <span className="text-lg font-bold">Logo</span>
          )}
        </div>
        <div className="flex w-full flex-col justify-center p-6 md:w-2/3">
          <button
            onClick={closeModal}
            className="text-gray-500 absolute right-4 top-4 z-10 rounded-full p-1 hover:text-black"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-gray-800 mb-2 text-xl font-semibold">
                Thank you for subscribing
              </h2>
              <p className="text-gray-600 text-sm">
                You will now receive daily news in your email. If you don’t find
                our emails, check spam or contact us.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rulemailer-subscriber-form"
            >
              <h2 className="rulemailer-header text-xl font-bold mb-2">
                DAILY NEWS IN YOUR INBOX!
              </h2>
              <p className="rulemailer-header text-sm font-semibold mb-4">
                Receive daily news with the most recent updates.
              </p>
              <input
                id="rule_email"
                type="email"
                placeholder="ex: info@gmail.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-6 p-2 w-full border rounded"
              />
              <div id="recaptcha"></div>
              <button
                type="submit"
                className="w-full bg-[#FFA94D] text-white p-2 rounded cursor-pointer"
              >
                Submit
              </button>
              <p className="mt-4 text-xs text-gray-500">
                By submitting my email, I consent to receive daily updates and
                promotional emails.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
