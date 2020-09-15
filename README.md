# Generic LSP Client for VS Code

This is a barebones, minimal, simple [LSP](https://langserver.org/) client extension that starts an arbitrary executable to be used as a server through its stdin and stdout.

Nothing more, nothing less.

Mostly for testing and experimentation.

This was scraped together from:
  - https://github.com/microsoft/vscode-extension-samples/tree/master/helloworld-sample
  - https://github.com/microsoft/vscode-extension-samples/tree/master/lsp-sample
  - https://github.com/MaskRay/vscode-ccls

Inspired by my [repeated](https://twitter.com/torokati44/status/1214988526460256256) [frustration](https://twitter.com/torokati44/status/1291353494440554496) of how unsimple this is with VS Code out of the box, in contrast with [Kate](https://kate-editor.org/)

## Running during Development

  - Run `npm install` in terminal to install dependencies
  - Run the `Run Extension` target in the Debug View. This will:
    - Start a task `npm: watch` to compile the code
    - Run the extension in a new VS Code window
