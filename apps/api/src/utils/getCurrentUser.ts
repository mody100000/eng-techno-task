import "dotenv/config";
import { env } from "prisma/config";
import { prisma } from "../lib/prisma.js";

let _cachedUser: Awaited<ReturnType<typeof prisma.user.findFirst>>;
const defaultUserName = env("DEFAULT_USER_NAME");

export const getCurrentUser = async (): Promise<Awaited<
  ReturnType<typeof prisma.user.findFirst>
> | null> => {
  if (_cachedUser) {
    return _cachedUser;
  }

  if (!defaultUserName) {
    throw new Error(
      "DEFAULT_USER_NAME is not defined in environment variables",
    );
  }
  const user = await prisma.user.findFirst({
    where: { name: defaultUserName },
  });
  _cachedUser = user;
  return user;
};
