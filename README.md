# Generic [LSP](https://microsoft.github.io/language-server-protocol/) Client for VSCode

For the rare instances where you have an LSP Server but not an LSP Client for VSCode.

## Marketplace Link

[Generic LSP Client](https://marketplace.visualstudio.com/items?itemName=llllvvuu.llllvvuu-glspc)

## "Failed to start server: spawn {command} ENOENT"
If there is a $PATH issue, you have a few options:
1. Run `code .` from a terminal in which the command is available in $PATH.
2. Set PATH in `glspc.environmentVariables` under "Extension Settings".

## Multiple LSP Servers

This extension is currently only able to register one language server. If necessary, you can to build multiple copies of this extension:

```sh
vi package.json  # change the "name", "displayName", and "description" fields
                 # also find/replace "Generic LSP Client"
npm install
npm run package
```

Then you can load it into VSCode under Extensions > ... > Install from VSIX...

## See Also

- [mattn/efm-langserver](https://github.com/mattn/efm-langserver) - Adapter for any command-line tool to LSP.
- [llllvvuu/efm-tool-definitions.yaml](https://github.com/llllvvuu/efm-tool-definitions.yaml) - Configuration presets for the above.

## Credits

- [torokati44/vscode-glspc](https://gitlab.com/torokati44/vscode-glspc) - where this is forked from
- [Matts966/efm-langserver-vscode](https://github.com/Matts966/efm-langserver-vscode) - where the text changed handlers are taken from
