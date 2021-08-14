
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
	let jarPath = path.join(__dirname + "./resource");
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
		fs.writeFile(path.join(leetcodePath, "./leetcode.txt"), '', 'utf-8', (error) => {
			if (error) {
				console.log(error);
				return false;
			}
			console.log();
			vscode.window.showInformationMessage("创建leetcode文件:" + path.join(leetcodePath, "./leetcode.txt"));
		})
	}));

	/**
	 * 使用js实现
	 * 完成以后跳转
	 * ExtensionContext.globalState：键值对组成的全局数据。当插件激活时会再次取出这些数据。
	 * ExtensionContext.workspaceState：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
	 * nodejs中函数均为异步执行
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFile', function () {
		channel.clear();
		channel.show();
		if (!leetcodePath || leetcodePath == "the first workspaceFolder") {
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is default, not recommend!")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			leetcodePath = folders[0];
		}
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: "输入生成文件名,如\"1. Two Sum\"",
		}).then((title) => {
			vscode.window.showInputBox({
				ignoreFocusOut: true,
				placeHolder: "输入返回类型和方法名,类似\"public int[] twoSum(int[] nums, int target) {\"",
				validateInput: (input) => {
					if (!/\(.*?\)/.test(input)) {
						return "不包含方法";
					}
					return undefined;
				}
			}).then((methodString) => {
				createFile(title, methodString, (filePath) => {
					vscode.workspace.openTextDocument(filePath)
						.then(doc => {
							// 在VSCode编辑窗口展示读取到的文本
							vscode.window.showTextDocument(doc);
						}, err => {
							console.log(`Open ${filePath} error, ${err}.`);
						})
				});
			})
		});
		// let exec = require('child_process').exec;
		// let cmd = "java -cp " + jarPath + "\\" + jarName + " leetcode.autoCreate.CreateLeetcodeFile " + leetcodePath;
		// vscode.window.setStatusBarMessage('Execute command: ' + cmd);
		// console.log(cmd);
		// exec(cmd, function (error, stdout, stderr) {
		// 	if (stderr) {
		// 		console.log(stderr);
		// 		channel.appendLine(stderr);
		// 	} else if (stdout) {
		// 		console.log(stdout);
		// 		channel.appendLine(stdout);

		// 	}
		// });
	}));

	//TODO error处理
	//TODO Thenable<T>
	function createFile(title, methodString, then) {
		channel.show();
		title = "T" + title.trim().replace(/(\s|\.)+/g, "_");
		let fileName = title + ".java";
		let className = title.replace(/[^0-9a-zA-Z_]+/g, "_");
		//提取methodName中第一个合理的方法和返回类型
		let methodBracket = methodString.match(/\(.*?\)/);
		methodString = methodString.slice(0, methodBracket["index"]);
		let blank = methodString.match(/\s\w*$/);
		let methodName = methodString.slice(blank["index"] + 1, methodBracket["index"]) + methodBracket[0];
		methodString = methodString.slice(0, blank["index"]);
		blank = methodString.match(/\s\w*$/);
		if (!blank) {
			blank = { "index": -1 };
		}
		let returnType = methodString.slice(blank["index"] + 1, methodString.length);
		//写入内容
		let content = "import java.util.*;\n\nclass " + className + " {\n\tpublic static " + returnType + " " + methodName + "{" + "\n\t\t\n\t}\n}";
		let filePath = path.join(leetcodePath, "./" + fileName);
		fs.writeFile(filePath, content, 'utf-8', (error) => {
			if (error) {
				console.log(error);
				return false;
			}
			channel.appendLine("创建leetcode文件: " + filePath);
			then(filePath);
		})
	}

	/**
	 * 使用java代码实现 //TODO 使用js实现
	 * 调用leetcode.txt文件中的各项参数 
	 * TODO txt文件用于批量生成
	 * 完成后不跳转 // TODO 完成以后跳转
	 * ExtensionContext.globalState：键值对组成的全局数据。当插件激活时会再次取出这些数据。
	 * ExtensionContext.workspaceState：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFiles', function () {
		channel.clear();
		channel.show();
		let exec = require('child_process').exec;
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