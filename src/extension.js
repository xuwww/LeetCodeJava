
const path = require('path');
const vscode = require('vscode');

function activate(context) {
	let jarName = "leetcodeJava-1.0.jar";

	console.log('active');
	let disposable = vscode.commands.registerCommand('LeetCodeJava.start', function () {
		vscode.window.showInformationMessage('run LeetCodeJava extension success');
	});

	let channel = vscode.window.createOutputChannel('LeetCodeJava');

	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFile', function () {
		channel.clear();
		channel.show();
		let exec = require('child_process').exec;
		let jarPath = vscode.workspace.getConfiguration().get("LeetCodeJava.jar");
		let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		let cmd = "java -cp " + jarPath + "\\" + jarName + " leetcode.autoCreate.CreateLeetcodeFile " + leetcodePath;
		vscode.window.setStatusBarMessage('Execute command: ' + cmd);
		console.log(cmd);
		exec(cmd, function (error, stdout, stderr) {
			if (stderr) {
				console.log(stderr);
				channel.appendLine(stderr);
			} else if (stdout) {
				console.log(stdout);
				channel.appendLine(stdout);
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.compileAndRun', function () {
		channel.clear();
		channel.show();
		let exec = require('child_process').exec;
		let jarPath = vscode.workspace.getConfiguration().get("LeetCodeJava.jar");
		let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		let editor = vscode.window.activeTextEditor;
		let fullFileName = editor.document.fileName;
		if (!editor || !fullFileName) {
			return;
		}
		if (!fullFileName.endsWith('.java')) {
			return;
		}
		let compileCmd = 'javac -encoding utf8 "' + fullFileName + '"';
		exec(compileCmd, function (error, stdout, stderr) {
			if (stderr) {
				console.log(stderr);
				channel.appendLine(stderr);
			} else if (stdout) {
				console.log(stdout);
				channel.appendLine(stdout);
			}
		});
		let runCmd = "java -cp " + "\"" + leetcodePath + ";" + jarPath + "\\" + jarName + "\" Main " + leetcodePath;
		console.log(runCmd);
		exec(runCmd, function (error, stdout, stderr) {
			if (stderr) {
				console.log(stderr);
				channel.appendLine(stderr);
			} else if (stdout) {
				console.log(stdout);
				channel.appendLine(stdout);
			}
		});
	}));

}


function deactivate() {
	console.log('close');
}

module.exports = {
	activate,
	deactivate
}