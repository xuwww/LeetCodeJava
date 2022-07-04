const path = require('path');
const vscode = require('vscode');
const fs = require('fs');
const { getLeetCodePath } = require('./leetcodePath');
const { compile } = require('./compile');
const { createFile } = require('./createFile');
const { decodeGBK } = require('./decodeGBK');
const i18n = require('i18n')

function activate(context) {
	let jarName = "leetcodeJava-1.3.jar";

	i18n.configure({
		locales: ['zh-cn', 'en'],
		directory: path.join(__dirname, 'locales')
	})
	
	i18n.setLocale(vscode.env.language);

	console.log(i18n.__('active'));

	//'run LeetCodeJava extension success'
	context.subscriptions.push(vscode.commands.registerCommand('LeetCodeJava.start', function () {
		vscode.window.showInformationMessage(i18n.__('start_success'));
	}));


	let channel = vscode.window.createOutputChannel('LeetCodeJava');
	channel.show(true);
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
			//"创建leetcode文件:"
			vscode.window.showInformationMessage(i18n.__('create') + path.join(leetcodePath, "./leetcode.txt"));
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
		channel.clear();	
		let leetcodePath = getLeetCodePath();
		//输入生成文件名,如\"1. Two Sum\"
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: i18n.__('inputFileName'),
		}).then((title) => {
			if (!title) {
				return;
			}
			//"输入返回类型和方法名,类似\"public int[] twoSum(int[] nums, int target) {\""
			vscode.window.showInputBox({
				ignoreFocusOut: true,
				placeHolder: i18n.__('input method name'),
				validateInput: (input) => {
					//"不包含方法"
					if (!/\(.*?\)/.test(input)) {
						return i18n.__("not contain method error");
					}
					return undefined;
				}
			}).then((methodString) => {
				if (!methodString) {
					return;
				}
				createFile(title, methodString, leetcodePath, channel, (filePath) => {
					vscode.workspace.openTextDocument(filePath)
						.then(doc => {
							// 在VSCode编辑窗口展示读取到的文本
							vscode.window.showTextDocument(doc);
						}, err => { 
							channel.appendLine(`Open ${filePath} error, ${err}.`);
							console.log(`Open ${filePath} error, ${err}.`);
						})
				});
			})
		});
	}));

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
		channel.clear();
		let leetcodePath = getLeetCodePath();
		vscode.window.showInputBox({
			ignoreFocusOut: true,
			//"输入测试用例, 规则同leetcode, 以空格拆分"
			placeHolder: i18n.__('input test case'),
			value: preValue,
			valueSelection: (preValue ? [0, preValue.length] : undefined),
			//"复杂多个输入建议采用leetcode.txt文件输入参数"
			prompt: i18n.__('advice for muiltiple input'),
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
					//"括号匹配失败,检查一下或者试试leetcode.txt"
					return i18n.__("bracket error")
				}
				if (quot != 0) {
					//"引号匹配失败,检查一下或者试试leetcode.txt"
					return i18n.__("Quotation marks error")
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
			//"测试变量: "
			channel.appendLine(i18n.__('output test variable') + inputParamter);
			compile(leetcodePath, channel, (/** @type {string} */ className) => {
				let exdir = path.join(leetcodePath, ".\\classes");
				let commandParam = "compileAndRunDefault";
				let parameter = "\"" + commandParam + "\"" + " " + "\"" + className + "\"";
				for (let i of inputParamter) {
					//特殊字符修改
					parameter += " \"" + i.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + "\"";
					// console.log(i);
				}
				let runCmd = "java -cp " + "\"" + exdir + ";" + jarPath + "\\" + jarName + "\" Main " + parameter;
				let exec = require('child_process').exec;
				console.log(runCmd);
				exec(runCmd, { encoding: "binaryEncoding" }, function (error, stdout, stderr) {
					if (stderr&&stderr.length!=0) {
						console.log(decodeGBK(stderr));
						channel.appendLine(decodeGBK(stderr));
					}
					if (stdout&&stdout.length!=0) {
						console.log(decodeGBK(stdout));
						channel.appendLine(decodeGBK(stdout));
					}
					if (error) {
						console.log(decodeGBK(error));
						channel.appendLine(decodeGBK(error));
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
		channel.clear();
		let leetcodePath = getLeetCodePath();
		compile(leetcodePath, channel, (className) => {
			let commandParam = "compileAndRunTXT";
			let leetcodePath = getLeetCodePath();
			let exdir = path.join(leetcodePath, ".\\classes");
			let parameter = "\"" + commandParam + "\"" + " " + "\"" + className + "\"" + " " + "\"" + leetcodePath + "\"";
			let runCmd = "java -cp " + "\"" + exdir + ";" + jarPath + "\\" + jarName + "\" Main " + parameter;
			let exec = require('child_process').exec;
			console.log(runCmd);
			exec(runCmd, function (error, stdout, stderr) {
				if (stderr||stderr.length!=0) {
					console.log(decodeGBK(stderr));
					channel.appendLine(decodeGBK(stderr));
				}
				if (stdout||stdout.length!=0) {
					console.log(decodeGBK(stdout));
					channel.appendLine(decodeGBK(stdout));
				}
				if (error) {
					console.log(decodeGBK(error));
					channel.appendLine(decodeGBK(error));
				}
			});
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