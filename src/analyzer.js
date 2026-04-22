import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getExternalContext(command) {
  if (!command) return null;

  try {
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    console.warn(`\n⚠️  External context command failed: ${error.message}`);
    return null;
  }
}
