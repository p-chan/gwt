import { define } from 'gunshi';
import { removeWorktree } from '../utils/git';
import { GwtError } from '../utils/error';

export const removeCommand = define({
  name: 'remove',
  description: 'Remove a worktree',
  args: {
    branch: {
      type: 'string',
      description: 'Branch name to remove',
      required: true,
    },
    force: {
      type: 'boolean',
      short: 'f',
      description: 'Force removal even if worktree has uncommitted changes',
    },
  },
  run: async (ctx) => {
    try {
      const { branch, force } = ctx.values;

      await removeWorktree(branch, force);

      console.log(`Removed worktree for branch '${branch}'`);
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
