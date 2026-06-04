import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateClientToken } from '@/lib/client-auth';
import { CLIENT_TOKEN_COOKIE } from '@/lib/client-auth/constants';
import { db } from '@/db';
import { projects, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Accept token from cookie OR Authorization header
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CLIENT_TOKEN_COOKIE)?.value;
  const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
  const token = cookieToken ?? headerToken;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = await validateClientToken(token);
  if (!projectId) {
    return NextResponse.json({ error: 'Token invalid or expired' }, { status: 401 });
  }

  const rows = await db
    .select({ project: projects, proposal: proposals })
    .from(projects)
    .leftJoin(proposals, eq(projects.proposal_id, proposals.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!rows.length) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { project, proposal } = rows[0];
  const calendlyUrl = process.env.CALENDLY_URL ?? 'https://calendly.com/technova/kickoff';

  return NextResponse.json({
    project: {
      id: project.id,
      empresa: project.empresa,
      email_cliente: project.email_cliente,
      modules: project.modules_json,
      status: project.status,
      payment_status: project.payment_status,
      kickoff_date: project.kickoff_date,
      estimated_completion: project.estimated_completion,
      second_payment_due: project.second_payment_due,
      total_amount_mxn: Math.round(project.total_amount / 100),
      timeline_dias: proposal?.timeline_dias ?? 0,
    },
    resources: {
      repository_url: project.repository_url,
      figma_url: project.figma_url,
      assets_url: project.assets_url,
      documentation_url: project.documentation_url,
      contract_url: `/api/checkout/${project.proposal_id}/contract`,
    },
    calendly_url: calendlyUrl,
  });
}
