import { NextResponse } from 'next/server';
import { getReportById } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const report = getReportById(id.trim());

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Case ID not found in VCN registry' },
        { status: 404 }
      );
    }

    // Safety: Return ONLY sanitized, non-identifying status fields.
    // Never leak name, email, phone, location (state/country), or narration text.
    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        category: report.category,
        status: report.status,
        dateOfIncident: report.dateOfIncident,
        notes: report.notes || 'No operational update recorded yet. Investigation pending.',
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error('Fetch public status API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
