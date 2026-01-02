#!/usr/bin/env bun
import { cli, define } from 'gunshi';
import { switchCommand } from './commands/switch';
import { listCommand } from './commands/list';
import { removeCommand } from './commands/remove';
import { initCommand } from './commands/init';

const mainCommand = define({
  name: 'gwt',
  description: 'Git worktree wrapper with enhanced workflow',
  run: () => {
    console.log('Use --help to see available commands');
  },
});

await cli(process.argv.slice(2), mainCommand, {
  name: 'gwt',
  version: '0.1.0',
  subCommands: {
    init: initCommand,
    switch: switchCommand,
    list: listCommand,
    remove: removeCommand,
  },
});
