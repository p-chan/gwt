import { $ } from 'bun';
import { getConfig } from '../config/git-config';

export type HookType = 'post-switch' | 'post-create';

export interface HookContext {
  branch: string;
  path: string;
}

export async function executeHook(
  hookType: HookType,
  context: HookContext
): Promise<void> {
  const config = await getConfig();

  let hookScript: string | undefined;
  switch (hookType) {
    case 'post-switch':
      hookScript = config.hooks.postSwitch;
      break;
    case 'post-create':
      hookScript = config.hooks.postCreate;
      break;
  }

  if (!hookScript) {
    return; // Skip if hook is not configured
  }

  try {
    // Pass context to hook via environment variables
    await $`${hookScript}`.env({
      GWT_BRANCH: context.branch,
      GWT_PATH: context.path,
      GWT_HOOK_TYPE: hookType,
    }).quiet();
  } catch (error) {
    // Hook failures are warnings only - main operation continues
    console.warn(`Warning: Hook ${hookType} failed:`, error);
  }
}
