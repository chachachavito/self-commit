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

const SECRET_DETECTION_RULES = [
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/ },
  { name: 'Generic API Key', regex: /api[_-]?key[:=]\s*['"][a-zA-Z0-9]{16,}['"]/i },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'GitHub Token', regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'Private Key', regex: /-----BEGIN [A-Z ]+ PRIVATE KEY-----/ },
];

export function scanForSecrets(content) {
  for (const rule of SECRET_DETECTION_RULES) {
    if (rule.regex.test(content)) {
      return rule.name;
    }
  }
  return null;
}

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

  // Content-based secret scanning
  const detectedSecret = scanForSecrets(diff);
  if (detectedSecret) {
    throw new Error(
      `SECURITY ALERT: Potential ${detectedSecret} detected in diff. AI analysis aborted to prevent data leak.`
    );
  }

  return { diff, fileList: filteredFiles };
}

export async function commit(message) {
  return await git.commit(message);
}
