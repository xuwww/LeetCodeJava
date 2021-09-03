const vscode = require('vscode');

exports.getLeetCodePath = function(){
    let leetcodePath = vscode.workspace.getConfiguration().get("LeetCodeJava.dir");
		if (!leetcodePath || leetcodePath == "the first workspaceFolder" || leetcodePath == "null") {
			vscode.window.showWarningMessage("parameter LeetCodeJava.dir is default, not recommend!")
			let folders = vscode.workspace.workspaceFolders.map(item => item.uri.path);
			leetcodePath = folders[0].substr(1);
		}
		return leetcodePath;
};