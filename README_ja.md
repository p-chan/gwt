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

デフォルトでは `~/gwt/${CURRENT_DIR}/${BRANCH}` に配置されます。

例えば、Git リポジトリが `repo` の場合、デフォルトでは `~/gwt/repo/feature-foo` に配置されます。

使用可能な変数:
- `${CURRENT_DIR}` - Git リポジトリのディレクトリ名
- `${PARENT_DIR}` - Git リポジトリの親ディレクトリ名
- `${GRAND_PARENT_DIR}` - Git リポジトリの祖父母ディレクトリ名
- `${BRANCH}` - ブランチ名（スラッシュはハイフンに変換）

パスの記述方法:
- 相対パス: Git リポジトリのルートからの相対パス（例: `.worktrees`, `../worktrees`）
- `~` で始まるパス: ホームディレクトリからのパス（例: `~/gwt/${CURRENT_DIR}`）
- 絶対パス: そのまま使用（例: `/tmp/worktrees/${CURRENT_DIR}`）

設定例:

```bash
# シンプルな構造（デフォルト）
git config gwt.worktree-path '~/gwt/${CURRENT_DIR}/${BRANCH}'

# リポジトリディレクトリ内に配置
git config gwt.worktree-path '.worktrees'

# ホームディレクトリ配下にリポジトリ別で整理
git config gwt.worktree-path '~/worktrees/${CURRENT_DIR}'

# 親ディレクトリ配下にまとめる（organization 別）
git config gwt.worktree-path '~/gwt/${PARENT_DIR}/${CURRENT_DIR}/${BRANCH}'

# ghq ライクな構造（高度 - 深い階層構造が必要）
git config gwt.worktree-path '~/gwt/${GRAND_PARENT_DIR}/${PARENT_DIR}/${CURRENT_DIR}/${BRANCH}'

# リポジトリの1つ上の階層に配置
git config gwt.worktree-path '../worktrees/${CURRENT_DIR}'
```

**注意**: `${PARENT_DIR}` と `${GRAND_PARENT_DIR}` 変数は、リポジトリがファイルシステムのルート近くにある場合は空になることがあります。ghq ライクな構造を使用する場合は、リポジトリパスに十分な深さがあることを確認してください（例: `/path/to/github.com/org/repo`）。

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
