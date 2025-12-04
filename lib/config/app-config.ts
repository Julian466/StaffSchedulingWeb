import { join } from 'path';
import { readFileSync } from 'fs';

/**
 * Application configuration structure.
 */
interface AppConfig {
  /**
   * Path to the cases directory.
   * Can be absolute or relative to the project root.
   * If relative, it will be resolved from process.cwd().
   * 
   * @example "/absolute/path/to/cases"
   * @example "/cases" (relative to project root)
   * @example "data/cases" (relative to project root)
   */
  casesDirectory: string;
}

/**
 * Loads the application configuration from config.json.
 * @returns The application configuration
 * @throws Error if config.json cannot be read or parsed
 */
function loadConfig(): AppConfig {
  const configPath = join(process.cwd(), 'config.json');
  try {
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent) as AppConfig;
    return config;
  } catch (error) {
    throw new Error(
      `Failed to load config.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Gets the absolute path to the cases directory.
 * Resolves relative paths from the project root (process.cwd()).
 * 
 * @returns Absolute path to the cases directory
 * 
 * @example
 * // With config.json: { "casesDirectory": "/cases" }
 * getCasesDirectory(); // Returns "/path/to/project/cases"
 * 
 * @example
 * // With config.json: { "casesDirectory": "/absolute/path/to/cases" }
 * getCasesDirectory(); // Returns "/absolute/path/to/cases"
 */
export function getCasesDirectory(): string {
  const config = loadConfig();
  const casesDir = config.casesDirectory;
  
  // If path starts with / or \ but is only one character followed by a letter,
  // it's likely a relative path like "/cases" not an absolute path like "C:\cases"
  if (casesDir.startsWith('/') || casesDir.startsWith('\\')) {
    // Check if it's truly absolute (Windows: starts with drive letter, Unix: starts with /)
    // On Windows, absolute paths typically look like C:\ or \\server\share
    // On Unix, absolute paths start with /
    const isWindowsAbsolute = /^[a-zA-Z]:[/\\]/.test(casesDir);
    const isUncPath = /^[/\\]{2}/.test(casesDir);
    const isUnixAbsolute = casesDir.startsWith('/') && process.platform !== 'win32';
    
    if (isWindowsAbsolute || isUncPath || isUnixAbsolute) {
      return casesDir;
    }
  }
  
  // Treat as relative path
  return join(process.cwd(), casesDir);
}
