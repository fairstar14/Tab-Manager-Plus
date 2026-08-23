# Tab Manager Plus - 中文 Fork

基于 [Tab Manager Plus](https://github.com/stefanXO/Tab-Manager-Plus) v6.0.0 的中文定制版。

## 改动内容

### 1. 界面中文化
- 所有面向用户的英文文案替换为中文（约200处）
- 右键菜单、设置页、工具栏提示、状态栏文案全部中文化
- emoji 图标保留，变量名/CSS class/URL 未改动

### 2. 分组高亮重复标签
- 原"高亮重复"功能从"选中+隐藏非重复"改为"分组高亮"
- 相同 URL（忽略 #hash）的标签用相同颜色标记
- 20 色半透明色板循环，每组显示数字角标
- 不隐藏非重复标签，不影响选中态，不移动标签位置
- 算法从 O(n²) 优化为 O(n)

### 3. 清理赞助项
- 移除右键菜单中的赞助/评价/Twitter 关注项
- 移除工具栏的赞助按钮
- 源码链接指向 Fork 仓库

## 安装

1. 下载或 clone 本仓库
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 构建（或 `node build.mjs` 跳过 tsc）
4. Chrome 打开 `chrome://extensions/`，开启开发者模式
5. 点击"加载已解压的扩展程序"，选择项目 `dist` 目录

## 技术栈

- Manifest V3
- React + TypeScript
- esbuild 打包

## 许可证

MPLv2（继承上游）
