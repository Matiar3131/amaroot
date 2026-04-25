import PusherServer from "pusher";
import PusherClient from "pusher-js";

if (typeof window !== "undefined") {
  PusherClient.logToConsole = true;
}

// ১. সার্ভার সাইড কনফিগ (এটি শুধু Actions/Server Components এ ব্যবহার হবে)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});


/**
 * ২. ক্লায়েন্ট সাইড কনফিগ (এটি শুধু Client Components এ ব্যবহার হবে)
 * আমরা এটি চেক করছি যেন সার্ভার সাইড রেন্ডারিং (SSR) এর সময় এটি কল না হয়।
 */
export const pusherClient = typeof window !== "undefined" 
  ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      forceTLS: true,
    })
  : null;