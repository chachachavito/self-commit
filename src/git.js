import { simpleGit } from 'simple-git';

const git = simpleGit();

const SENSITIVE_PATTERNS = [
  '.env',
  '*.pem',
  '*.key',
  '*.pub',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

export async function getStagedData() {
  const files = await git.diff(['--cached', '--name-only']);
  const fileList = files.trim().split('\n').filter(Boolean);

  if (fileList.length === 0) {
    throw new Error('No staged changes found. Use "git add" to stage changes first.');
  }

  // Filter out sensitive files from the diff analysis
  const filteredFiles = fileList.filter((file) => {
    return !SENSITIVE_PATTERNS.some((pattern) => {
      if (pattern.startsWith('*.')) {
        return file.endsWith(pattern.slice(1));
      }
      return file.includes(pattern);
    });
  });

  if (filteredFiles.length === 0 && fileList.length > 0) {
    throw new Error(
      'All staged changes are in sensitive files and will not be sent to AI for security reasons.'
    );
  }

  const diff = await git.diff(['--cached', '--', ...filteredFiles]);

  return { diff, fileList: filteredFiles };
}

export async function commit(message) {
  return await git.commit(message);
}
