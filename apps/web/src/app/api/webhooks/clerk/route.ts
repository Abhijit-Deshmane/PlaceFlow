import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

/**
 * POST /api/webhooks/clerk
 *
 * Handles incoming Clerk webhook events (user.created, user.updated, user.deleted).
 * Verifies the Svix signature to ensure authenticity.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn(
      "[Clerk Webhook] CLERK_WEBHOOK_SECRET not set, skipping verification.",
    );
    return NextResponse.json({ message: "Webhook secret not configured" }, { status: 200 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing required svix headers" },
      { status: 400 },
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: { type: string; data: Record<string, unknown> };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error("[Clerk Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  const eventType = evt.type;
  console.log(`[Clerk Webhook] Received verified event: ${eventType}`);

  // Handle specific webhook event types if necessary
  switch (eventType) {
    case "user.created":
    case "user.updated":
    case "user.deleted":
      // User synchronization is also supported on-demand via GET /api/v1/auth/me
      break;
    default:
      break;
  }

  return NextResponse.json({ success: true });
}
