import { NextRequest, NextResponse } from 'next/server';
import { createTemplateRepository } from '@/lib/services/template-repository';
import { Weights } from '@/types/weights';

const weightsTemplateRepo = createTemplateRepository<Weights>('weights');

/**
 * GET /api/templates/weights
 * List all weight templates for the current case
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

    const templates = await weightsTemplateRepo.list(parseInt(caseId, 10));
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error listing weight templates:', error);
    return NextResponse.json(
      { error: 'Failed to list weight templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/weights
 * Create a new weight template
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

    const template = await weightsTemplateRepo.create(
      parseInt(caseId, 10),
      content,
      description
    );

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating weight template:', error);
    return NextResponse.json(
      { error: 'Failed to create weight template' },
      { status: 500 }
    );
  }
}
