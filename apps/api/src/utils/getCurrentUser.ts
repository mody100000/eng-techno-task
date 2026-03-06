import "dotenv/config";
import { env } from "prisma/config";
import { prisma } from "../lib/prisma.js";

let _cachedUser: Awaited<ReturnType<typeof prisma.user.findFirst>> | null =
  null;

const defaultUserName = env("DEFAULT_USER_NAME");

export const getCurrentUser = async () => {
  if (_cachedUser) {
    return _cachedUser;
  }

  if (!defaultUserName) {
    throw new Error(
      "DEFAULT_USER_NAME is not defined in environment variables",
    );
  }

  let user = await prisma.user.findFirst({
    where: { name: defaultUserName },
  });

  // Create default user if not exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: defaultUserName,
      },
    });
  }

  _cachedUser = user;

  return user;
};
