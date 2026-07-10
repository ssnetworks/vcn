import { NextResponse } from 'next/server';
import { updateInquiryStatus, deleteInquiry, addAuditLog } from '@/lib/db';

function validateSession(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer session_')) {
    return null;
  }
  const parts = authHeader.split('_');
  if (parts.length < 2) return null;
  return parts[1];
}

// PATCH: Update inquiry status (Admin Only)
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
    const { status } = body;

    if (!status || !['Unread', 'Reviewed', 'Archived'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status (Unread, Reviewed, Archived) is required.' },
        { status: 400 }
      );
    }

    const updated = updateInquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    addAuditLog(`Updated contact inquiry ${id} status to ${status}`, adminUser);

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error('Update inquiry status API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Permanent deletion of inquiries (Admin Only)
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
    const deleted = deleteInquiry(id);

    if (deleted) {
      addAuditLog(`Deleted contact inquiry entry ${id}`, adminUser);
      return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Inquiry not found in VCN secure nodes.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Delete inquiry API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
