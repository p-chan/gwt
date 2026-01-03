import { $ } from 'bun';
import type { GwtConfig } from '../types/index';
import { CONFIG_KEYS, DEFAULT_CONFIG } from './defaults';

async function getConfigValue(key: string): Promise<string | null> {
  try {
    const result = await $`git config --get ${key}`.text();
    return result.trim() || null;
  } catch {
    return null;
  }
}

export async function getConfig(): Promise<GwtConfig> {
  const worktreePathTemplate =
    (await getConfigValue(CONFIG_KEYS.WORKTREE_PATH)) ??
    DEFAULT_CONFIG.worktreePath;

  return {
    worktreePath: worktreePathTemplate,
    hooks: {
      postSwitch: (await getConfigValue(CONFIG_KEYS.HOOK_POST_SWITCH)) ?? undefined,
      postCreate: (await getConfigValue(CONFIG_KEYS.HOOK_POST_CREATE)) ?? undefined,
    },
  };
}
