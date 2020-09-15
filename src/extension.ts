/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient';
import { ChildProcess, spawn } from "child_process";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const config = workspace.getConfiguration("glspc");
    const serverPath : string | undefined = config.get("serverPath");

    /*
        Examples: (you should expand ~ to your $HOME first)
        "/usr/bin/ccls"
        "~/.cargo/bin/rls"
        "/usr/bin/clangd"
        "~/.local/bin/pyls"
    */

    if (serverPath) {
        const serverOptions: ServerOptions = async (): Promise<ChildProcess> => {
            return spawn(serverPath);
        };

        const clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'plaintext' }],
            diagnosticCollectionName: 'glspc',
        };

        client = new LanguageClient('glspc', 'Generic LSP Client', serverOptions, clientOptions);

        client.start();
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client)
        return undefined;
    return client.stop();
}
