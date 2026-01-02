export const CONFIG_KEYS = {
  WORKTREE_PATH: 'gwt.worktreePath',
  HOOK_POST_SWITCH: 'gwt.hook.post-switch',
  HOOK_POST_CREATE: 'gwt.hook.post-create',
} as const;

export const DEFAULT_CONFIG = {
  worktreePath: '${GIT_ROOT}/.worktrees',
} as const;
