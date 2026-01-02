export type GwtConfig = {
  worktreePath: string;
  hooks: {
    postSwitch?: string;
    postCreate?: string;
  };
};

export type Worktree = {
  path: string;
  branch: string;
  commit: string;
  locked: boolean;
};

export type SwitchOptions = {
  create?: boolean;
};

export type RemoveOptions = {
  force?: boolean;
};

export type ListOptions = {
  verbose?: boolean;
};
