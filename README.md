# LeetCodeJava README

## Features

对于使用leetcode等刷题网站时遇到的不方便调试以及批量测试的问题而开发的小插件，能够通过编写txt文件实现自动创建类文件和代码框架，并且完成代码后能够通过快捷键自动调用当前方法并测试txt文件中的测试参数输出结果

## Requirements

需要环境变量中的JAVA_HOME的配置以及1.8以上的jdk版本

## Extension Settings

使用插件是首先需要使用快捷键 "ctrl+p"，输入LeetCodeJava.start来启动插件

第一次使用需要在用户设置中配置两个参数LeetCodeJava.dir和LeetCodeJava.jar，通过设置中搜索可以找到

分别是使用者期望文件生成的绝对路径以及jar包存放的绝对路径(不含文件名)，后续使用参数代指地址

当前版本较低，实现的功能比较简单，需要在LeetCodeJava.dir下手动建立leetcode.txt文件，以及从github上下载resource下的jar包。

leetcode.txt中的数据从上到下为
+ 用户希望创建的文件/类名( 如 Two Sum
+ 方法名( 如 public String solution(String[] s) {
+ 需要测试的参数(如 ["123","234","1234"])

快捷键ctrl+alt+Q会生成文件名合法化的代码框架
快捷键ctrl+alt+R能够将当前文件中的方法调用测试参数运行，并打印输出结果

### For more information

* [github地址](https://github.com/xuwww/LeetCodeJava)
* 邮箱地址:x1466267601@outlook.com

**Enjoy!**
