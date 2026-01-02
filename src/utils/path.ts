import { $ } from 'bun';
import path from 'path';

export async function getGitRoot(): Promise<string> {
  const result = await $`git rev-parse --show-toplevel`.text();
  return result.trim();
}

export async function resolveWorktreePath(
  basePath: string,
  branchName: string
): Promise<string> {
  const gitRoot = await getGitRoot();
  const repoName = path.basename(gitRoot);

  let resolved = basePath
    .replace('${GIT_ROOT}', gitRoot)
    .replace('${REPO_NAME}', repoName)
    .replace('${HOME}', process.env.HOME || '~');

  // Sanitize branch name for directory: feature/foo -> feature-foo
  const sanitizedBranch = branchName.replace(/\//g, '-');

  return path.join(resolved, sanitizedBranch);
}
