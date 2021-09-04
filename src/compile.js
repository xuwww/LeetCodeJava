const vscode = require('vscode');
const path = require('path');
const { decodeGBK } = require('./decodeGBK');

/**
     * @param {{ (className: any): void; (className: any): void; (arg0: string): void; }} callback
     */
exports.compile = function (leetcodePath, channel, callback) {
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
    exec(compileCmd, { encoding: "binaryEncoding" },  function (error, stdout, stderr) {
        if (stderr&&stderr.length!=0) {
            console.log(decodeGBK(stderr));
            channel.appendLine(decodeGBK(stderr));
        } 
        if (stdout&&stdout.length!=0) {
            channel.appendLine(decodeGBK(stdout));
        }
        if (!error) {
            callback(className);
        }
    });
}