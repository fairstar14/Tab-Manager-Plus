# Tab Manager Plus - 中文化改造指引

## 项目概况
- 这是 Tab Manager Plus v6.0.0 的 Chrome 扩展源码(Manifest V3, React + TypeScript)
- 当前分支: `v6.0.0-cn` (基于 master)
- 项目无 i18n 架构，UI 文案全部硬编码在 tsx/ts 文件中

## 改造任务

### 第一步: 文案中文化
将所有面向用户的英文字符串替换为中文。需要中文化的文件（按字符串密度排序）:

1. **src/popup/views/Window.tsx** (~31处) - title 属性最多
2. **src/popup/views/TabOptions.tsx** (~18处) - 设置页面文案
3. **src/service_worker/ui/context_menus.ts** (~11处) - 右键菜单
4. **src/popup/views/TabManager.tsx** (~7处) - 主界面文案
5. **src/popup/views/Tab.tsx** - 可能有少量
6. **src/popup/views/Session.tsx** - 可能有少量
7. **src/helpers/utils.ts** - `maybePluralize` 函数(复数后缀 's')

#### 中文化规则
- **改**: 用户可见的文案字符串(title="...", placeholder="...", JSX文本节点, h4/h3内容, option-description文本)
- **不改**: 
  - 变量名/函数名/类名
  - CSS class 名
  - `src/strings/strings.ts` 里的 command 常量(这些是内部标识符不是文案)
  - import 语句
  - 注释(除非用户可见)
  - URL 链接
  - emoji 图标
- **翻译风格**: 简洁、符合中文 UI 习惯。例如:
  - "Open a new tab" → "打开新标签页"
  - "Change window name or color" → "更改窗口名称或颜色"
  - "Start typing to search tabs..." → "输入以搜索标签页..."
  - "Highlight Duplicates" → "高亮重复标签"
  - "Minimized windows" → "已最小化的窗口"
  - "Saved windows" → "已保存的窗口"
  - "Tab options" → "标签页选项"
  - "Popup size" → "弹窗大小"
  - "Window style" → "窗口样式"
  - "Dark mode" → "深色模式"
  - "Compact mode" → "紧凑模式"
  - "Animations" → "动画效果"
  - "Window titles" → "窗口标题"
  - "Session Management" → "会话管理"
  - "Save Windows for Later" → "保存窗口供以后使用"
  - "Popup icon" → "弹窗图标"
  - "Count Tabs" → "显示标签数"
  - "Open in own Tab by default" → "默认在独立标签页打开"
  - "Window settings" → "窗口设置"
  - "Minimize inactive windows" → "自动最小化非活动窗口"
  - "Show action buttons" → "显示操作按钮"
  - "Advanced settings" → "高级设置"
  - "Allow in Incognito" → "允许在隐身模式中使用"
  - "Change shortcut key" → "更改快捷键"
  - "Right mouse button" → "鼠标右键"
  - "Middle mouse button" → "鼠标中键"
  - "[Enter / Return] button" → "[Enter / 回车] 键"
  - "Donate a Coffee" → "赞助"
  - "Rate Tab Manager Plus" → "评价 Tab Manager Plus"
  - "Options" → "选项"
  - "Open in own tab" → "在独立标签页打开"
  - "Open popup" → "打开弹窗"
  - "Open sidebar" → "打开侧边栏"
  - "Support this extension" → "支持此扩展"
  - "Leave a review" → "评价"
  - "Donate to keep Extensions Alive" → "赞助支持扩展开发"
  - "Become a Patron" → "成为赞助者"
  - "Follow on Twitter" → "在 Twitter 上关注"
  - "Issues and Suggestions" → "问题与建议"
  - "View recent changes" → "查看最近更新"
  - "Edit Options" → "编辑选项"
  - "View source code" → "查看源码"
  - "Report an issue" → "报告问题"
  - "Send a suggestion" → "发送建议"
  - "Limit Tabs Per Window" → "每窗口标签上限"
  - "Popup Width" → "弹窗宽度"
  - "Popup Height" → "弹窗高度"
  - "Export/Backup Sessions" → "导出/备份会话"
  - "Import/Restore Sessions" → "导入/恢复会话"
  - "Name the window" → "命名窗口"
  - "Pick a color" → "选择颜色"
  - "Change background color" → "更改背景颜色"
  - "No duplicates found" → "未找到重复标签"
  - "Highlighted X duplicate tabs" → "已高亮 X 个重复标签"
  - "Press enter to move them to a new window" → "按回车键将它们移到新窗口"
  - "Close selected tabs" → "关闭选中标签"
  - "Close current Tab" → "关闭当前标签"
  - "Discard selected tabs" → "挂起选中标签"
  - "Select tabs to discard them and free memory" → "选中标签以挂起并释放内存"
  - "Pin selected tabs" → "固定选中标签"
  - "Pin current Tab" → "固定当前标签"
  - "Move tabs to new window" → "将标签移到新窗口"
  - "Open new empty window" → "打开空白窗口"
  - "Change to X View" → "切换到 X 视图"
  - "Save this window for later" → "保存此窗口供以后使用"
  - "Maximize this window" → "最大化此窗口"
  - "Minimize this window" → "最小化此窗口"
  - "Close this window" → "关闭此窗口"
  - "Change the name of this window" → "更改此窗口名称"
  - "Name window..." → "命名窗口..."
  - "tabs that do not match search" → "不匹配搜索的标签"
  - "Turn off hiding of" → "停止隐藏"
  - "Hide" → "隐藏"
  - "Will reveal" → "将显示"
  - "Will hide" → "将隐藏"
  - "Will close" → "将关闭"
  - "Will save" → "将保存"
  - "Will move" → "将移动"
  - "Will maximize" → "将最大化"
  - "Will minimize" → "将最小化"
  - "Will pin" → "将固定"
  - "Will discard" → "将挂起"

#### maybePluralize 处理
`maybePluralize(count, noun, suffix='s')` 用于英文复数。中文化后不需要复数后缀。
- 改 maybePluralize 的默认 suffix 为空字符串 `''`(中文没有复数)
- 或者在使用 maybePluralize 的地方，把英文 noun 改成中文（如 'tab' → '个标签', 'window' → '个窗口', 'selected tab' → '个选中标签'）

### 第二步: 分组高亮改造（后续单独执行）

### 第三步: 清理赞助项 + README（后续单独执行）

## 构建验证
- TypeScript 检查: `npx tsc --noEmit`
- 构建: `npm run build`（输出到 dist/）
- 构建成功 = 无 TypeScript 错误 + dist/ 更新

## 注意事项
- 改完每个文件后立即跑 `npx tsc --noEmit` 验证类型
- 不要修改 `dist/` 目录（那是构建产物）
- 保持代码格式（tab 缩进）一致
- emoji 前缀保留（如 "📔 Open in own tab" → "📔 在独立标签页打开"）
