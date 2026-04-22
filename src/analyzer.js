import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getExternalContext(command) {
  if (!command) return null;

  // Basic command injection protection
  const dangerousChars = /[;&|`$<>]/;
  if (dangerousChars.test(command)) {
    throw new Error(
      `Security violation: External command contains dangerous characters and was blocked: ${command}`
    );
  }

  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    console.warn(`\n⚠️  External context command failed: ${error.message}`);
    return null;
  }
}
