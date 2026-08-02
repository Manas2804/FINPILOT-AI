import { getServerSession } from "next-auth";
import { authOptions } from "./options";

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}
