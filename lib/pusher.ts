import PusherServer from "pusher";
import PusherClient from "pusher-js";

// ১. সার্ভার সাইড কনফিগ (এটি শুধু API Routes বা Server Actions-এ ব্যবহার হবে)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

/**
 * ২. ক্লায়েন্ট সাইড কনফিগ
 */

// ডেভেলপমেন্ট মোডে কনসোলে লগ দেখার জন্য
if (typeof window !== "undefined") {
  PusherClient.logToConsole = true;
}

// ক্লায়েন্ট কী চেক (ডিবাগিং এর জন্য)
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
if (typeof window !== "undefined" && !pusherKey) {
  console.error("CRITICAL: Pusher Key is missing in Environment Variables!");
}

export const pusherClient = (typeof window !== "undefined" && pusherKey
  ? new PusherClient(pusherKey, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
    })
  : null) as PusherClient | null;