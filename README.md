# Generic [LSP](https://microsoft.github.io/language-server-protocol/) Client for VSCode

For the rare instances where you have an LSP Server but not an LSP Client for VSCode.

## Marketplace Link

[Generic LSP Client](https://marketplace.visualstudio.com/items?itemName=llllvvuu.llllvvuu-glspc)

## Configuration Example

`settings.json`:

```json
{
  "glspc.languageId": "solidity",
  "glspc.serverCommand": "/Users/me/.local/share/nvim/mason/bin/efm-langserver",
  "glspc.pathPrepend": "/Users/me/.local/share/rtx/installs/python/3.11.4/bin:/Users/me/.local/share/rtx/installs/node/20.3.1/bin"
}
```

## Multiple LSP Servers

This extension is not a process manager (yet), so to get clients for multiple LSP servers you need to build multiple copies of this extension:

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
