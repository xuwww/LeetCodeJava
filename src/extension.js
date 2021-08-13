
const path = require('path');
const vscode = require('vscode');
const fs = require('fs');

function activate(context) {
	let jarName = "leetcodeJava-1.0.jar";

	console.log('active');
	let disposable = vscode.commands.registerCommand('LeetCodeJava.start', function () {
		vscode.window.showInformationMessage('run LeetCodeJava extension success');
	});

	let channel = vscode.window.createOutputChannel('LeetCodeJava');

	/**
	 * 初始化文件配置，生成leetcode.txt
	 */
	// context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.init',function(
		
	// )))

	/**
	 * 使用java代码实现 //TODO 使用js实现
	 * 调用leetcode.txt文件中的各项参数//TODO 弹窗输入 
	 * 完成后不跳转 // TODO 完成以后跳转
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFile', function () {
		channel.clear();
		channel.show();
		let exec = require('child_process').exec;
		let jarPath = vscode.workspace.getConfiguration().get("LeetCodeJava.jar");
		if(!jarPath||jarPath == "null"){
			vscode.window.showErrorMessage("parameter LeetCodeJava.jar is null, see the README")
		}
		let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		console.log(leetcodePath);
		if(!leetcodePath||leetcodePath == "the first workspaceFolder"){
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is null")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			leetcodePath = folders[0];
			console.log(leetcodePath);
		}
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

	/**
	 * 编译当前文件
	 * 运行当前中唯一函数 //TODO 获取光标所在函数
	 * 调用参数为leetcode.txt中 //TODO 弹窗形式输入
	 */
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
		let runCmd = "java -cp " + "\"" + leetcodePath + ";" + jarPath + "\\" + jarName + "\" Main " + leetcodePath;
		console.log(compileCmd + "; " + runCmd);
		exec(compileCmd + " && " + runCmd, function (error, stdout, stderr) {
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