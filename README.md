# gwt - Git Worktree Wrapper

[日本語版 README はこちら](./README_ja.md)

A git worktree wrapper CLI tool that runs on Bun.

## Key Features

- **Subcommands**: `switch`, `list`, `remove`
- **Switch functionality**: Switch between worktrees (create new ones with `-c/--create`)
- **Configuration management**: Configurable via git config (`[gwt]` section)
- **Hook support**: `post-switch`, `post-create`
- **Directory navigation**: Achieves cd functionality via shell functions

## Installation

```bash
bun install
bun run build
```

## Setup

To enable shell integration, add the following to your configuration file (**only once**):

### Bash

Add to `~/.bashrc`:

```bash
eval "$(gwt init bash)"
```

### Zsh

Add to `~/.zshrc`:

```bash
eval "$(gwt init zsh)"
```

### Fish

Add to `~/.config/fish/config.fish`:

```fish
gwt init fish | source
```

After configuration, restart your shell or run `source ~/.bashrc` (or `~/.zshrc`).

## Usage

### Switch worktree

```bash
gwt switch feature-branch
```

### Create and switch to a new worktree

```bash
gwt switch -c new-feature
```

### List worktrees

```bash
gwt list
```

Verbose output:

```bash
gwt list -v
```

### Remove worktree

```bash
gwt remove feature-branch
```

Force removal:

```bash
gwt remove -f feature-branch
```

## Configuration

### Change worktree location

By default, worktrees are placed in `${GIT_ROOT}/.worktrees`.

```bash
git config gwt.worktreePath '~/.local/share/gwt/${REPO_NAME}'
```

### Configure hooks

#### post-switch

Hook executed after switching worktrees:

```bash
git config gwt.hook.post-switch ~/.config/gwt/hooks/post-switch.sh
```

#### post-create

Hook executed after creating a new worktree:

```bash
git config gwt.hook.post-create ~/.config/gwt/hooks/post-create.sh
```

### Hook script example

`~/.config/gwt/hooks/post-switch.sh`:

```bash
#!/bin/bash

# Automatically run npm install after switching worktrees
if [ -f "$GWT_PATH/package.json" ]; then
  cd "$GWT_PATH" && npm install
fi
```

Grant execution permission:

```bash
chmod +x ~/.config/gwt/hooks/post-switch.sh
```

### Environment variables passed to hooks

- `GWT_BRANCH`: Branch name
- `GWT_PATH`: Worktree path
- `GWT_HOOK_TYPE`: Hook type (post-switch, post-create)

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **CLI Framework**: gunshi (declarative, type-safe modern CLI library)
- **Shell command execution**: Bun's `$` operator

## License

MIT
