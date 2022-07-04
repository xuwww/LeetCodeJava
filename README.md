# LeetCodeJava README

## Features

对于使用leetcode等刷题网站时遇到的不方便调试以及批量测试的问题而开发的小插件，能够通过输入实现自动创建类文件和代码框架，完成代码后能够通过命令自动调用当前方法并批量测试txt文件中的测试参数输出结果

1. 自动生成代码框架
2. 不需要写main函数即可实现运行代码函数
3. 对象转化不需要考虑转义字符，直接复制粘贴使用

For the use of leetcode and other brush site encountered when the problem of inconvenient debugging and batch testing and developed a small plug-in, through the input to achieve automatic creation of class files and code framework, after the completion of the code can automatically call the current method through the command and batch test txt file test parameters output results

1. automatically generate the code framework
2. do not need to write main function to run the code function
3. object conversion does not need to consider escape characters, directly copy and paste to use

---------------------------------------------------
## Requirements

需要环境变量中的JAVA_HOME的配置以及1.8及以上的jdk版本

Requires JAVA_HOME configuration in environment variable and jdk version 1.8 and above

---------------------------------------------------------
## Extension Settings

首次使用插件需要打开一个java文件或者使用快捷键 "ctrl+p"，输入>LeetCodeJava.start来启动插件

To use the plugin for the first time you need to open a java file or use the shortcut "ctrl+p" and type >LeetCodeJava.start to start the plugin

在用户设置中配置参数LeetCodeJava.dir，通过设置中搜索可以找到，参数表示希望生成的代码文件位置，默认为当前workspace路径，然后使用快捷键"ctrl+p"，输入>LeetCodeJava.init，就可以愉快玩耍了

Configure the parameter LeetCodeJava.dir in the user settings, which can be found by searching in the settings, the parameter indicates the location of the code file you wish to generate, the default is the current workspace path, then use the shortcut key "ctrl+p", enter > LeetCodeJava.init, and you can have fun!

当前版本实现的命令有以下几种

The current version implements the following commands

1. LeetCodeJava.createFile
    + 快捷键为ctrl+alt+Q (Shortcut keys are ctrl+alt+Q)
    + 通过输入类名，方法名后会在LeetCode.dir下生成代码文件 (By entering the class name and method name the code file will be generated under LeetCode.dir)
    + 推荐使用方法：复制leetcode题目名字作为类名输入，leetcode代码中方法行作为方法名输入 (Recommended method: Copy the leetcode title name and enter it as the class name, and enter the method line in the leetcode code as the method name)

1. LeetCodeJava.compileAndRunDefault
    + 快捷键为ctrl+alt+R (Shortcut keys are ctrl+alt+R)
    + 通过输入测试用例后为自动运行当前打开类中的静态方法，多个则运行第一个 (By entering a test case to automatically run the static methods in the currently opened class, multiple will run the first)
    + 输入测试用例的检测功能不够完善，如果希望测试的用例无法输入可以尝试compileAndRunTXT (The detection function of input test cases is not perfect, if you want to test cases that cannot be input you can try compileAndRunTXT)
    + 推荐使用方法：复制leetcode中的测试用例作为测试输入 (Recommended method: Copy the test cases from leetcode as test input)

2. LeetCodeJava.compileAndRunTXT
    + 快捷键为ctrl+alt+T (Shortcut keys are ctrl+alt+T)
    + 通过调用leetcode.txt文件中的测试用例进行批量测试 (Batch testing by calling the test cases in the leetcode.txt file)
    + 文件中一行作为一个参数的测试用例，如果输入n倍参数数量的用例则会测试n次 (A test case with one line as a parameter in the file will be tested n times if n times the number of parameters are entered)

-------------------------------------------------------------

## Other
+ 输入不需要考虑转义字符，以及合法问题，会自动检测
+ 用例输入以空格隔开，格式参考leetcode中格式，数组使用[]
+ 支持TreeNode和ListNode，但需要引入leetcode.TreeNode和leetcode.ListNode，建议自己实现
+ 如果发现有什么bug，或者想实现对于c、c艹、python、golong等语言支持，都可以联系我
+ 最后感谢@雪梦帮我画的logo
  
+ input does not need to consider escape characters, and legal issues, it is automatically detected
+ Use case input separated by spaces, refer to the format in leetcode, use [] for arrays
+ TreeNode and ListNode are supported, but you need to introduce leetcode.
+ If you find any bugs or want to implement support for c, c++, python, golong and other languages, you can contact me.
+ Finally, thanks to @snowmom for helping me draw the logo

--------------------------------------------------------------
### TODO
1. 完善对于各种少数不支持场景的功能，如：多线程，流程题目，循环链表等
2. 完善compileAndRunDefault中输入框检测，提供多个输入历史选择
3. 美化图标，美化介绍页面
4. 进一步简化配置方法，人人有功练

-
1. improve for a variety of a few unsupported scenarios, such as: multi-threaded, process topics, circular chain table, etc.
2. improve the input box detection in compileAndRunDefault, providing multiple input history options
3. beautify the icon, beautify the introduction page
4. further simplify the configuration method, everyone has the work practice

---------------------------------------------------------------
### For more information

* [github](https://github.com/xuwww/LeetCodeJava)
* [gitee](https://gitee.com/xuwww/leetcode-java)
* E-mail address: x1466267601@outlook.com
* qq : 1466267601


**Enjoy!**
