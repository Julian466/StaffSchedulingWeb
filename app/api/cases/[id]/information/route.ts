import { NextResponse } from 'next/server';
import { getCaseInformationDb } from '@/lib/data/case/db-case';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = parseInt(id);
    
    if (isNaN(caseId)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 });
    }

    const db = await getCaseInformationDb(caseId);
    await db.read();

    return NextResponse.json({ information: db.data.information });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get case information' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = parseInt(id);
    
    if (isNaN(caseId)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 });
    }

    const body = await request.json();
    const { month, year } = body;

    if (!month || !year || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month or year' }, { status: 400 });
    }

    const db = await getCaseInformationDb(caseId);
    await db.read();

    db.data.information = {
      ...db.data.information,
      month,
      year,
      updatedAt: new Date().toISOString(),
    };

    await db.write();

    return NextResponse.json({ information: db.data.information });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update case information' }, { status: 500 });
  }
}
