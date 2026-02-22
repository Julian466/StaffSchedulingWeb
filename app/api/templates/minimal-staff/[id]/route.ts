import { NextRequest, NextResponse } from 'next/server';
import { createTemplateRepository } from '@/lib/services/template-repository';
import { MinimalStaffRequirements } from '@/types/minimal-staff';

const minimalStaffTemplateRepo = createTemplateRepository<MinimalStaffRequirements>('minimal-staff');

/**
 * GET /api/templates/minimal-staff/[id]
 * Get a specific minimal staff template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = request.headers.get('x-case-id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const template = await minimalStaffTemplateRepo.get(parseInt(caseId, 10), id);
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error getting minimal staff template:', error);
    return NextResponse.json(
      { error: 'Failed to get minimal staff template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/minimal-staff/[id]
 * Update a minimal staff template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = request.headers.get('x-case-id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, description } = body;

    const template = await minimalStaffTemplateRepo.update(
      parseInt(caseId, 10),
      id,
      { content, description }
    );

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating minimal staff template:', error);
    return NextResponse.json(
      { error: 'Failed to update minimal staff template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/minimal-staff/[id]
 * Delete a minimal staff template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseId = request.headers.get('x-case-id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    await minimalStaffTemplateRepo.delete(parseInt(caseId, 10), id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting minimal staff template:', error);
    return NextResponse.json(
      { error: 'Failed to delete minimal staff template' },
      { status: 500 }
    );
  }
}
