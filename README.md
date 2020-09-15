# Generic LSP Client for VS Code

This is a barebones, minimal, simple [LSP](https://langserver.org/) client extension that starts an arbitrary executable to be used as a server through its stdin and stdout.

Nothing more, nothing less.

Mostly for testing and experimentation.

This was scraped together from:
  - https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-sample
  - https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample
  - https://github.com/MaskRay/vscode-ccls

Inspired by my [repeated](https://twitter.com/torokati44/status/1214988526460256256) [frustration](https://twitter.com/torokati44/status/1291353494440554496) of how unsimple this is with VS Code out of the box, in contrast with [Kate](https://kate-editor.org/)

## Usage

Set the `"glspc.serverPath"` configuration setting to the full path of an executable that
implements the LSP protocol through its standard input and output streams.
This executable will be started as an LSP server for any file in "Plain Text" mode, so
you should (usually) get working autocompletion, outline, problem markers, and whatnot.

Example values:
  - `"/usr/bin/ccls"`
  - `"/home/<user>/.cargo/bin/rls"`
  - `"/usr/bin/clangd"`
  - `"/home/<user>/.local/bin/pyls"`

If the server of your choice only speaks TCP or WS or HTTP or something, you can try putting together
a wrapper script for it using `nc` or `netcat` or `socat`, or similar for other protocols.

## Running during Development

  - Run `npm install` in terminal to install dependencies
  - Run the `Run Extension` target in the Debug View. This will:
    - Start a task `npm: watch` to compile the code
    - Run the extension in a new VS Code window
