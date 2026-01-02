import { define } from 'gunshi';
import { getConfig } from '../config/git-config';
import { executeHook } from '../hooks/executor';
import { createWorktree, getWorktreePath } from '../utils/git';
import { GwtError } from '../utils/error';

export const switchCommand = define({
  name: 'switch',
  description: 'Switch to a worktree',
  args: {
    branch: {
      type: 'string',
      description: 'Branch name to switch to',
      required: true,
    },
    create: {
      type: 'boolean',
      short: 'c',
      description: 'Create new branch and worktree',
    },
  },
  run: async (ctx) => {
    try {
      const { branch, create } = ctx.values;
      const config = await getConfig();
      let worktreePath: string;

      if (create) {
        worktreePath = await createWorktree(branch, config);
        await executeHook('post-create', { branch, path: worktreePath });
      } else {
        worktreePath = await getWorktreePath(branch);
      }

      // Output only the path to stdout for shell function to cd into
      console.log(worktreePath);

      await executeHook('post-switch', { branch, path: worktreePath });
    } catch (error) {
      if (error instanceof GwtError) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${error}`);
      }
      process.exit(1);
    }
  },
});
