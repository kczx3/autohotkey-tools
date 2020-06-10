const vscode = require("vscode");

class AhkDocumentSymbolProvider extends vscode.DocumentSymbol {
    /**
     * Provides symbol information for the document
     * @param {vscode.TextDocument} vsDocument The document to be parsed
     * @param {vscode.CancellationToken} token Cancellation token
     */
    provideDocumentSymbols(vsDocument, token) {
        return new Promise((resolve, reject) => {
            let symbols = [];

            for (let i = 0; i < vsDocument.lineCount; i++) {
                let line = vsDocument.lineAt(i);
                let matches = line.text.match(/^\s*(\w+)\(.*\)\s*{/);

                if (matches && matches.length) {
                    symbols.push(new vscode.SymbolInformation(
                        matches[1],
                        vscode.SymbolKind.Function,
                        "",
                        new vscode.Location(vsDocument.uri, line.range)
                    ));
                }
            }

            resolve(symbols);
        });
    }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ahk-symbols" is now active!');

    const { activeTextEditor: ate } = vscode.window;
    const { lineCount: lc } = ate.document;
    const lastChar = new vscode.Position(lc, ate.document.lineAt(lc - 1).range.end.character);

	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        { language: "ahk" },
        new AhkDocumentSymbolProvider(
            "things",
            "stuff about things",
            vscode.SymbolKind.Variable,
            new vscode.Range(new vscode.Position(0, 0), lastChar),
            ate.selection
        )
    ));
}
exports.activate = activate;
