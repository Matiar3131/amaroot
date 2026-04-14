import { auth } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RootClient from "./RootClient";

export default async function RootPage() {
  const session = await auth();

  if (!session || !session.user) redirect("/login");

  const userId = (session.user as any).id as string;

  const userNodes = await prisma.node.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <RootClient
      userId={userId}
      initialNodes={JSON.parse(JSON.stringify(userNodes))}
    />
  );
}