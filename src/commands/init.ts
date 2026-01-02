import { define } from 'gunshi';

const shellFunctions: Record<string, string> = {
  bash: `# gwt shell integration for bash
gwt() {
  if [[ "$1" == "switch" ]]; then
    local output
    local exit_code

    output=$(command gwt "$@" 2>&1)
    exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
      if [[ -n "$output" && -d "$output" ]]; then
        cd "$output" || return 1
      fi
    else
      echo "$output" >&2
      return $exit_code
    fi
  else
    command gwt "$@"
  fi
}`,

  zsh: `# gwt shell integration for zsh
gwt() {
  if [[ "$1" == "switch" ]]; then
    local output
    local exit_code

    output=$(command gwt "$@" 2>&1)
    exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
      if [[ -n "$output" && -d "$output" ]]; then
        cd "$output" || return 1
      fi
    else
      echo "$output" >&2
      return $exit_code
    fi
  else
    command gwt "$@"
  fi
}`,

  fish: `# gwt shell integration for fish
function gwt
    if test "$argv[1]" = "switch"
        set -l output (command gwt $argv 2>&1)
        set -l exit_code $status

        if test $exit_code -eq 0
            if test -n "$output" -a -d "$output"
                cd $output
            end
        else
            echo $output >&2
            return $exit_code
        end
    else
        command gwt $argv
    end
end`,
};

export const initCommand = define({
  name: 'init',
  description: 'Print shell integration code',
  args: {
    shell: {
      type: 'string',
      description: 'Shell type (bash, zsh, or fish)',
      required: true,
    },
  },
  run: async (ctx) => {
    const { shell } = ctx.values;
    const shellFunction = shellFunctions[shell];

    if (!shellFunction) {
      console.error(`Error: Unsupported shell '${shell}'.`);
      console.error(`Supported shells: bash, zsh, fish`);
      process.exit(1);
    }

    console.log(shellFunction);
  },
});
