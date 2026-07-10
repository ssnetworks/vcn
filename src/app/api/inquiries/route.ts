import { NextResponse } from 'next/server';
import { getInquiries, addInquiry, addAuditLog } from '@/lib/db';

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

// GET: Retrieve all contact inquiries (Admin Only)
export async function GET(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator access required.' },
        { status: 401 }
      );
    }

    const inquiries = getInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error('Fetch inquiries API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST: Submit a general contact inquiry (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields (Name, Email, Subject, Message) are required.' },
        { status: 400 }
      );
    }

    const newInq = addInquiry({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    addAuditLog(`Received contact inquiry: "${subject.trim()}" from ${email.trim()}`, 'SYSTEM');

    return NextResponse.json({ success: true, inquiry: newInq });
  } catch (error) {
    console.error('Create inquiry API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
