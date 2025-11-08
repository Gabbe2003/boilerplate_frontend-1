"use client";

import { useActionState } from "react";
import { Loader2, Mail, User, Link2, FileText } from "lucide-react";
import clsx from "clsx";
import { ActionState, submitInquiry } from "@/lib/actions/submitInquiry";

type FormVariant = "contact" | "advertisement";

interface FormInquiryProps {
  variant?: FormVariant;
}

export default function FormInquiry({ variant = "contact" }: FormInquiryProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    submitInquiry,
    { status: "idle" }
  );

  const isContact = variant === "contact";

  return (
    <form
    className="w-full mx-auto bg-white rounded-2xl shadow p-6 space-y-5 border border-gray-100"
      action={formAction}
      noValidate
    >
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ditt namn
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            defaultValue={state?.errors ? "" : undefined}
            className={clsx(
              "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2",
              state.errors?.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            )}
          />
        </div>
        {state.errors?.name && (
          <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          E-postadress
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email@domain.se"
            required
            className={clsx(
              "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2",
              state.errors?.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            )}
          />
        </div>
        {state.errors?.email && (
          <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* Conditional Link (contact only) */}
      {isContact && (
        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Länk-URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <input
              type="url"
              id="link"
              name="link"
              placeholder="https://example.com"
              className={clsx(
                "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2",
                state.errors?.link
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              )}
            />
          </div>
          {state.errors?.link && (
            <p className="text-sm text-red-500 mt-1">{state.errors.link}</p>
          )}
        </div>
      )}

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {isContact
            ? "Vad vill du köpa?"
            : "Berätta om din kampanj eller förfrågan. Inkludera alla länkar här."}
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className={clsx(
              "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2",
              state.errors?.message
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            )}
          />
        </div>
        {state.errors?.message && (
          <p className="text-sm text-red-500 mt-1">{state.errors.message}</p>
        )}
      </div>

      {/* Hidden source field */}
      <input type="hidden" name="source" value={isContact ? "link" : "ad"} />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          "w-full text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-all duration-150",
          isContact
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
          isPending && "opacity-70 cursor-not-allowed"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Skickar…
          </>
        ) : state.status === "success" ? (
          "Förfrågan skickad!"
        ) : (
          "Skicka förfrågan"
        )}
      </button>

      {/* Global messages */}
      {state.status === "error" && state.message && (
        <p className="text-sm text-red-600 text-center">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-green-600 text-center">
          Tack! Din förfrågan har skickats.
        </p>
      )}
    </form>
  );
}
