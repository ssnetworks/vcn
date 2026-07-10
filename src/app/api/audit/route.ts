import { NextResponse } from 'next/server';
import { getAuditLogs, addAuditLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

function validateSession(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer session_')) {
    return null;
  }
  const parts = authHeader.split('_');
  if (parts.length < 2) return null;
  return parts[1];
}

export async function GET(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator access required.' },
        { status: 401 }
      );
    }

    const auditLogs = getAuditLogs();
    return NextResponse.json({ success: true, auditLogs });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
