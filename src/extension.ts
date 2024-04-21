/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { type ChildProcess, spawn } from "child_process"
import type { ExtensionContext } from "vscode"
import { commands, window, workspace } from "vscode"
import type {
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node"
import { LanguageClient } from "vscode-languageclient/node"

let client: LanguageClient
let server: ChildProcess | undefined

function startServer() {
  const config = workspace.getConfiguration("glspc")
  const serverCommand: string = config.get("serverCommand") ?? ""

  if (serverCommand) {
    const serverCommandArguments: string[] =
      config.get("serverCommandArguments") ?? []
    const languageId: string = config.get("languageId") ?? ""
    const initializationOptions: object =
      config.get("initializationOptions") ?? {}
    const pathPrepend: string | undefined = config.get("pathPrepend")

    const outputChannel = window.createOutputChannel("glspc")
    outputChannel.appendLine("starting glspc...")

    const serverOptions: ServerOptions = (): Promise<ChildProcess> => {
      const prepend = pathPrepend?.concat(":") ?? ""
      server = spawn(serverCommand, serverCommandArguments, {
        env: {
          ...process.env,
          PATH: prepend.concat(process.env["PATH"] ?? ""),
        },
      })
      void window.showInformationMessage(
        `Started language server: ${serverCommand}`,
      )
      return Promise.resolve(server)
    }

    const clientOptions: LanguageClientOptions = {
      documentSelector: [languageId],
      diagnosticCollectionName: "glspc",
      initializationOptions,
    }

    client = new LanguageClient(
      "glspc",
      "Generic LSP Client",
      serverOptions,
      clientOptions,
    )

    void client.start().then(() => outputChannel.appendLine("started glspc."))
  }
}

async function killServer(): Promise<void> {
  await client.stop()
  server?.kill()
}

export function activate(context: ExtensionContext) {
  startServer()

  context.subscriptions.push(
    commands.registerCommand("glspc.restartServer", async () => {
      await killServer()
      startServer()
    }),
  )
}

export function deactivate(): Thenable<void> | undefined {
  return killServer()
}
