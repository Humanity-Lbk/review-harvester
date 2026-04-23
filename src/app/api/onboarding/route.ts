import { NextResponse } from "next/server";

const GHL_API_BASE = "https://services.leadconnectorhq.com";

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
    console.error(`GHL API error: ${res.status} ${res.statusText} for ${path}`);
    return null;
  }

  return res.json();
}

export async function POST(request: Request) {
  const data = await request.json();

  const contactName = data.contactName || "Unknown";
  const businessName = data.businessName || "Unknown Business";

  const crmDisplay =
    data.crm === "other" && data.crmOther
      ? `Other: ${data.crmOther}`
      : data.crm || "Not provided";

  const triggerDisplay =
    data.trigger === "other" && data.triggerOther
      ? `Other: ${data.triggerOther}`
      : data.trigger?.replace(/_/g, " ") || "Not provided";

  // Build the full summary
  const summaryLines = [
    `CRM/Software: ${crmDisplay}`,
    `Completion Trigger: ${triggerDisplay}`,
    `Monthly Volume: ${data.customerVolume || "Not provided"}`,
    `Has Zapier/Make: ${data.hasZapier?.replace(/_/g, " ") || "Not answered"}`,
    `Contact Preference: ${data.contactMethod?.replace(/_/g, " ") || "Not answered"}`,
    `Current Reviews: ${data.currentReviewCount || "Not provided"}`,
    `Current Rating: ${data.currentRating || "Not provided"}`,
    `Asking for Reviews: ${data.alreadyAsking?.replace(/_/g, " ") || "Not answered"}`,
    data.currentProcess ? `Current Process: ${data.currentProcess}` : null,
    data.biggestChallenge ? `Biggest Challenge: ${data.biggestChallenge}` : null,
  ].filter(Boolean);

  const noteBody = `ONBOARDING QUIZ COMPLETED — ${businessName}\n\n${summaryLines.join("\n")}`;

  // 1. Send to Telegram
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || "7646827279";

  if (telegramToken) {
    const message = [
      `📋 ONBOARDING QUESTIONNAIRE COMPLETED`,
      ``,
      `Business: ${businessName}`,
      `Contact: ${contactName}`,
      ``,
      `━━━ How They Work ━━━`,
      `CRM/Software: ${crmDisplay}`,
      `Completion Trigger: ${triggerDisplay}`,
      `Monthly Volume: ${data.customerVolume || "Not provided"}`,
      `Has Zapier/Make: ${data.hasZapier?.replace(/_/g, " ") || "Not answered"}`,
      `Contact Preference: ${data.contactMethod?.replace(/_/g, " ") || "Not answered"}`,
      ``,
      `━━━ Review State ━━━`,
      `Current Reviews: ${data.currentReviewCount || "Not provided"}`,
      `Current Rating: ${data.currentRating || "Not provided"}`,
      `Asking for Reviews: ${data.alreadyAsking?.replace(/_/g, " ") || "Not answered"}`,
      data.currentProcess ? `Current Process: ${data.currentProcess}` : null,
      data.biggestChallenge ? `Biggest Challenge: ${data.biggestChallenge}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
          }),
        }
      );
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }
  }

  // 2. Find contact in GHL by company name
  const locationId = "3InRCEDtojc1F8qlDEgE";
  let contactId: string | null = null;

  const searchResult = await ghlFetch(
    `/contacts/?locationId=${locationId}&query=${encodeURIComponent(businessName)}&limit=5`
  );

  if (searchResult?.contacts?.length > 0) {
    contactId = searchResult.contacts[0].id;
  }

  // Fallback: try searching by contact name if business name didn't match
  if (!contactId && contactName !== "Unknown") {
    const nameSearch = await ghlFetch(
      `/contacts/?locationId=${locationId}&query=${encodeURIComponent(contactName)}&limit=5`
    );
    if (nameSearch?.contacts?.length > 0) {
      contactId = nameSearch.contacts[0].id;
    }
  }

  if (contactId) {
    // 3. Add "Onboarding Complete" tag
    await ghlFetch(`/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({
        tags: ["Onboarding Complete"],
      }),
    });

    // 4. Add note with quiz data
    await ghlFetch(`/contacts/${contactId}/notes`, {
      method: "POST",
      body: JSON.stringify({
        body: noteBody,
      }),
    });

    // 5. Update contact with quiz data in custom fields (optional, best-effort)
    await ghlFetch(`/contacts/${contactId}`, {
      method: "PUT",
      body: JSON.stringify({
        customFields: [
          { key: "crm_software", value: crmDisplay },
          { key: "completion_trigger", value: triggerDisplay },
          { key: "customer_volume", value: data.customerVolume },
          { key: "contact_preference", value: data.contactMethod },
          { key: "current_review_count", value: data.currentReviewCount },
          { key: "current_rating", value: data.currentRating },
        ],
      }),
    });

    console.log(`GHL updated: contact ${contactId} tagged + note added for ${businessName}`);
  } else {
    console.error(`GHL: Could not find contact for "${businessName}" / "${contactName}"`);
  }

  return NextResponse.json({ ok: true });
}
