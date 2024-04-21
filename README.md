# [Fixit](https://github.com/Instagram/Fixit) (unofficial) for VSCode

Real-time diagnostics (TODO: auto-fixes) for the Fixit linter.

## Marketplace Link

[Fixit (unofficial)](https://marketplace.visualstudio.com/items?itemName=llllvvuu.fixit-unofficial)


## Prerequisites

1. Install [Fixit](https://github.com/Instagram/Fixit) with `lsp` extras (e.g. `pip install "fixit[lsp]"`)
2. Ensure `fixit` is on the `$PATH` seen by VSCode. There are a few ways to do this:
    - Run `code .` from a terminal in which the command is available in `$PATH`.
    - Set PATH in `fixitUnofficial.environmentVariables` under "Extension Settings". The appropriate value can be determined by running `which fixit` in a terminal.

## Credits

- [torokati44/vscode-glspc](https://gitlab.com/torokati44/vscode-glspc) - where this is forked from
