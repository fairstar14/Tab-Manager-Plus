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
- 20 色半透明色板循环，每组显示数字角标（居中上方）
- 不隐藏非重复标签，不影响选中态，不移动标签位置
- 3-pass 算法：计数 → 仅重复标签从1连续编号 → 分配颜色

### 3. 连线重复标签（连连看效果）🔗
- 点击工具栏 🔗 按钮开启/关闭连线模式
- 同组重复标签之间画**连连看风格 U 形直角折线**（右→下→左，最多2个拐点）
- 从标签右边缘出发，向右绕行，不穿过标签本体
- 每条线的偏移量递增（20px 步进），扇形展开互不重叠
- 10 色调色板，与分组高亮颜色对应
- 拐角圆角处理（stroke-linejoin: round）
- 独立开关，需先开启分组高亮

### 4. 三模式搜索
- 原版仅支持标题+地址混合搜索
- 新增下拉选择：混合 / 仅标题 / 仅地址
- 搜索框 flex 布局，下拉框与输入框同行排列

### 5. 清理赞助项
- 移除右键菜单中的赞助/评价/Twitter 关注项
- 移除工具栏的赞助按钮
- 源码链接指向 Fork 仓库

## 安装

1. 下载或 clone 本仓库
2. 运行 `npm install` 安装依赖
3. 运行 `node build.mjs` 编译（注意：不用 `npm run build`，tsc 有预存类型错误）
4. Chrome 打开 `chrome://extensions`，开启开发者模式
5. "加载已解压的扩展程序" → 选择**项目根目录**（非 dist/）

> manifest.json 在项目根目录，CSS/图片/HTML 也在根目录，dist/ 只含编译后的 JS。

## 构建说明

```bash
npm install      # 安装依赖
node build.mjs   # esbuild 编译，3 个入口点（popup/service_worker/options）
```

- 编译后中文在 dist/ 中显示为 `\uXXXX` unicode escape，这是 esbuild 默认行为，浏览器运行时正常解码
- tsc 有 2 个预存类型错误（`onMessage.addListener` Promise 不匹配），master 分支也有，不影响运行

## 技术细节

| 改动 | 关键文件 | 说明 |
|------|---------|------|
| 中文化 | `src/popup/views/*.tsx` | 7 个文件，~199 处文案 |
| 分组高亮 | `TabManager.tsx` highlightDuplicates() | 3-pass 算法 |
| 连线 | `TabManager.tsx` drawConnectLines() | SVG overlay，U 形 path |
| 三模式搜索 | `TabManager.tsx` search() | searchMode state |
| 赞助清理 | `context_menus.ts` + `strings.ts` | 删菜单项+常量 |

## 致谢

- 原项目：[Tab Manager Plus](https://github.com/stefanXO/Tab-Manager-Plus) by stefanXO
- 本 Fork 基于 v6.0.0 定制

## License

MIT
