/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { type ChildProcess, spawn } from "child_process"

// eslint-disable-next-line import/no-unresolved
import { workspace, commands, languages, window } from "vscode"
import { LanguageClient } from "vscode-languageclient/node"
import { HoverRequest, CompletionRequest } from "vscode-languageserver-protocol"

import type { ExtensionContext, TextDocument, OutputChannel } from "vscode"
import type {
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidOpenTextDocumentParams,
  DidSaveTextDocumentParams,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node"

let client: LanguageClient
let server: ChildProcess

function openFile(
  document: TextDocument,
  languageId: string,
  outputChannel: OutputChannel,
  openDocuments: Set<string>,
) {
  if (!openDocuments.has(document.uri.toString())) {
    openDocuments.add(document.uri.toString())
    const param: DidOpenTextDocumentParams = {
      textDocument: {
        uri: document.uri.toString(),
        languageId,
        version: document.version,
        text: document.getText(),
      },
    }
    outputChannel.appendLine(
      `File not opened, publishing textDocument/didOpen with param: ${JSON.stringify(
        param,
      )}`,
    )
    void client.sendNotification("textDocument/didOpen", param)
  }
}

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

    // eslint-disable-next-line @typescript-eslint/require-await
    const serverOptions: ServerOptions = async (): Promise<ChildProcess> => {
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
      return server
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

    const openDocuments = new Set<string>()

    workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.scheme !== "file") {
        return
      }
      openFile(e.document, languageId, outputChannel, openDocuments)
      const param: DidChangeTextDocumentParams = {
        textDocument: {
          uri: e.document.uri.toString(),
          version: e.document.version,
        },
        contentChanges: e.contentChanges.map(c => ({
          ...c,
          range: {
            ...c.range,
          },
        })),
      }
      outputChannel.appendLine(
        `publishing textDocument/didChange with param: ${JSON.stringify(
          param,
        )}`,
      )
      return client.sendNotification("textDocument/didChange", param)
    })
    workspace.onDidSaveTextDocument(e => {
      if (e.uri.scheme !== "file") {
        return
      }
      const param: DidSaveTextDocumentParams = {
        textDocument: {
          uri: e.uri.toString(),
        },
        text: e.getText(),
      }
      outputChannel.appendLine(
        `publishing textDocument/didSave with param: ${JSON.stringify(param)}`,
      )
      return client.sendNotification("textDocument/didSave", param)
    })
    workspace.onDidCloseTextDocument(e => {
      if (e.uri.scheme !== "file") {
        return
      }
      const param: DidCloseTextDocumentParams = {
        textDocument: {
          uri: e.uri.toString(),
        },
      }
      outputChannel.appendLine(
        `publishing textDocument/didClose with param: ${JSON.stringify(param)}`,
      )
      return client.sendNotification("textDocument/didClose", param)
    })
    workspace.onDidOpenTextDocument(e => {
      if (e.uri.scheme !== "file") {
        return
      }
      openDocuments.add(e.uri.toString())
      const param: DidOpenTextDocumentParams = {
        textDocument: {
          uri: e.uri.toString(),
          languageId,
          version: e.version,
          text: e.getText(),
        },
      }
      outputChannel.appendLine(
        `publishing textDocument/didOpen with param: ${JSON.stringify(param)}`,
      )
      return client.sendNotification("textDocument/didOpen", param)
    })
    languages.registerHoverProvider([languageId], {
      async provideHover(document, position, token) {
        if (document.uri.scheme !== "file") {
          outputChannel.appendLine(
            `uri: ${document.uri.toString()} is not a file`,
          )
          return
        }
        outputChannel.appendLine(`provideHover for ${document.uri.toString()}`)
        openFile(document, languageId, outputChannel, openDocuments)
        return client
          .sendRequest(
            HoverRequest.type,
            client.code2ProtocolConverter.asTextDocumentPositionParams(
              document,
              position,
            ),
            token,
          )
          .then(result => {
            if (token.isCancellationRequested) {
              return null
            }
            return client.protocol2CodeConverter.asHover(result)
          })
      },
    })

    const triggers =
      client.initializeResult?.capabilities.completionProvider
        ?.triggerCharacters
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    outputChannel.appendLine(`trigger characters: ${triggers}`)
    languages.registerCompletionItemProvider(
      [languageId],
      {
        async provideCompletionItems(document, position, token) {
          if (document.uri.scheme !== "file") {
            outputChannel.appendLine(
              `uri: ${document.uri.toString()} is not a file`,
            )
            return
          }
          outputChannel.appendLine(
            `provideCompletionItems for ${document.uri.toString()}`,
          )
          openFile(document, languageId, outputChannel, openDocuments)
          const result = await client.sendRequest(
            CompletionRequest.type,
            client.code2ProtocolConverter.asTextDocumentPositionParams(
              document,
              position,
            ),
            token,
          )
          if (token.isCancellationRequested) {
            return null
          }
          return client.protocol2CodeConverter.asCompletionResult(result)
        },
      },
      ...(triggers ?? []),
    )
  }
}

async function killServer(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  await client?.stop()
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
