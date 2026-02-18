import { NextRequest, NextResponse } from 'next/server';
import { createTemplateRepository } from '@/lib/services/template-repository';
import { MinimalStaffRequirements } from '@/types/minimal-staff';

const minimalStaffTemplateRepo = createTemplateRepository<MinimalStaffRequirements>('minimal-staff');

/**
 * GET /api/templates/minimal-staff
 * List all minimal staff templates for the current case
 */
export async function GET(request: NextRequest) {
  try {
    const caseId = request.headers.get('x-case-id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const templates = await minimalStaffTemplateRepo.list(parseInt(caseId, 10));
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error listing minimal staff templates:', error);
    return NextResponse.json(
      { error: 'Failed to list minimal staff templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/minimal-staff
 * Create a new minimal staff template
 */
export async function POST(request: NextRequest) {
  try {
    const caseId = request.headers.get('x-case-id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, description } = body;

    if (!content || !description) {
      return NextResponse.json(
        { error: 'Content and description are required' },
        { status: 400 }
      );
    }

    const template = await minimalStaffTemplateRepo.create(
      parseInt(caseId, 10),
      content,
      description
    );

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating minimal staff template:', error);
    return NextResponse.json(
      { error: 'Failed to create minimal staff template' },
      { status: 500 }
    );
  }
}
