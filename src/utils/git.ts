import { $ } from 'bun';
import { existsSync } from 'fs';
import type { GwtConfig, Worktree } from '../types/index';
import { GwtError, ErrorCode } from './error';
import { resolveWorktreePath } from './path';

function parseWorktreeList(output: string): Worktree[] {
  const worktrees: Worktree[] = [];
  const lines = output.split('\n');

  let currentWorktree: Partial<Worktree> = {};

  for (const line of lines) {
    if (line.startsWith('worktree ')) {
      currentWorktree.path = line.substring('worktree '.length);
    } else if (line.startsWith('HEAD ')) {
      currentWorktree.commit = line.substring('HEAD '.length);
    } else if (line.startsWith('branch ')) {
      const branchRef = line.substring('branch '.length);
      // refs/heads/feature/foo -> feature/foo
      currentWorktree.branch = branchRef.replace('refs/heads/', '');
    } else if (line.startsWith('locked')) {
      currentWorktree.locked = true;
    } else if (line === '') {
      // Empty line marks the end of a worktree entry
      if (currentWorktree.path) {
        worktrees.push({
          path: currentWorktree.path,
          branch: currentWorktree.branch || '',
          commit: currentWorktree.commit || '',
          locked: currentWorktree.locked || false,
        });
      }
      currentWorktree = {};
    }
  }

  // Add the last worktree if exists
  if (currentWorktree.path) {
    worktrees.push({
      path: currentWorktree.path,
      branch: currentWorktree.branch || '',
      commit: currentWorktree.commit || '',
      locked: currentWorktree.locked || false,
    });
  }

  return worktrees;
}

export async function getWorktrees(): Promise<Worktree[]> {
  try {
    const output = await $`git worktree list --porcelain`.text();
    return parseWorktreeList(output);
  } catch (error) {
    throw new GwtError(
      'Failed to list worktrees. Are you in a git repository?',
      ErrorCode.NOT_A_GIT_REPO,
      error
    );
  }
}

export async function getWorktreePath(branch: string): Promise<string> {
  const worktrees = await getWorktrees();
  const wt = worktrees.find((w) => w.branch === branch);

  if (!wt) {
    throw new GwtError(
      `Worktree for branch '${branch}' not found`,
      ErrorCode.WORKTREE_NOT_FOUND
    );
  }

  return wt.path;
}

export async function createWorktree(
  branch: string,
  config: GwtConfig
): Promise<string> {
  const worktreePath = await resolveWorktreePath(config.worktreePath, branch);

  if (existsSync(worktreePath)) {
    throw new GwtError(
      `Worktree already exists at: ${worktreePath}`,
      ErrorCode.WORKTREE_EXISTS
    );
  }

  try {
    await $`git worktree add ${worktreePath} -b ${branch}`.quiet();
    return worktreePath;
  } catch (error) {
    throw new GwtError(
      `Failed to create worktree: ${error}`,
      ErrorCode.WORKTREE_EXISTS,
      error
    );
  }
}

export async function removeWorktree(
  branch: string,
  force: boolean = false
): Promise<void> {
  const worktreePath = await getWorktreePath(branch);

  try {
    if (force) {
      await $`git worktree remove ${worktreePath} --force`.quiet();
    } else {
      await $`git worktree remove ${worktreePath}`.quiet();
    }
  } catch (error) {
    throw new GwtError(
      `Failed to remove worktree: ${error}`,
      ErrorCode.WORKTREE_NOT_FOUND,
      error
    );
  }
}
