import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const {
    businessName,
    contactName,
    email,
    phone,
    googleProfileUrl,
    notSureProfile,
    software,
    softwareOther,
  } = data;

  // Build the software field
  const softwareValue =
    software === "Other / Not sure" && softwareOther
      ? `Other: ${softwareOther}`
      : software || "Not provided";

  const googleProfile = notSureProfile
    ? "Needs help finding it"
    : googleProfileUrl || "Not provided";

  // 1. Create/update contact in GHL
  const ghlPayload = {
    firstName: contactName.split(" ")[0] || contactName,
    lastName: contactName.split(" ").slice(1).join(" ") || "",
    email,
    phone,
    companyName: businessName,
    tags: ["Lubbock Chamber", "Review Accelerator"],
    source: "Review Accelerator Landing Page",
    customFields: [
      { key: "google_business_profile", value: googleProfile },
      { key: "customer_software", value: softwareValue },
    ],
  };

  // Send to GHL via webhook (env var)
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
  if (ghlWebhookUrl) {
    try {
      await fetch(ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      });
    } catch (err) {
      console.error("GHL webhook failed:", err);
    }
  }

  // 2. Send email notification to Josiah
  // Using a simple approach — POST to a Telegram bot as instant notification
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID || "7646827279";

  if (telegramToken) {
    const message = [
      `🆕 NEW REVIEW ACCELERATOR SIGNUP`,
      ``,
      `Business: ${businessName}`,
      `Contact: ${contactName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Google Profile: ${googleProfile}`,
      `Software: ${softwareValue}`,
      ``,
      `Source: Lubbock Chamber Landing Page`,
    ].join("\n");

    try {
      await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: "HTML",
          }),
        }
      );
    } catch (err) {
      console.error("Telegram notification failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
