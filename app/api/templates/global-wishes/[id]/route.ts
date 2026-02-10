import { NextRequest, NextResponse } from 'next/server';
import { globalWishesTemplateRepository } from '@/lib/services/template-repository';

/**
 * GET /api/templates/global-wishes/[id]
 * Get a specific global wishes template
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

    const template = await globalWishesTemplateRepository.get(parseInt(caseId, 10), id);
    return NextResponse.json(template);
  } catch (error) {
    console.error('Error getting global wishes template:', error);
    return NextResponse.json(
      { error: 'Failed to get global wishes template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/global-wishes/[id]
 * Update a global wishes template
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

    if (content && (!content.employees || !Array.isArray(content.employees))) {
      return NextResponse.json(
        { error: 'Content must contain an employees array' },
        { status: 400 }
      );
    }

    const template = await globalWishesTemplateRepository.update(
      parseInt(caseId, 10),
      id,
      { content, description }
    );

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating global wishes template:', error);
    return NextResponse.json(
      { error: 'Failed to update global wishes template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/global-wishes/[id]
 * Delete a global wishes template
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

    await globalWishesTemplateRepository.delete(parseInt(caseId, 10), id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting global wishes template:', error);
    return NextResponse.json(
      { error: 'Failed to delete global wishes template' },
      { status: 500 }
    );
  }
}
