import { NextResponse } from "next/server";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = "3InRCEDtojc1F8qlDEgE";

async function ghlFetch(path: string, options: RequestInit = {}) {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`${GHL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
      ...options.headers,
    },
  });

  if (!res.ok) {
    console.error(`GHL API error: ${res.status} for ${path}`);
    return null;
  }

  return res.json();
}

export async function POST(request: Request) {
  const data = await request.json();

  // Accept flexible field names from Zapier
  const firstName = data.firstName || data.first_name || data.clientFirstName || data.name?.split(" ")[0] || "";
  const lastName = data.lastName || data.last_name || data.clientLastName || data.name?.split(" ").slice(1).join(" ") || "";
  const phone = data.phone || data.clientPhone || data.mobile || "";
  const email = data.email || data.clientEmail || "";
  const businessSlug = data.businessSlug || data.business || "";
  const googleReviewUrl = data.googleReviewUrl || "";

  if (!phone && !email) {
    return NextResponse.json({ error: "Phone or email required" }, { status: 400 });
  }

  // 1. Create or update contact in GHL
  const contactPayload: Record<string, unknown> = {
    firstName,
    lastName,
    phone,
    email: email || undefined,
    locationId: LOCATION_ID,
    tags: ["Review Request"],
    source: `Review Accelerator - ${businessSlug || "Direct"}`,
  };

  const contactResult = await ghlFetch("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify(contactPayload),
  });

  const contactId = contactResult?.contact?.id;

  if (!contactId) {
    console.error("Failed to create/upsert contact:", { firstName, lastName, phone });
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }

  // 2. Add review request tag
  await ghlFetch(`/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({
      tags: ["Review Request", `Client - ${businessSlug || "Unknown"}`],
    }),
  });

  // 3. Add note
  await ghlFetch(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({
      body: `Review request triggered for ${businessSlug || "Unknown Business"}.\nCustomer: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email || "N/A"}`,
    }),
  });

  // 4. Send Telegram notification
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || "7646827279";

  if (telegramToken) {
    const message = [
      `⭐ REVIEW REQUEST TRIGGERED`,
      ``,
      `Business: ${businessSlug || "Unknown"}`,
      `Customer: ${firstName} ${lastName}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramChatId, text: message }),
      });
    } catch (err) {
      console.error("Telegram failed:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    contactId,
    message: `Review request created for ${firstName} ${lastName}`,
  });
}
