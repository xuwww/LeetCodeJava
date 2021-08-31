const path = require('path');
const vscode = require('vscode');
const fs = require('fs');

function activate(context) {
	let jarName = "leetcodeJava-1.3.jar";

	console.log('active');

	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.start', function () {
		vscode.window.showInformationMessage('run LeetCodeJava extension success');
	}));


	let channel = vscode.window.createOutputChannel('LeetCodeJava');
	let jarPath = path.join(__dirname + "./resource");

	/**
	 * 初始化文件配置 
	 * 生成leetcode.txt
	 * 路径注意转义
	 * __dirname
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.init', function () {
		//判断是否配置
		let leetcodePath = getLeetCodePath();
		fs.writeFile(path.join(leetcodePath, "./leetcode.txt"), '', 'utf-8', (error) => {
			if (error) {
				console.log(error);
				return false;
			}
			vscode.window.showInformationMessage("创建leetcode文件:" + path.join(leetcodePath, "./leetcode.txt"));
		})
	}));

	/**
	 * 使用js实现
	 * 完成以后跳转
	 * ExtensionContext.globalState：键值对组成的全局数据。当插件激活时会再次取出这些数据。
	 * ExtensionContext.workspaceState：键值对组成的工作区数据。当同一个工作区再次打开时会重新取出数据。
	 * nodejs中函数均为异步执行
	 * channel.show()会改变inputBox的光标
	 * TODO valueSelection
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.createFile', function () {
		let leetcodePath = getLeetCodePath();
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: "输入生成文件名,如\"1. Two Sum\"",
		}).then((title) => {
			if (!title) {
				return;
			}
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
				if (!methodString) {
					return;
				}
				createFile(title, methodString, leetcodePath, (filePath) => {
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
	}));

	//TODO error处理
	//TODO Thenable<T>
	function createFile(title, methodString, leetcodePath, then) {
		channel.show(true);
		title = "T" + title.trim().replace(/(\s|\.|\\|"|')+/g, "_");
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
		//TODO 已有文件处理
		//写入内容
		let content = "import java.util.*;\n\nclass " + className + " {\n\tpublic static " + returnType + " " + methodName + "{" + "\n\t\t\n\t}\n}";
		let filePath = path.join(leetcodePath, "./" + fileName);
		fs.writeFile(filePath, content, 'utf-8', (error) => {
			if (error) {
				console.log(error);
				channel.appendLine("创建leetcode文件失败:" + filePath)
				return false;
			}
			channel.appendLine("创建leetcode文件: " + filePath);
			then(filePath);
		})
	}

	let preValue;
	/**
	 * 编译当前文件
	 * 运行当前类中的静态方法，不唯一则运行第一个
	 * 编译生成文件存放classes
	 * 弹窗形式输入
	 * TODO 自定义弹窗
	 * TODO 获取当前光标所在函数名称
	 * java 实现部分 1. 通过main输入命令名称，类名和多个参数
	 * 2. 执行类中唯一方法，不唯一则执行第一个方法
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.compileAndRunDefault', function () {
		let leetcodePath = getLeetCodePath();
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: "输入测试用例, 规则同leetcode, 以空格拆分",
			value: preValue,
			valueSelection: (preValue ? [0, preValue.length] : undefined),
			prompt: "复杂多个输入建议采用leetcode.txt文件输入参数",
			validateInput: (input) => {
				let braket = 0;
				let quot = 0;
				let preInd = 0;
				for (let ind = 0; ind < input.length; ind++) {
					if (input.charAt(ind) == " " && braket == 0 && quot == 0 && preInd != ind) {
					} else if ((input.charAt(ind) == "(" || input.charAt(ind) == "[" || input.charAt(ind) == "{") && quot == 0) {
						braket++;
					} else if ((input.charAt(ind) == ")" || input.charAt(ind) == "]" || input.charAt(ind) == "}") && quot == 0) {
						braket--;
					} else if (input.charAt(ind) == "\"" || input.charAt(ind) == "\'") {
						quot ^= 1;
					}
				}
				if (braket != 0) {
					return "括号匹配失败,检查一下或者试试leetcode.txt"
				}
				if (quot != 0) {
					return "引号匹配失败,检查一下或者试试leetcode.txt"
				}
				return undefined;
			}
		}).then((parameter) => {
			if (!parameter) {
				return;
			}
			preValue = parameter;
			let inputParamter = [];
			//统计左右括号和引号插值
			let braket = 0;
			let quot = 0;
			let preInd = 0;
			for (let ind = 0; ind < parameter.length; ind++) {
				let ch = parameter.charAt(ind);
				if (ch == " " && braket == 0 && quot == 0 && preInd < ind) {
					inputParamter.push(parameter.slice(preInd, ind));
					preInd = ind + 1;
				} else if ((ch == "(" || ch == "[" || ch == "{") && quot == 0) {
					braket++;
				} else if ((ch == ")" || ch == "]" || ch == "}") && quot == 0) {
					braket--;
				} else if (ch == "\"" || ch == "\'") {
					quot ^= 1;
				}
			}
			if (preInd != parameter.length) {
				inputParamter.push(parameter.slice(preInd, parameter.length));
			}
			channel.show(true);
			channel.appendLine("测试变量: " + inputParamter);
			compile(leetcodePath, (/** @type {string} */ className) => {
				let exdir = path.join(leetcodePath, ".\\classes");
				let commandParam = "compileAndRunDefault";
				let parameter = "\"" + commandParam + "\"" + " " + "\"" + className + "\"";
				for (let i of inputParamter) {
					//特殊字符修改
					parameter += " \"" + i.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + "\"";
					console.log(i);
				}
				let runCmd = "java -cp " + "\"" + exdir + ";" + jarPath + "\\" + jarName + "\" Main " + parameter;
				let exec = require('child_process').exec;
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
			});
		})
	}));

	/**
	 * leetcode.txt文件作为参数,批量执行
	 * java实现部分 1. 通过main输入命令名称，类名和txt路径
	 * 				2.执行类中唯一方法，不唯一则执行第一个方法
	 */
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.compileAndRunTXT', function () {
		let leetcodePath = getLeetCodePath();
		compile(leetcodePath, (className) => {
			let commandParam = "compileAndRunTXT";
			let leetcodePath = getLeetCodePath();
			let exdir = path.join(leetcodePath, ".\\classes");
			let parameter = "\"" + commandParam + "\"" + " " + "\"" + className + "\"" + " " + "\"" + leetcodePath + "\"";
			let runCmd = "java -cp " + "\"" + exdir + ";" + jarPath + "\\" + jarName + "\" Main " + parameter;
			let exec = require('child_process').exec;
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
		});
	}));

	function getLeetCodePath() {
		let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		if (!leetcodePath || leetcodePath == "the first workspaceFolder" || leetcodePath == "null") {
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is default, not recommend!")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			console.log(folders);
			leetcodePath = folders[0].substr(1);
		}
		return leetcodePath;
	}

	/**
	 * @param {{ (className: any): void; (className: any): void; (arg0: string): void; }} callback
	 */
	function compile(leetcodePath, callback) {
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

}

function deactivate() {
	console.log('close');
}

module.exports = {
	activate,
	deactivate
}