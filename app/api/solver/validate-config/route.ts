import { NextRequest, NextResponse } from 'next/server';
import { validatePythonConfig } from '@/lib/config/app-config';
import { createApiLogger } from '@/lib/logging/logger';
import { testPythonConfiguration } from '@/lib/services/python-cli-service';

const apiLogger = createApiLogger('/api/solver/validate-config');

/**
 * GET /api/solver/validate-config
 * Validates the Python solver configuration and tests connectivity.
 * 
 * @returns Validation result with status and error/warning messages
 */
export async function GET(request: NextRequest) {
  try {
    apiLogger.info('Validating Python configuration');

    // Validate configuration
    const configValidation = validatePythonConfig();

    // If config is valid and enabled, test actual Python execution
    let executionTest = null;
    if (configValidation.isValid && configValidation.isEnabled) {
      executionTest = testPythonConfiguration();
    }

    const response = {
      ...configValidation,
      executionTest,
    };

    apiLogger.info('Configuration validation completed', {
      isValid: configValidation.isValid,
      isEnabled: configValidation.isEnabled,
      hasErrors: configValidation.errors.length > 0,
      executionTestSuccess: executionTest?.success,
    });

    return NextResponse.json(response);
  } catch (error) {
    apiLogger.error('Error validating configuration', { error });
    return NextResponse.json(
      {
        error: 'Failed to validate configuration',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
