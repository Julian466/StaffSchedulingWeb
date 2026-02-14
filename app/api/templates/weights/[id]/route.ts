import { NextRequest, NextResponse } from 'next/server';
import { createTemplateRepository } from '@/lib/services/template-repository';
import { Weights } from '@/types/weights';

const weightsTemplateRepo = createTemplateRepository<Weights>('weights');

/**
 * GET /api/templates/weights/[id]
 * Get a specific weight template
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

    const template = await weightsTemplateRepo.get(parseInt(caseId, 10), id);
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error getting weight template:', error);
    return NextResponse.json(
      { error: 'Failed to get weight template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/weights/[id]
 * Update a weight template
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

    const template = await weightsTemplateRepo.update(
      parseInt(caseId, 10),
      id,
      { content, description }
    );

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating weight template:', error);
    return NextResponse.json(
      { error: 'Failed to update weight template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/weights/[id]
 * Delete a weight template
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

    await weightsTemplateRepo.delete(parseInt(caseId, 10), id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting weight template:', error);
    return NextResponse.json(
      { error: 'Failed to delete weight template' },
      { status: 500 }
    );
  }
}
