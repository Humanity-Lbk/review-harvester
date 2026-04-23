import { NextResponse } from "next/server";

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

  // Build the full summary for both Telegram and GHL note
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

  // Send to Telegram
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

  // Send to GHL webhook — tags + custom fields
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
  if (ghlWebhookUrl) {
    try {
      await fetch(ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contactName.split(" ")[0] || contactName,
          lastName: contactName.split(" ").slice(1).join(" ") || "",
          companyName: businessName,
          tags: ["Onboarding Complete"],
          source: "Review Accelerator Onboarding",
          // Pass the full quiz summary as a note field
          onboardingNote: `ONBOARDING QUIZ — ${businessName}\n${summaryLines.join("\n")}`,
          customFields: [
            { key: "crm_software", value: crmDisplay },
            { key: "completion_trigger", value: triggerDisplay },
            { key: "customer_volume", value: data.customerVolume },
            { key: "has_automation_tools", value: data.hasZapier },
            { key: "contact_preference", value: data.contactMethod },
            { key: "current_review_count", value: data.currentReviewCount },
            { key: "current_rating", value: data.currentRating },
            { key: "already_asking_reviews", value: data.alreadyAsking },
            { key: "current_review_process", value: data.currentProcess },
            { key: "biggest_review_challenge", value: data.biggestChallenge },
          ],
        }),
      });
    } catch (err) {
      console.error("GHL webhook failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
