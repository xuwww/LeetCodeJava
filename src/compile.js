const vscode = require('vscode');
const path = require('path');
/**
	 * @param {{ (className: any): void; (className: any): void; (arg0: string): void; }} callback
	 */
exports.compile = function(leetcodePath, channel, callback) {
    let editor = vscode.window.activeTextEditor;
    let fullFileName = editor.document.fileName;
    let exdir = path.join(leetcodePath, ".\\classes");
    if (!editor || !fullFileName) {
        return;
    }
    if (!fullFileName.endsWith('.java')) {
        return;
    }
    let compileCmd = 'javac -encoding utf8 "' + fullFileName + '"' + " -d \"" + exdir + "\"";
    let className = path.basename(fullFileName, ".java").replace(/[^0-9a-zA-Z_]+/g, "_");
    let exec = require('child_process').exec;
    console.log(compileCmd);
    exec(compileCmd, function (error, stdout, stderr) {
        channel.show(true);
        if (stderr) {
            console.log(stderr);
            channel.appendLine(stderr);
        } else if (stdout) {
            console.log(stdout);
            channel.appendLine(stdout);
        }
        if (!error) {
            callback(className);
        }
    });
}