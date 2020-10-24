/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext, workspace, commands, window } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import { ChildProcess, spawn } from "child_process";

let client: LanguageClient;
let server: ChildProcess;

function startServer(serverPath : string) {
    /*
        Examples: (you should expand ~ to your $HOME first)
        "/usr/bin/ccls"
        "~/.cargo/bin/rls"
        "/usr/bin/clangd"
        "~/.local/bin/pyls"
    */

    if (serverPath) {
        const serverOptions: ServerOptions = async (): Promise<ChildProcess> => {
            server = spawn(serverPath);
            window.showInformationMessage("Started language server: " + serverPath);
            return server;
        };

        const clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'plaintext' }],
            diagnosticCollectionName: 'glspc',
        };

        client = new LanguageClient('glspc', 'Generic LSP Client', serverOptions, clientOptions);

        client.start();
    }
}

async function killServer() : Promise<void> {
    await client.stop();
    server.kill();
}

export function activate(context: ExtensionContext) {
    const config = workspace.getConfiguration("glspc");
    const pathConfig : string | undefined = config.get("serverPath");
    const serverPath : string = pathConfig ? pathConfig : "";

    startServer(serverPath);

    context.subscriptions.push(commands.registerCommand('glspc.restartServer', async () => {
        await killServer();
        startServer(serverPath);
    }));
}

export function deactivate(): Thenable<void> | undefined {
    return killServer();
}
