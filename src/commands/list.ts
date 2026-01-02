import { define } from 'gunshi';
import { getWorktrees } from '../utils/git';
import { GwtError } from '../utils/error';

export const listCommand = define({
  name: 'list',
  description: 'List all worktrees',
  args: {
    verbose: {
      type: 'boolean',
      short: 'v',
      description: 'Show detailed information',
    },
  },
  run: async (ctx) => {
    try {
      const { verbose } = ctx.values;
      const worktrees = await getWorktrees();

      for (const wt of worktrees) {
        if (verbose) {
          console.log(`${wt.branch}\t${wt.path}\t${wt.commit}`);
        } else {
          console.log(wt.branch);
        }
      }
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
