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

By default, worktrees are placed in `~/gwt/${CURRENT_DIR}/${BRANCH}`.

For example, if your Git repository is `repo`, worktrees will be created at `~/gwt/repo/feature-foo` by default.

Available variables:
- `${CURRENT_DIR}` - Git repository directory name
- `${PARENT_DIR}` - Parent directory name of the Git repository
- `${GRAND_PARENT_DIR}` - Grandparent directory name of the Git repository
- `${BRANCH}` - Branch name (slashes are converted to hyphens)

Path specification methods:
- Relative path: Relative to the Git repository root (e.g., `.worktrees`, `../worktrees`)
- Path starting with `~`: Path from home directory (e.g., `~/gwt/${CURRENT_DIR}`)
- Absolute path: Used as-is (e.g., `/tmp/worktrees/${CURRENT_DIR}`)

Configuration examples:

```bash
# Simple structure (default)
git config gwt.worktree-path '~/gwt/${CURRENT_DIR}/${BRANCH}'

# Place in repository directory
git config gwt.worktree-path '.worktrees'

# Organize by repository name under home directory
git config gwt.worktree-path '~/worktrees/${CURRENT_DIR}'

# Group by parent directory (organization-based)
git config gwt.worktree-path '~/gwt/${PARENT_DIR}/${CURRENT_DIR}/${BRANCH}'

# ghq-like structure (advanced - requires deep directory hierarchy)
git config gwt.worktree-path '~/gwt/${GRAND_PARENT_DIR}/${PARENT_DIR}/${CURRENT_DIR}/${BRANCH}'

# Place one level above repository
git config gwt.worktree-path '../worktrees/${CURRENT_DIR}'
```

**Note**: The `${PARENT_DIR}` and `${GRAND_PARENT_DIR}` variables may be empty if your repository is close to the filesystem root. For ghq-like structures, ensure your repository path has sufficient depth (e.g., `/path/to/github.com/org/repo`).

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
