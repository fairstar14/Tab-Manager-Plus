"use strict";

import * as React from "react";
import * as browser from 'webextension-polyfill';
import { ITabOptions, ITabOptionsState } from "@types";

export class TabOptions extends React.Component<ITabOptions, ITabOptionsState> {
	constructor(props : ITabOptions) {
		super(props);
		this.state = {};
	}
	logo() {
		return (
			<div className="logo-options" key="logo">
				<div className="logo-box">
					<img src="images/browsers.svg" style={{maxWidth: "3rem"}} alt="Tab Manager Plus"/>
					<h2 key="title">Tab Manager Plus {window.extensionVersion}</h2>
				</div>
			</div>
		);
	}

	optionsSection() {
		return (
			<div className="toggle-options" key="options">
				<div className="optionsBox">
					<h4>标签页选项</h4>
					<div className="toggle-box">
						<input
							type="number"
							onMouseEnter={this.props.tabLimitText}
							onChange={this.props.changeTabLimit}
							value={this.props.tabLimit}
							id="enable_tabLimit"
							name="enable_tabLimit"
						/>
						<label onMouseEnter={this.props.tabLimitText} htmlFor="enable_tabLimit" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						<label className="textlabel" htmlFor="enable_tabLimit" style={{ textAlign: "", whiteSpace: "pre", lineHeight: "2rem" }}>
							每窗口标签上限
						</label>
						<div className="option-description">
							当标签数达到此数值时，Tab Manager 会将新标签移到新窗口。再也不会有 60 个标签的窗口了！
							<br />
							<i>默认值：0（已禁用）</i>
							<br />
							<i>建议值：15</i>
						</div>
					</div>
				</div>
				<div className="optionsBox">
					<h4>弹窗大小</h4>
					<div className="option-description">
						你可以在此调整弹窗大小，最大为 800x600。这是浏览器的限制，因此无法显示更大的弹窗。如果你想要更好的概览，可以右键点击 Tab Manager Plus 图标并选择"在独立标签页打开"，这将在新标签页中打开 Tab Manager。
					</div>
					<div className="toggle-box half-size float-right">
						<label className="textlabel" htmlFor="enable_tabWidth" style={{ textAlign: "", whiteSpace: "pre", lineHeight: "2rem" }}>
							弹窗宽度
						</label>
						<input
							type="number"
							min="450"
							max="800"
							step="25"
							onMouseEnter={this.props.tabWidthText}
							onChange={this.props.changeTabWidth}
							value={this.props.tabWidth}
							id="enable_tabWidth"
							name="enable_tabWidth"
						/>
						<label onMouseEnter={this.props.tabWidthText} htmlFor="enable_tabWidth" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
					</div>
					<div className="toggle-box half-size">
						<label className="textlabel" htmlFor="enable_tabHeight" style={{ textAlign: "", whiteSpace: "pre", lineHeight: "2rem" }}>
							弹窗高度
						</label>
						<input
							type="number"
							min="400"
							max="600"
							step="25"
							onMouseEnter={this.props.tabHeightText}
							onChange={this.props.changeTabHeight}
							value={this.props.tabHeight}
							id="enable_tabHeight"
							name="enable_tabHeight"
						/>
						<label onMouseEnter={this.props.tabHeightText} htmlFor="enable_tabHeight" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
					</div>
				</div>
				<div className="optionsBox">
					<h4>窗口样式</h4>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.darkText}
								onChange={this.props.toggleDark}
								checked={this.props.dark}
								id="dark_mode"
								name="dark_mode"
							/>
							<label onMouseEnter={this.props.darkText} htmlFor="dark_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="dark_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							深色模式
						</label>
						<div className="option-description">
							深色模式，适合夜间使用。 <br />
							<i>默认值：已禁用</i>
						</div>
					</div>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.compactText}
								onChange={this.props.toggleCompact}
								checked={this.props.compact}
								id="compact_mode"
								name="compact_mode"
							/>
							<label onMouseEnter={this.props.compactText} htmlFor="compact_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="compact_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							紧凑模式
						</label>
						<div className="option-description">
							节省图标周围的少量空间。美观度略降，但更节省空间。 <br />
							<i>默认值：已禁用</i>
						</div>
					</div>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.animationsText}
								onChange={this.props.toggleAnimations}
								checked={this.props.animations}
								id="enable_animations"
								name="enable_animations"
							/>
							<label onMouseEnter={this.props.animationsText} htmlFor="enable_animations" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="enable_animations" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							动画效果
						</label>
						<div className="option-description">
							禁用/启用弹窗中的动画和过渡效果。 <br />
							<i>默认值：已启用</i>
						</div>
					</div>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.windowTitlesText}
								onChange={this.props.toggleWindowTitles}
								checked={this.props.windowTitles}
								id="enable_windowTitles"
								name="enable_windowTitles"
							/>
							<label onMouseEnter={this.props.windowTitlesText} htmlFor="enable_windowTitles" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="enable_windowTitles" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							窗口标题
						</label>
						<div className="option-description">
							禁用/启用窗口标题。 <br />
							<i>默认值：已启用</i>
						</div>
					</div>
				</div>
				<div className="optionsBox">
					<h4>会话管理</h4>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.sessionsText}
								onChange={this.props.toggleSessions}
								checked={this.props.sessionsFeature}
								id="session_mode"
								name="session_mode"
							/>
							<label onMouseEnter={this.props.sessionsText} htmlFor="session_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="session_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							保存窗口供以后使用
						</label>
						<div className="option-description">
							允许你将窗口保存为会话（已保存的窗口）。以后可以恢复这些已保存的窗口。恢复的窗口不会恢复历史记录。此功能目前为测试版。
							<br />
							<i>默认值：已禁用（实验性功能）</i>
						</div>
					</div>
					{this.props.sessionsFeature && <div className="toggle-box">
						<div className="toggle-box">
							<label className="textlabel" htmlFor="session_export" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
								<h4>导出/备份会话</h4>
							</label>
							<button type="button" onMouseEnter={this.props.exportSessionsText} onClick={this.props.exportSessions} id="session_export" name="session_export">
								导出/备份会话
							</button>
							<label onMouseEnter={this.props.exportSessionsText} htmlFor="session_export" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<div className="option-description">允许你将已保存的窗口备份到外部文件。</div>
					</div>}
					{this.props.sessionsFeature && <div className="toggle-box">
						<div className="toggle-box">
							<label className="textlabel" htmlFor="session_import" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
								<h4>导入/恢复会话</h4>
							</label>
							<input
								type="file"
								accept="application/json"
								onMouseEnter={this.props.importSessionsText}
								onChange={this.props.importSessions}
								id="session_import"
								name="session_import"
								placeholder="导入/恢复会话"
							/>
							<label onMouseEnter={this.props.importSessionsText} htmlFor="session_import" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<div className="option-description">
							允许你从外部文件恢复备份。恢复的窗口将添加到当前已保存的窗口中。
						</div>
					</div>}
				</div>
				<div className="optionsBox">
					<h4>弹窗图标</h4>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.badgeText}
								onChange={this.props.toggleBadge}
								checked={this.props.badge}
								id="badge_mode"
								name="badge_mode"
							/>
							<label onMouseEnter={this.props.badgeText} htmlFor="badge_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="badge_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							显示标签数
						</label>
						<div className="option-description">
							在浏览器右上角的 Tab Manager 图标上显示打开的标签数。
							<br />
							<i>默认值：已启用</i>
						</div>
					</div>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.openInOwnTabText}
								onChange={this.props.toggleOpenInOwnTab}
								checked={this.props.openInOwnTab}
								id="openinowntab_mode"
								name="openinowntab_mode"
							/>
							<label onMouseEnter={this.props.openInOwnTabText} htmlFor="openinowntab_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="openinowntab_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							默认在独立标签页打开
						</label>
						<div className="option-description">
							默认在独立标签页中打开 Tab Manager，而不是弹窗。
							<br />
							<i>默认值：已禁用</i>
						</div>
					</div>
				</div>
				<div className="optionsBox">
					<h4>窗口设置</h4>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.hideText}
								onChange={this.props.toggleHide}
								checked={this.props.hideWindows}
								id="auto_hide"
								name="auto_hide"
							/>
							<label onMouseEnter={this.props.hideText} htmlFor="auto_hide" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="auto_hide" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							自动最小化非活动窗口
						</label>
						<div className="option-description">
							启用此选项后，每个显示器始终只保留一个打开的窗口。切换到其他窗口时，其余窗口会自动最小化到任务栏。
							<br />
							<i>默认值：已禁用</i>
						</div>
					</div>
					<div className="toggle-box">
						<div className="toggle">
							<input
								type="checkbox"
								onMouseEnter={this.props.tabActionsText}
								onChange={this.props.toggleTabActions}
								checked={this.props.tabactions}
								id="tabactions_mode"
								name="tabactions_mode"
							/>
							<label onMouseEnter={this.props.tabActionsText} htmlFor="tabactions_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }} />
						</div>
						<label className="textlabel" htmlFor="tabactions_mode" style={{ whiteSpace: "pre", lineHeight: "2rem" }}>
							显示操作按钮
						</label>
						<div className="option-description">
							在每个窗口中显示按钮：打开新标签页、最小化窗口、为窗口指定颜色和关闭窗口。
							<br />
							<i>默认值：已启用</i>
						</div>
					</div>
				</div>
				<div className="optionsBox">
					<h4>高级设置</h4>
					<div className="toggle-box">
						<div className="toggle-box">
							<a href="#" onClick={this.openIncognitoOptions}>
								允许在隐身模式中使用
							</a>
						</div>
						<div className="option-description">
							如果你还想在 Tab Manager 概览中查看隐身标签页，请为此扩展启用隐身访问权限。
						</div>
					</div>
					<div className="toggle-box">
						<a href="#" onClick={this.openShortcuts}>
							更改快捷键
						</a>
						<div className="option-description">如果你想禁用或更改打开 Tab Manager Plus 的快捷键，可以在此处修改。</div>
					</div>
				</div>
				<div className="optionsBox">
					<div className="toggle-box">
						<h4>鼠标右键</h4>
						<div className="option-description">使用鼠标右键可以选择标签</div>
						<h4>Shift+鼠标右键</h4>
						<div className="option-description">
							按住 Shift 并点击鼠标右键，可以选择上次选中的标签与当前标签之间的所有标签
						</div>
						<h4>鼠标中键</h4>
						<div className="option-description">使用鼠标中键可以关闭标签</div>
						<h4>[Enter / 回车] 键</h4>
						<div className="option-description">
							按回车键可以切换到当前选中的标签，或将多个选中的标签移到新窗口
						</div>
					</div>
				</div>
			</div>
		);
	}
	async openIncognitoOptions() {
		await browser.tabs.create({
			url: "chrome://extensions/?id=cnkdjjdmfiffagllbiiilooaoofcoeff"
		});
	}
	async openShortcuts() {
		await browser.tabs.create({ url: "chrome://extensions/shortcuts" });
	}
	licenses() {
		return (
			<div className="licenses" key="licenses">
				<div className="license">
					Tab Manager Plus 基于{" "}
					<a href="https://github.com/dsc/Tab-Manager" target="_blank" title="Tab-Manager">
						dsc/Tab-Manager
					</a>
					,{" "}
					<a href="https://github.com/joshperry/Tab-Manager" target="_blank" title="Tab-Manager">
						joshperry/Tab-Manager
					</a>{" "}
					和{" "}
					<a href="https://github.com/JonasNo/Tab-Manager" target="_blank" title="Tab-Manager">
						JonasNo/Tab-Manager
					</a>
					.<br />
					授权协议：{" "}
					<a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" title=" Mozilla Public License (MPL)">
						MPLv2
					</a>
					. 图标作者：{" "}
					<a href="http://www.freepik.com" title="Freepik">
						Freepik
					</a>{" "}
					来源：{" "}
					<a href="http://www.flaticon.com" title="Flaticon">
						www.flaticon.com
					</a>
					. 授权协议：{" "}
					<a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" title="Creative Commons BY 3.0">
						CC 3.0 BY
					</a>
					.
				</div>
			</div>
		);
	}
	render() {
		var children = [];

		children.push(this.logo());
		children.push(this.optionsSection());
		children.push(<div className="clearfix" key="clear_fix" />);
		//children.push(React.createElement('h4', {}, this.props.getTip()));
		children.push(this.licenses());

		return (
			<div className="options-window" key="options_window">
				<div key="options_content">{children}</div>
			</div>
		);
	}
}