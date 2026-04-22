import { simpleGit } from 'simple-git';

const git = simpleGit();

export async function getStagedDiff() {
  const diff = await git.diff(['--cached']);
  if (!diff) {
    throw new Error('No staged changes found. Use "git add" to stage changes first.');
  }
  return diff;
}

export async function commit(message) {
  return await git.commit(message);
}
