import { NextRequest, NextResponse } from 'next/server';
import { globalWishesTemplateRepository } from '@/lib/services/template-repository';

/**
 * GET /api/templates/global-wishes
 * List all global wishes templates for the current case
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

    const templates = await globalWishesTemplateRepository.list(parseInt(caseId, 10));
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error listing global wishes templates:', error);
    return NextResponse.json(
      { error: 'Failed to list global wishes templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/global-wishes
 * Create a new global wishes template
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

    if (!content.employees || !Array.isArray(content.employees)) {
      return NextResponse.json(
        { error: 'Content must contain an employees array' },
        { status: 400 }
      );
    }

    const template = await globalWishesTemplateRepository.create(
      parseInt(caseId, 10),
      content,
      description
    );

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating global wishes template:', error);
    return NextResponse.json(
      { error: 'Failed to create global wishes template' },
      { status: 500 }
    );
  }
}
