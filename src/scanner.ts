import * as vscode from 'vscode';
import { GeminiService, Vulnerability } from './geminiService';

export class Scanner {
    private geminiService: GeminiService;
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(geminiService: GeminiService, diagnosticCollection: vscode.DiagnosticCollection) {
        this.geminiService = geminiService;
        this.diagnosticCollection = diagnosticCollection;
    }

    async scan(progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) {
        const files = await vscode.workspace.findFiles('**/*.{ts,js,py,java,c,cpp,go,rs,php}', '**/node_modules/**');
        const total = files.length;
        let processed = 0;

        this.diagnosticCollection.clear();

        for (const file of files) {
            if (token.isCancellationRequested) {
                break;
            }

            progress.report({ message: `Scanning ${vscode.workspace.asRelativePath(file)}...`, increment: (1 / total) * 100 });

            try {
                const document = await vscode.workspace.openTextDocument(file);
                const code = document.getText();
                // Skip large files to avoid hitting API limits or timeouts
                if (code.length > 10000) {
                    continue;
                }

                const vulnerabilities = await this.geminiService.analyzeCode(code, file.fsPath);

                if (vulnerabilities.length > 0) {
                    const diagnostics: vscode.Diagnostic[] = vulnerabilities.map(v => {
                        const line = Math.max(0, v.line - 1); // 0-based
                        const range = new vscode.Range(line, 0, line, Number.MAX_VALUE);
                        const severity = v.severity === 'High' ? vscode.DiagnosticSeverity.Error :
                            v.severity === 'Medium' ? vscode.DiagnosticSeverity.Warning :
                                vscode.DiagnosticSeverity.Information;
                        return new vscode.Diagnostic(range, v.message, severity);
                    });
                    this.diagnosticCollection.set(file, diagnostics);
                }
            } catch (e) {
                console.error(`Failed to scan ${file.fsPath}:`, e);
            }

            processed++;
        }

        vscode.window.showInformationMessage(`Scan completed. Scanned ${processed} files.`);
    }
}
