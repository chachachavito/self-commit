import { spawn } from 'child_process';

/**
 * Executes an external command safely using spawn to avoid command injection.
 * @param {string} commandStr The full command string from config
 * @returns {Promise<string|null>}
 */
export async function getExternalContext(commandStr) {
  if (!commandStr) return null;

  const [cmd, ...args] = commandStr.split(' ');

  return new Promise((resolve) => {
    const process = spawn(cmd, args, { shell: false });
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data;
    });

    process.stderr.on('data', (data) => {
      stderr += data;
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.warn(`\n⚠️  External context command failed (exit code ${code}): ${stderr}`);
        resolve(null);
      } else {
        resolve(stdout.trim());
      }
    });

    process.on('error', (err) => {
      console.warn(`\n⚠️  Failed to start external context command: ${err.message}`);
      resolve(null);
    });
  });
}
