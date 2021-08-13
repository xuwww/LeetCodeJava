
const path = require('path');
const vscode = require('vscode');
const fs = require('fs');

function activate(context) {
	let jarName = "leetcodeJava-1.0.jar";

	console.log('active');
	vscode.commands.registerCommand('LeetCodeJava.start', function () {
		vscode.window.showInformationMessage('run LeetCodeJava extension success');
	});

	let channel = vscode.window.createOutputChannel('LeetCodeJava');
	let jarPath = path.join(__dirname+"./resource");
	let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
	/**
	 * 初始化文件配置 
	 * 生成leetcode.txt
	 * 路径注意转义
	 * __dirname
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.init', function () {
		//判断是否配置
		if (!leetcodePath || leetcodePath == "the first workspaceFolder" || leetcodePath == "null") {
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is default, not recommend!")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			leetcodePath = folders[0];
		}
		fs.writeFile(path.join(leetcodePath,"./leetcode.txt"),'','utf-8',(error)=>{
			if(error){
				console.log(error);
				return false;
			}
			console.log(path.join(leetcodePath,"./leetcode.txt"));
			vscode.window.showInformationMessage("创建leetcode文件成功！");
		})
	}));

	/**
	 * 使用java代码实现 //TODO 使用js实现
	 * 调用leetcode.txt文件中的各项参数//TODO 弹窗输入 input弹窗
	 * 完成后不跳转 // TODO 完成以后跳转
	 * ExtensionContext.globalState：键值对组成的全局数据。当插件激活时会再次取出这些数据。
	 * ExtensionContext.workspaceState：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFile', function () {
		channel.clear();
		channel.show();
		let exec = require('child_process').exec;
		// let jarPath = vscode.workspace.getConfiguration().get("LeetCodeJava.jar");
		// if (!jarPath || jarPath == "null") {
		// 	vscode.window.showErrorMessage("parameter LeetCodeJava.jar is null, see the README");
		// 	return;
		// }
		// let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		if (!leetcodePath || leetcodePath == "the first workspaceFolder") {
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is default, not recommend!")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			leetcodePath = folders[0];
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
		// let jarPath = vscode.workspace.getConfiguration().get("LeetCodeJava.jar");
		// let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
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