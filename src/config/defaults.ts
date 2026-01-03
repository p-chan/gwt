export const CONFIG_KEYS = {
  WORKTREE_PATH: 'gwt.worktree-path',
  HOOK_POST_SWITCH: 'gwt.hook.post-switch',
  HOOK_POST_CREATE: 'gwt.hook.post-create',
} as const;

export const DEFAULT_CONFIG = {
  worktreePath: '~/gwt/${CURRENT_DIR}/${BRANCH}',
} as const;
