import { NextResponse } from 'next/server';
import { getReports, addReport, addAuditLog } from '@/lib/db';

// Helper to validate session
function validateSession(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer session_')) {
    return null;
  }
  const parts = authHeader.split('_');
  if (parts.length < 2) return null;
  return parts[1]; // returns username
}

// GET /api/reports - Fetch all reports (Admin only)
export async function GET(request: Request) {
  try {
    const adminUser = validateSession(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator access required.' },
        { status: 401 }
      );
    }

    const reports = getReports();
    
    // Log report list access
    addAuditLog('Accessed reports list dashboard', adminUser);

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('Fetch reports API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Submit a new report (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      isAnonymous,
      email,
      phone,
      country,
      state,
      category,
      dateOfIncident,
      socialMediaPlatform,
      description,
      evidenceFile, // base64 payload or object
      priority,
      consent,
      captchaAnswer,
      captchaExpected,
    } = body;

    // 1. Basic validation
    if (!country || !state || !category || !description || consent !== true) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing or consent was not granted.' },
        { status: 400 }
      );
    }

    // 2. CAPTCHA validation
    if (captchaAnswer !== captchaExpected) {
      return NextResponse.json(
        { success: false, error: 'Security CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // 3. Process Evidence upload
    let evidenceUrl = '';
    if (evidenceFile) {
      // Store the base64 string directly so it can be retrieved and downloaded
      evidenceUrl = evidenceFile;
    }

    // 4. Create the report in our DB
    const newReport = addReport({
      name: isAnonymous ? undefined : name,
      isAnonymous: !!isAnonymous,
      email: isAnonymous ? undefined : email,
      phone: isAnonymous ? undefined : phone,
      country,
      state,
      category,
      dateOfIncident,
      socialMediaPlatform,
      description,
      evidenceUrl,
      priority: priority || 'Medium',
      consent: !!consent,
    });

    // 5. Simulate Email Notification sending
    const notificationMessage = `
[EMAIL NOTIFICATION SENT]
To: alerts@secure-vcn.org, coordinator@secure-vcn.org
Subject: [VCN Case Alert] New Priority ${newReport.priority} Incident Submitted
---
A new case (ID: ${newReport.id}) has been submitted under category "${newReport.category}".
Location: ${newReport.state}, ${newReport.country}
Priority Level: ${newReport.priority}
Anonymity: ${newReport.isAnonymous ? 'ANONYMOUS' : 'DISCLOSED'}
Time of submission: ${newReport.createdAt}

Please log into the VCN Admin Command Center to review this case.
    `;
    console.log(notificationMessage);

    // Write system audit log for the submission
    addAuditLog(`New case submitted successfully (ID: ${newReport.id}, Priority: ${newReport.priority})`, 'SYSTEM');

    return NextResponse.json({
      success: true,
      message: 'Your case has been securely submitted. VCN has received the details.',
      reportId: newReport.id,
    });
  } catch (error) {
    console.error('Submit report API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
