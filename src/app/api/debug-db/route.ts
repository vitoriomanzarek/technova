import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';

// Endpoint temporal de diagnóstico — borrar después de confirmar el fix.
export async function GET() {
  try {
    const url = process.env.DATABASE_URL ?? 'NOT SET';
    const host = url.match(/@([^/?]+)/)?.[1] ?? 'unknown';
    const rows = await db.select().from(leads);
    return NextResponse.json({ host, leadCount: rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
