import * as vscode from 'vscode';
import { GeminiService } from './geminiService';
import { Scanner } from './scanner';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "obsedian-live-scan" is now active!');

    let disposable = vscode.commands.registerCommand('antigravity.scan', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Gemini API Key',
            password: true,
            ignoreFocusOut: true
        });

        if (!apiKey) {
            vscode.window.showErrorMessage('Gemini API Key is required to scan.');
            return;
        }

        const geminiService = new GeminiService(apiKey);

        // Test connection and list models
        await geminiService.testConnection();

        const diagnosticCollection = vscode.languages.createDiagnosticCollection('antigravity');
        context.subscriptions.push(diagnosticCollection);

        const scanner = new Scanner(geminiService, diagnosticCollection);

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Scanning for vulnerabilities...",
            cancellable: true
        }, async (progress, token) => {
            await scanner.scan(progress, token);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
