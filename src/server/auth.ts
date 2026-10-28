import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/server/db";

const globalForUserCache = globalThis as typeof globalThis & {
  clerkDatabaseUserIds?: Map<string, string>;
  clerkDatabaseUserIdLookups?: Map<string, Promise<string>>;
};
const clerkDatabaseUserIds =
  globalForUserCache.clerkDatabaseUserIds ??= new Map<string, string>();
const clerkDatabaseUserIdLookups =
  globalForUserCache.clerkDatabaseUserIdLookups ??= new Map<string, Promise<string>>();

/** Ensure the Clerk user is represented locally and return the actual database ID. */
export async function getDatabaseUserId(clerkUserId: string) {
  const cachedId = clerkDatabaseUserIds.get(clerkUserId);
  if (cachedId) return cachedId;

  const pendingLookup = clerkDatabaseUserIdLookups.get(clerkUserId);
  if (pendingLookup) return pendingLookup;

  const lookup = resolveDatabaseUserId(clerkUserId);
  clerkDatabaseUserIdLookups.set(clerkUserId, lookup);
  try {
    return await lookup;
  } finally {
    clerkDatabaseUserIdLookups.delete(clerkUserId);
  }
}

async function resolveDatabaseUserId(clerkUserId: string) {
  const cachedId = clerkDatabaseUserIds.get(clerkUserId);
  if (cachedId) return cachedId;

  const existingUser = await db.user.findUnique({
    where: { id: clerkUserId },
    select: { id: true },
  });
  if (existingUser) {
    clerkDatabaseUserIds.set(clerkUserId, existingUser.id);
    return existingUser.id;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);
  const emailAddress =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!emailAddress) {
    throw new Error("Your account needs an email address to use this application.");
  }

  const user = await db.user.upsert({
    where: { emailAddress },
    update: {
      imageUrl: clerkUser.imageUrl,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
    create: {
      id: clerkUserId,
      emailAddress,
      imageUrl: clerkUser.imageUrl,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    },
    select: { id: true },
  });

  clerkDatabaseUserIds.set(clerkUserId, user.id);
  return user.id;
}
