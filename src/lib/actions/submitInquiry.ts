"use server";

import { PurchaseFormData, PurchaseFormSchema } from "@/components/purchaseForm";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

// Helper: sanitize and bound strings
const clean = (str: string, maxLen = 1000) =>
  str.replace(/[<>]/g, "").trim().slice(0, maxLen);

export async function submitInquiry(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data: PurchaseFormData = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    link: formData.get("link")?.toString() || undefined,
    source: (formData.get("source")?.toString() as "ad" | "link") ?? undefined,
  };

  const parsed = PurchaseFormSchema.safeParse(data);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) errors[issue.path[0].toString()] = issue.message;
    }
    return { status: "error", message: "Validation error", errors };
  }

  const safe = parsed.data;
  const recipient = process.env.FORM_RECEIVER_EMAILS?.split(",")
    .map((e) => e.trim())
    .find((e) => e.includes("@"));

  if (!recipient) {
    console.error("[submitInquiry] Missing FORM_RECEIVER_EMAILS");
    return { status: "error", message: "Server config error." };
  }

  const site = process.env.NEXT_PUBLIC_HOSTNAME || "Website";
  const kind = safe.source ?? (safe.link ? "link" : "ad");
  const subject =
    kind === "link"
      ? `New Link Purchase request from ${site}`
      : `New Ad Inquiry from ${site}`;
  const plainText =
    `New ${kind === "link" ? "link purchase" : "ad inquiry"} from ${
      safe.name
    } (${safe.email})\n\n` +
    (safe.link ? `Link: ${safe.link}\n\n` : "") +
    `Message: ${safe.message}`;

  const htmlText =
    `<p><strong>New ${kind === "link" ? "link purchase" : "ad inquiry"} from ${safe.name} (${safe.email})</strong></p>` +
    (safe.link ? `<p><strong>Link:</strong> ${safe.link}</p>` : "") +
    `<p><strong>Message:</strong></p><p>${safe.message}</p>`;

  const payload = {
    transaction_type: "email",
    transaction_name: kind === "link" ? "Link Purchase" : "Ad Inquiry",
    subject,
    from: {
      name: site,
      email: process.env.RULE_FROM_EMAIL || "noreply@rule.se",
    },
    to: { email: recipient },
    content: {
      plain: Buffer.from(plainText, "utf8").toString("base64"),
      html: Buffer.from(htmlText, "utf8").toString("base64"),
    },
  };

  try {
    const res = await fetch("https://app.rule.io/api/v2/transactionals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RULE_API_KEY}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[Rule.io Error]", await res.text());
      return { status: "error", message: "Failed to send email." };
    }

    return { status: "success", message: "Your request has been submitted!" };
  } catch (err) {
    console.error("[submitInquiry] Unexpected:", err);
    return { status: "error", message: "Internal error." };
  }
}
