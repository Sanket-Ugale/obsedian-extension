# Obsedian.live Scan

**Obsedian.live Scan** is an AI-powered vulnerability scanner for VS Code. It uses Google's Gemini API to analyze your codebase for security vulnerabilities, malicious patterns, and code quality issues.

## Features

-   **AI-Powered Analysis**: Uses the advanced `gemini-2.5-pro` model to understand code context and detect subtle vulnerabilities.
-   **Comprehensive Scanning**: Scans various file types including JavaScript, TypeScript, Python, Java, C/C++, Go, PHP, and more.
-   **Real-time Feedback**: Reports vulnerabilities directly in the editor as diagnostics (red squiggly lines) with detailed descriptions and severity levels.
-   **Easy to Use**: Simple command to trigger a scan of your entire workspace.

## Requirements

-   **Gemini API Key**: You need a valid API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Usage

1.  Open a project in VS Code.
2.  Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`).
3.  Run the command: `Obsedian.live: Scan for Vulnerabilities`.
4.  Enter your Gemini API Key when prompted.
5.  Wait for the scan to complete. Vulnerabilities will be highlighted in your code and listed in the **Problems** panel.

## Extension Settings

This extension currently does not have any persistent settings. You will be prompted for your API key each time you start a new session (or it may be cached in memory for the session).

## Known Issues

-   Large files (>10,000 characters) are currently skipped to avoid API limits.
-   Rate limits may apply depending on your Gemini API tier.

## Release Notes

### 0.0.1

-   Initial release of Obsedian.live Scan.
-   Support for `gemini-2.5-pro` model.
