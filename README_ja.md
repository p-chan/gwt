# gwt - Git Worktree Wrapper

[English README is here](./README.md)

Bunで動作する git worktree wrapper CLIツールです。

## 主要機能

- **サブコマンド**: `switch`, `list`, `remove`
- **switch機能**: worktreeの切り替え（`-c/--create`で新規作成）
- **設定管理**: git config (`[gwt]`セクション) で設定可能
- **フック機能**: `post-switch`, `post-create`
- **ディレクトリ移動**: シェル関数経由でcdを実現

## インストール

```bash
bun install
bun run build
```

## セットアップ

シェル統合機能を有効にするため、以下を設定ファイルに追加してください（**一度だけ**）：

### Bash

`~/.bashrc` に追加：

```bash
eval "$(gwt init bash)"
```

### Zsh

`~/.zshrc` に追加：

```bash
eval "$(gwt init zsh)"
```

### Fish

`~/.config/fish/config.fish` に追加：

```fish
gwt init fish | source
```

設定後、シェルを再起動するか `source ~/.bashrc`（または `~/.zshrc`）を実行してください。

## 使い方

### worktreeを切り替え

```bash
gwt switch feature-branch
```

### 新規worktreeを作成して切り替え

```bash
gwt switch -c new-feature
```

### worktree一覧を表示

```bash
gwt list
```

詳細表示：

```bash
gwt list -v
```

### worktreeを削除

```bash
gwt remove feature-branch
```

強制削除：

```bash
gwt remove -f feature-branch
```

## 設定

### worktree配置場所を変更

デフォルトでは `${GIT_ROOT}/.worktrees` に配置されます。

```bash
git config gwt.worktreePath '~/.local/share/gwt/${REPO_NAME}'
```

### フックを設定

#### post-switch

worktree切り替え後に実行されるフック：

```bash
git config gwt.hook.post-switch ~/.config/gwt/hooks/post-switch.sh
```

#### post-create

新規worktree作成後に実行されるフック：

```bash
git config gwt.hook.post-create ~/.config/gwt/hooks/post-create.sh
```

### フックスクリプト例

`~/.config/gwt/hooks/post-switch.sh`:

```bash
#!/bin/bash

# worktree切り替え後に自動でnpm install
if [ -f "$GWT_PATH/package.json" ]; then
  cd "$GWT_PATH" && npm install
fi
```

実行権限を付与：

```bash
chmod +x ~/.config/gwt/hooks/post-switch.sh
```

### フックに渡される環境変数

- `GWT_BRANCH`: ブランチ名
- `GWT_PATH`: worktreeパス
- `GWT_HOOK_TYPE`: フックタイプ（post-switch, post-create）

## 技術スタック

- **ランタイム**: Bun
- **言語**: TypeScript (strict mode)
- **CLIフレームワーク**: gunshi (宣言的・型安全なモダンCLIライブラリ)
- **シェルコマンド実行**: Bunの`$`演算子

## ライセンス

MIT
