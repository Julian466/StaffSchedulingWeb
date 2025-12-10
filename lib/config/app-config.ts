import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

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
 * Loads the application configuration.
 * First tries to load config.json, falls back to config.template.json if not found.
 * @returns The application configuration
 * @throws Error if neither config file can be read or parsed
 */
function loadConfig(): AppConfig {
  const configPath = join(process.cwd(), 'config.json');
  const templatePath = join(process.cwd(), 'config.template.json');
  
  let pathToUse = configPath;
  
  // Check if config.json exists, otherwise use template
  if (!existsSync(configPath)) {
    pathToUse = templatePath;
  }
  
  try {
    const configContent = readFileSync(pathToUse, 'utf-8');
    const config = JSON.parse(configContent) as AppConfig;
    return config;
  } catch (error) {
    throw new Error(
      `Failed to load config file (${pathToUse}): ${error instanceof Error ? error.message : String(error)}`
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
 * // With config.json (or config.template.json): { "casesDirectory": "/cases" }
 * getCasesDirectory(); // Returns "/path/to/project/cases"
 * 
 * @example
 * // With config.json (or config.template.json): { "casesDirectory": "/absolute/path/to/cases" }
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
