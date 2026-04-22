import { simpleGit } from 'simple-git';

const git = simpleGit();

export async function getStagedData() {
  const diff = await git.diff(['--cached']);
  if (!diff) {
    throw new Error('No staged changes found. Use "git add" to stage changes first.');
  }

  const files = await git.diff(['--cached', '--name-only']);
  const fileList = files.trim().split('\n').filter(Boolean);

  return { diff, fileList };
}

export async function commit(message) {
  return await git.commit(message);
}
