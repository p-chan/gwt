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
  // Sanitize branch name for directory: feature/foo -> feature-foo
  // Note: Currently only replaces forward slashes. macOS/Linux compatible.
  // For Windows support, consider sanitizing: < > : " \ | ? *
  const branch = branchName.replace(/\//g, '-');

  // Get path hierarchy for ghq-like structure
  const currentDir = path.basename(gitRoot);
  const parentPath = path.dirname(gitRoot);
  const parentDir = path.basename(parentPath);
  const grandParentPath = path.dirname(parentPath);
  const grandParentDir = path.basename(grandParentPath);

  let resolved = basePath
    .replace(/\$\{CURRENT_DIR\}/g, currentDir)
    .replace(/\$\{PARENT_DIR\}/g, parentDir)
    .replace(/\$\{GRAND_PARENT_DIR\}/g, grandParentDir)
    .replace(/\$\{BRANCH\}/g, branch);

  if (resolved.startsWith('~')) {
    const home = process.env.HOME;
    if (!home) {
      throw new Error('HOME environment variable is not set');
    }
    resolved = resolved.replace(/^~/, home);
  }

  if (!path.isAbsolute(resolved)) {
    resolved = path.join(gitRoot, resolved);
  }

  // Auto-append branch name only if ${BRANCH} is not used in template
  if (!basePath.includes('${BRANCH}')) {
    resolved = path.join(resolved, branch);
  }

  return resolved;
}
