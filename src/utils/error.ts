export class GwtError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GwtError';
  }
}

export enum ErrorCode {
  // Git-related errors
  NOT_A_GIT_REPO = 'NOT_A_GIT_REPO',
  WORKTREE_EXISTS = 'WORKTREE_EXISTS',
  WORKTREE_NOT_FOUND = 'WORKTREE_NOT_FOUND',
  BRANCH_NOT_FOUND = 'BRANCH_NOT_FOUND',

  // Configuration errors
  INVALID_CONFIG = 'INVALID_CONFIG',

  // Filesystem errors
  PATH_NOT_ACCESSIBLE = 'PATH_NOT_ACCESSIBLE',

  // Hook errors
  HOOK_EXECUTION_FAILED = 'HOOK_EXECUTION_FAILED',
}
