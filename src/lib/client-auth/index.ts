import { db } from '@/db';
import { clientTokens, projects } from '@/db/schema';
import { eq, and, gt, isNull } from 'drizzle-orm';

export const CLIENT_TOKEN_COOKIE = 'client_access_token';
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

/** Generate a cryptographically random 64-char token and persist it */
export async function createClientToken(projectId: string, orderId: number): Promise<string> {
  const token = `${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const expiresAt = new Date(Date.now() + NINETY_DAYS_MS);
  await db.insert(clientTokens).values({ project_id: projectId, order_id: orderId, token, expires_at: expiresAt });
  return token;
}

/** Validate a token: returns projectId if valid, null if expired/invalid/revoked */
export async function validateClientToken(token: string): Promise<string | null> {
  if (!token || token.length < 32) return null;
  const rows = await db
    .select({ projectId: clientTokens.project_id, id: clientTokens.id })
    .from(clientTokens)
    .where(and(
      eq(clientTokens.token, token),
      gt(clientTokens.expires_at, new Date()),
      isNull(clientTokens.revoked_at),
    ))
    .limit(1);

  if (!rows.length) return null;

  // Update last_accessed_at (fire and forget)
  db.update(clientTokens)
    .set({ last_accessed_at: new Date() })
    .where(eq(clientTokens.id, rows[0].id))
    .catch(() => {});

  return rows[0].projectId;
}
