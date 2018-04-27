# 基于vue实现的纯前端页面
## 后台详见仓库：http://github.comm/yaolynzc/packeep-b.git
## 主要框架如下：
## node.js + vue.js + vue-router + axios + elementui
## 问题记录：
### 1、axios的post请求参数被格式化为json进行提交，header中的content-type=application/json
### 根据官方github解决方案：引入“qs”或者“querystring”包格式化参数后进行提交即可。
