/**
 * API endpoint to get workflow environment variables
 * This allows the client to detect if the server was started in workflow mode
 */
import { NextResponse } from 'next/server';

export async function GET() {
  const workflowMode = process.env.WORKFLOW_MODE === 'true';
  
  if (!workflowMode) {
    return NextResponse.json({
      isWorkflowMode: false
    });
  }

  return NextResponse.json({
    isWorkflowMode: true,
    caseId: process.env.WORKFLOW_CASE || null,
    startDate: process.env.WORKFLOW_START || null,
    endDate: process.env.WORKFLOW_END || null
  });
}
