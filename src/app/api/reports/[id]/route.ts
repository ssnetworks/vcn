import { NextResponse } from 'next/server';
import { updateReport, getReportById, deleteReport, addAuditLog } from '@/lib/db';

function validateSession(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer session_')) {
    return null;
  }
  const parts = authHeader.split('_');
  if (parts.length < 2) return null;
  return parts[1];
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, investigator, notes, priority } = body;

    const existingReport = getReportById(id);
    if (!existingReport) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Build changes text for audit log
    const changes: string[] = [];
    if (status && status !== existingReport.status) {
      changes.push(`status from "${existingReport.status}" to "${status}"`);
    }
    if (investigator !== undefined && investigator !== existingReport.investigator) {
      changes.push(`investigator from "${existingReport.investigator || 'Unassigned'}" to "${investigator || 'Unassigned'}"`);
    }
    if (notes !== undefined && notes !== existingReport.notes) {
      changes.push(`updated resolution/investigation notes`);
    }
    if (priority && priority !== existingReport.priority) {
      changes.push(`priority from "${existingReport.priority}" to "${priority}"`);
    }

    const updated = updateReport(id, {
      ...(status && { status }),
      ...(investigator !== undefined && { investigator }),
      ...(notes !== undefined && { notes }),
      ...(priority && { priority }),
    });

    if (changes.length > 0) {
      addAuditLog(`Updated case ${id}: ${changes.join(', ')}`, adminUser);
    }

    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error(`Update report API error for ID:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existingReport = getReportById(id);
    if (!existingReport) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const deleted = deleteReport(id);
    if (deleted) {
      addAuditLog(`Deleted case file ${id}`, adminUser);
      return NextResponse.json({ success: true, message: 'Case deleted successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete case from registry' },
      { status: 500 }
    );
  } catch (error) {
    console.error(`Delete report API error for ID:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
