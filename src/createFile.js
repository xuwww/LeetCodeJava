const path = require('path');
const fs = require('fs');

//TODO error处理
//TODO Thenable<T>
exports.createFile = function(/** @type {string} */ title, /** @type {string} */ methodString, /** @type {string} */ leetcodePath, /** @type {{ show: (arg0: boolean) => void; appendLine: (arg0: string) => void; }} */ channel, /** @type {(arg0: string) => void} */ then) {
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
        blank["index"] = -1;
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