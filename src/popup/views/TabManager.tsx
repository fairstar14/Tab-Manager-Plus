import {getLocalStorage, setLocalStorage} from "@helpers/storage";
import {debounce, maybePluralize} from "@helpers/utils";
import {Window, Session, TabOptions, Tab} from "@views";
import * as React from "react";
import * as S from "@strings";
import * as browser from 'webextension-polyfill';
import {ICommand, ITabManager, ITabManagerState, ISavedSession} from "@types";

const {setTimeout, clearTimeout} = window

export class TabManager extends React.Component<ITabManager, ITabManagerState> {
	constructor(props : ITabManager) {
		super(props);

		let layout = "blocks";
		let animations = true;
		let windowTitles = true;
		let compact = false;
		let dark = false;
		let tabactions = true;
		let badge = true;
		let sessionsFeature = false;
		let hideWindows = false;
		let filterTabs = false;
		let tabLimit = 0;
		let openInOwnTab = false;
		let tabWidth = 800;
		let tabHeight = 600;

		let resetTimeout = -1;
		// var closeTimeout;

		this.state = {
			layout: layout,
			animations: animations,
			windowTitles: windowTitles,
			tabLimit: tabLimit,
			openInOwnTab: openInOwnTab,
			tabWidth: tabWidth,
			tabHeight: tabHeight,
			compact: compact,
			dark: dark,
			tabactions: tabactions,
			badge: badge,
			hideWindows: hideWindows,
			sessionsFeature: sessionsFeature,
			lastOpenWindow: -1,
			windows: [],
			sessions: [],
			selection: new Set(),
			lastSelect: 0,
			hiddenTabs: new Set(),
			dupGroups: new Map(),
			tabsbyid: new Map(),
			windowsbyid: new Map(),
			resetTimeout: resetTimeout,
			height: 600,
			hasScrollBar: false,
			focusUpdates: 0,
			topText: "",
			bottomText: "",
			lastDirection: "",
			optionsActive: !!this.props.optionsActive,
			filterTabs: filterTabs,
			dupTabs: false,
			dragFavicon: "",
			colorsActive: 0,

			connectLines: false,
			connectLinesData: [] as Array<{ x1: number; y1: number; x2: number; y2: number; group: number }>,
			connectLinesColors: [] as string[],

			tabCount: 0,
			hiddenCount: 0,
			searchLen: 0,
			searchMode: "mixed"
		};

		this.addWindow = this.addWindow.bind(this);
		this.animationsText = this.animationsText.bind(this);
		this.badgeText = this.badgeText.bind(this);
		this.changelayout = this.changelayout.bind(this);
		this.changeTabHeight = this.changeTabHeight.bind(this);
		this.changeTabLimit = this.changeTabLimit.bind(this);
		this.changeTabWidth = this.changeTabWidth.bind(this);
		this.checkKey = this.checkKey.bind(this);
		this.clearSelection = this.clearSelection.bind(this);
		this.compactText = this.compactText.bind(this);
		this.darkText = this.darkText.bind(this);
		this.deleteTabs = this.deleteTabs.bind(this);
		this.drawConnectLines = this.drawConnectLines.bind(this);
		this.discardTabs = this.discardTabs.bind(this);
		this.exportSessions = this.exportSessions.bind(this);
		this.exportSessionsText = this.exportSessionsText.bind(this);
		this.getTip = this.getTip.bind(this);
		this.hideText = this.hideText.bind(this);
		this.highlightDuplicates = this.highlightDuplicates.bind(this);
		this.hoverIcon = this.hoverIcon.bind(this);
		this.importSessions = this.importSessions.bind(this);
		this.importSessionsText = this.importSessionsText.bind(this);
		this.openInOwnTabText = this.openInOwnTabText.bind(this);
		this.pinTabs = this.pinTabs.bind(this);
		this.rateExtension = this.rateExtension.bind(this);
		this.scrollTo = this.scrollTo.bind(this);
		this.search = this.search.bind(this);
		this.changeSearchMode = this.changeSearchMode.bind(this);
		this.sessionsText = this.sessionsText.bind(this);
		this.sessionSync = this.sessionSync.bind(this);
		this.tabActionsText = this.tabActionsText.bind(this);
		this.tabHeightText = this.tabHeightText.bind(this);
		this.tabLimitText = this.tabLimitText.bind(this);
		this.tabWidthText = this.tabWidthText.bind(this);
		this.toggleAnimations = this.toggleAnimations.bind(this);
		this.toggleBadge = this.toggleBadge.bind(this);
		this.toggleCompact = this.toggleCompact.bind(this);
		this.toggleConnectLines = this.toggleConnectLines.bind(this);
		this.toggleDark = this.toggleDark.bind(this);
		this.toggleFilterMismatchedTabs = this.toggleFilterMismatchedTabs.bind(this);
		this.toggleHide = this.toggleHide.bind(this);
		this.toggleOpenInOwnTab = this.toggleOpenInOwnTab.bind(this);
		this.toggleOptions = this.toggleOptions.bind(this);
		this.toggleSessions = this.toggleSessions.bind(this);
		this.toggleTabActions = this.toggleTabActions.bind(this);
		this.toggleWindowTitles = this.toggleWindowTitles.bind(this);
		this.update = this.update.bind(this);
		this.windowTitlesText = this.windowTitlesText.bind(this);
		this.onTabDetached = this.onTabDetached.bind(this);
		this.onTabAttached = this.onTabAttached.bind(this);
		this.onTabRemoved = this.onTabRemoved.bind(this);
		this.onTabCreated = this.onTabCreated.bind(this);
		this.dirtyWindow = this.dirtyWindow.bind(this);
	}
	UNSAFE_componentWillMount() {
		this.update();
	}

	async loadStorage() {
		var layout = "blocks";
		var animations = true;
		var windowTitles = true;
		var compact = false;
		var dark = false;
		var tabactions = true;
		var badge = true;
		var sessionsFeature = false;
		var hideWindows = false;
		var filterTabs = false;
		var tabLimit = 0;
		var openInOwnTab = false;
		var tabWidth = 800;
		var tabHeight = 600;

		var storage = await browser.storage.local.get(null);

		if (!storage["layout"]) storage["layout"] = layout;
		if (typeof storage["tabLimit"] === "undefined") storage["tabLimit"] = tabLimit;
		if (typeof storage["tabWidth"] === "undefined") storage["tabWidth"] = tabWidth;
		if (typeof storage["tabHeight"] === "undefined") storage["tabHeight"] = tabHeight;

		if (typeof storage["animations"] === "undefined") storage["animations"] = animations;
		if (typeof storage["windowTitles"] === "undefined") storage["windowTitles"] = windowTitles;
		if (typeof storage["tabactions"] === "undefined") storage["tabactions"] = tabactions;
		if (typeof storage["badge"] === "undefined") storage["badge"] = badge;

		if (typeof storage["openInOwnTab"] === "undefined") storage["openInOwnTab"] = openInOwnTab;
		if (typeof storage["compact"] === "undefined") storage["compact"] = compact;
		if (typeof storage["dark"] === "undefined") storage["dark"] = dark;
		if (typeof storage["sessionsFeature"] === "undefined") storage["sessionsFeature"] = sessionsFeature;
		if (typeof storage["hideWindows"] === "undefined") storage["hideWindows"] = hideWindows;
		if (typeof storage["filter-tabs"] === "undefined") storage["filter-tabs"] = filterTabs;

		storage["version"] = window.extensionVersion;

		await browser.storage.local.set(storage);

		layout = storage["layout"] as string;
		tabLimit = storage["tabLimit"] as number;
		tabWidth = storage["tabWidth"] as number;
		tabHeight = storage["tabHeight"] as number;
		openInOwnTab = storage["openInOwnTab"] as boolean;
		animations = storage["animations"] as boolean;
		windowTitles = storage["windowTitles"] as boolean;
		compact = storage["compact"] as boolean;
		dark = storage["dark"] as boolean;
		tabactions = storage["tabactions"] as boolean;
		badge = storage["badge"] as boolean;
		sessionsFeature = storage["sessionsFeature"] as boolean;
		hideWindows = storage["hideWindows"] as boolean;
		filterTabs = storage["filter-tabs"] as boolean;

		if (dark) {
			document.body.className = "dark";
		} else {
			document.body.className = "";
		}

		this.setState({
			layout: layout,
			animations: animations,
			windowTitles: windowTitles,
			tabLimit: tabLimit,
			openInOwnTab: openInOwnTab,
			tabWidth: tabWidth,
			tabHeight: tabHeight,
			compact: compact,
			dark: dark,
			tabactions: tabactions,
			badge: badge,
			hideWindows: hideWindows,
			sessionsFeature: sessionsFeature,
			filterTabs: filterTabs
		});
	}

	hoverHandler(tab : browser.Tabs.Tab) {
		this.setState({ topText: tab.title || "" });
		this.setState({ bottomText: tab.url || tab.pendingUrl || "" });
		// clearTimeout(this.state.closeTimeout);
		// this.state.closeTimeout = setTimeout(function () {
		//  window.close();
		// }, 100000);
		var _reset_timeout = this.state.resetTimeout;
		clearTimeout(_reset_timeout);
		_reset_timeout = setTimeout(
			function() {
				this.setState({ topText: "", bottomText: "" });
				this.update();
			}.bind(this),
			15000
		);
		this.setState({resetTimeout: _reset_timeout});
		//this.update();
	}
	hoverIcon(e : React.MouseEvent<HTMLDivElement> | string) {
		var text = "";
		if (typeof (e) === "string") {
			text = e;
		} else {
			if (e && e.nativeEvent) {
				e.nativeEvent.preventDefault();
				e.nativeEvent.stopPropagation();
			}

			if (e && e.target && !!(e.target as HTMLDivElement).title) {
				text = (e.target as HTMLDivElement).title;
			}
		}

		var bottom = " ";
		if (text.indexOf("\n") > -1) {
			var a = text.split("\n");
			text = a[0];
			bottom = a[1];
		}
		this.setState({ topText: text });
		this.setState({ bottomText: bottom });
		//this.update();
		this.forceUpdate();
	}
	render() {
		let _this = this;

		// let hiddenCount = this.state.hiddenCount || 0;
		let tabCount = this.state.tabCount;

		let haveMin = false;
		let haveSess = false;

		for (let i = this.state.windows.length - 1; i >= 0; i--) {
			if (this.state.windows[i].state === "minimized") haveMin = true;
		}

		if (this.state.sessionsFeature) {
			if (this.state.sessions.length > 0) haveSess = true;
			// disable session window if we have filtering enabled
			// and filter active
			if (haveSess && this.state.filterTabs) {
				if (this.state.searchLen > 0 || this.state.hiddenTabs.size > 0) {
					haveSess = false;
				}
			}
		}

		return (
			<div
				id="root"
				className={
					(this.state.compact ? "compact" : "") +
					" " +
					(this.state.animations ? "animations" : "no-animations") +
					" " +
					(this.state.windowTitles ? "windowTitles" : "no-windowTitles")
				}
				onKeyDown={this.checkKey}
				ref="root"
				tabIndex={0}
			>
				{!this.state.optionsActive && <div className={"window-container " + this.state.layout} ref="windowcontainer" tabIndex={2}>
					{this.state.windows.map(function(window : browser.Windows.Window) {
						if (window.state === "minimized") return;
						if (!!this.state.colorsActive && this.state.colorsActive !== window.id) return;
						return (
							<Window
								key={"window" + window.id}
								window={window}
								tabs={window.tabs}
								incognito={window.incognito}
								layout={_this.state.layout}
								selection={_this.state.selection}
								searchActive={_this.state.searchLen > 0}
								sessionsFeature={_this.state.sessionsFeature}
								tabactions={_this.state.tabactions}
								hiddenTabs={_this.state.hiddenTabs}
								filterTabs={_this.state.filterTabs}
								dupGroups={_this.state.dupGroups}
				dupTabs={_this.state.dupTabs}
								hoverHandler={_this.hoverHandler.bind(_this)}
								scrollTo={_this.scrollTo.bind(_this)}
								hoverIcon={_this.hoverIcon.bind(_this)}
								parentUpdate={_this.update.bind(_this)}
								toggleColors={_this.toggleColors.bind(_this)}
								tabMiddleClick={_this.deleteTab.bind(_this)}
								select={_this.select.bind(_this)}
								selectTo={_this.selectTo.bind(_this)}
								draggable={true}
								drag={_this.drag.bind(_this)}
								drop={_this.drop.bind(_this)}
								dropWindow={_this.dropWindow.bind(_this)}
								windowTitles={_this.state.windowTitles}
								lastOpenWindow={_this.state.lastOpenWindow}
								dragFavicon={_this.dragFavicon.bind(_this)}
								ref={"window" + window.id}
							/>
						);
					}.bind(this))}
					<div className={"hrCont " + (!haveMin ? "hidden" : "")}>
						<div className="hrDiv">
							<span className="hrSpan">已最小化的窗口</span>
						</div>
					</div>
					{this.state.windows.map(function(window) {
						if (window.state !== "minimized") return;
						if (!!this.state.colorsActive && this.state.colorsActive !== window.id) return;
						return (
							<Window
								key={"window" + window.id}
								window={window}
								tabs={window.tabs}
								incognito={window.incognito}
								layout={_this.state.layout}
								selection={_this.state.selection}
								searchActive={_this.state.searchLen > 0}
								sessionsFeature={_this.state.sessionsFeature}
								tabactions={_this.state.tabactions}
								hiddenTabs={_this.state.hiddenTabs}
								filterTabs={_this.state.filterTabs}
								dupGroups={_this.state.dupGroups}
				dupTabs={_this.state.dupTabs}
								hoverHandler={_this.hoverHandler.bind(_this)}
								scrollTo={_this.scrollTo.bind(_this)}
								hoverIcon={_this.hoverIcon.bind(_this)}
								parentUpdate={_this.update.bind(_this)}
								toggleColors={_this.toggleColors.bind(_this)}
								tabMiddleClick={_this.deleteTab.bind(_this)}
								select={_this.select.bind(_this)}
								selectTo={_this.selectTo.bind(_this)}
								draggable={true}
								drag={_this.drag.bind(_this)}
								drop={_this.drop.bind(_this)}
								dropWindow={_this.dropWindow.bind(_this)}
								windowTitles={_this.state.windowTitles}
								lastOpenWindow={_this.state.lastOpenWindow}
								dragFavicon={_this.dragFavicon.bind(_this)}
								ref={"window" + window.id}
							/>
						);
					}.bind(this))}
					<div className={"hrCont " + (!haveSess ? "hidden" : "")}>
						<div className="hrDiv">
							<span className="hrSpan">已保存的窗口</span>
						</div>
					</div>
					{haveSess
						? this.state.sessions.map(function(window : ISavedSession) {
								if (!!this.state.colorsActive && this.state.colorsActive !== window.id) return;
								return (
									<Session
										key={"session" + window.id}
										session={window}
										tabs={window.tabs}
										incognito={window.incognito}
										layout={_this.state.layout}
										selection={_this.state.selection}
										searchActive={_this.state.searchLen > 0}
										tabactions={_this.state.tabactions}
										hiddenTabs={_this.state.hiddenTabs}
										filterTabs={_this.state.filterTabs}
										hoverHandler={_this.hoverHandler.bind(_this)}
										scrollTo={_this.scrollTo.bind(_this)}
										hoverIcon={_this.hoverIcon.bind(_this)}
										parentUpdate={_this.update.bind(_this)}
										toggleColors={_this.toggleColors.bind(_this)}
										tabMiddleClick={_this.deleteTab.bind(_this)}
										select={_this.select.bind(_this)}
										windowTitles={_this.state.windowTitles}
										lastOpenWindow={_this.state.lastOpenWindow}
										draggable={false}
										ref={"session" + window.id}
									/>
								);
							}.bind(this))
						: false}
				{this.state.dupTabs && this.state.connectLines && this.state.connectLinesData.length > 0 && (
					<svg className="connect-lines-overlay" ref="connectLinesSvg">
						{this.state.connectLinesData.map((line, i) => {
							const colorIdx = ((line.group - 1) % 10);
							const color = this.state.connectLinesColors[colorIdx] || "rgba(128,128,128,0.5)";
							return (
								<line
									key={"connectline-" + i}
									x1={line.x1} y1={line.y1}
									x2={line.x2} y2={line.y2}
									stroke={color}
									strokeWidth="2"
									strokeDasharray="4 2"
								/>
							);
						})}
					</svg>
				)}
				</div>}
				{this.state.optionsActive && <div className={"options-container"} ref="options-container">
					<TabOptions
						compact={this.state.compact}
						dark={this.state.dark}
						animations={this.state.animations}
						windowTitles={this.state.windowTitles}
						tabLimit={this.state.tabLimit}
						openInOwnTab={this.state.openInOwnTab}
						tabWidth={this.state.tabWidth}
						tabHeight={this.state.tabHeight}
						tabactions={this.state.tabactions}
						badge={this.state.badge}
						hideWindows={this.state.hideWindows}
						sessionsFeature={this.state.sessionsFeature}
						exportSessions={this.exportSessions}
						importSessions={this.importSessions}
						toggleOpenInOwnTab={this.toggleOpenInOwnTab}
						toggleBadge={this.toggleBadge}
						toggleHide={this.toggleHide}
						toggleSessions={this.toggleSessions}
						toggleAnimations={this.toggleAnimations}
						toggleWindowTitles={this.toggleWindowTitles}
						toggleCompact={this.toggleCompact}
						toggleDark={this.toggleDark}
						toggleTabActions={this.toggleTabActions}
						changeTabLimit={this.changeTabLimit}
						changeTabWidth={this.changeTabWidth}
						changeTabHeight={this.changeTabHeight}
						openInOwnTabText={this.openInOwnTabText}
						badgeText={this.badgeText}
						hideText={this.hideText}
						sessionsText={this.sessionsText}
						exportSessionsText={this.exportSessionsText}
						importSessionsText={this.importSessionsText}
						animationsText={this.animationsText}
						windowTitlesText={this.windowTitlesText}
						tabLimitText={this.tabLimitText}
						tabWidthText={this.tabWidthText}
						tabHeightText={this.tabHeightText}
						compactText={this.compactText}
						darkText={this.darkText}
						tabActionsText={this.tabActionsText}
						getTip={this.getTip}
					/>
				</div>}
				<div className="window top" ref="tophover">
					<div
						className="icon windowaction rate"
						title="评价 Tab Manager Plus"
						onClick={this.rateExtension}
						onMouseEnter={this.hoverIcon}
					/>
					<div className="icon windowaction options" title="选项" onClick={this.toggleOptions} onMouseEnter={this.hoverIcon} />
					<input
						type="text"
						disabled={true}
						className="tabtitle"
						ref="topbox"
						placeholder={maybePluralize(tabCount, '个标签') + "，" + maybePluralize(this.state.windows.length, '个窗口')}
						value={this.state.topText}
					/>
					<input type="text" disabled={true} className="taburl" ref="topboxurl" placeholder={this.getTip()} value={this.state.bottomText} />
				</div>
				{!this.state.optionsActive && !this.state.colorsActive && <div className={"window searchbox"}>
					<table>
						<tbody>
							<tr>
								<td className="one">
									<select className="searchModeSelect" onChange={this.changeSearchMode} value={this.state.searchMode} title="搜索范围">
										<option value="mixed">混合</option>
										<option value="title">标题</option>
										<option value="url">地址</option>
									</select>
									<input className="searchBoxInput" type="text" placeholder="输入以搜索标签页..." tabIndex={1} onChange={this.search} ref="searchbox" />
								</td>
								<td className="two">
									<div
										className={"icon windowaction " + this.state.layout + "-view"}
										title={"切换到 " + this.readablelayout(this.nextlayout()) + " 视图"}
										onClick={this.changelayout}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className="icon windowaction trash"
										title={
											this.state.selection.size > 0
												? "关闭选中标签\n将关闭 " + maybePluralize(this.state.selection.size, '个标签')
												: "关闭当前标签"
										}
										onClick={this.deleteTabs}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className="icon windowaction discard"
										title={
											this.state.selection.size > 0
												? "挂起选中标签\n将挂起 " + maybePluralize(this.state.selection.size, '个标签') + " - 释放内存"
												: "选中标签以挂起并释放内存"
										}
										style={
											this.state.selection.size > 0
												? {}
												: { opacity: 0.25 }
										}
										onClick={this.discardTabs}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className="icon windowaction pin"
										title={
											this.state.selection.size > 0
												? "固定选中标签\n将固定 " + maybePluralize(this.state.selection.size, '个标签')
												: "固定当前标签"
										}
										onClick={this.pinTabs}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className={"icon windowaction filter" + (this.state.filterTabs ? " enabled" : "")}
										title={
											(this.state.filterTabs ? "停止隐藏" : "隐藏") +
											"不匹配搜索的标签" +
											(this.state.searchLen > 0
												? "\n" +
													(this.state.filterTabs ? "将显示 " : "将隐藏 ") +
													maybePluralize((this.state.tabsbyid.size - this.state.selection.size), '个标签')
												: "")
										}
										onClick={this.toggleFilterMismatchedTabs}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className="icon windowaction new"
										title={
											this.state.selection.size > 0
												? "将标签移到新窗口\n将移动 " + maybePluralize(this.state.selection.size, '个选中标签') + " 到新窗口"
												: "打开空白窗口"
										}
										onClick={this.addWindow}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className={"icon windowaction duplicates" + (this.state.dupTabs ? " enabled" : "")}
										title="高亮重复标签"
										onClick={this.highlightDuplicates}
										onMouseEnter={this.hoverIcon}
									/>
									<div
										className={"icon windowaction connect-lines" + (this.state.connectLines ? " enabled" : "") + (this.state.dupTabs ? "" : " disabled")}
										title="连线重复标签"
										onClick={this.toggleConnectLines}
										onMouseEnter={this.hoverIcon}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>}
				<div className="window placeholder" />
			</div>
		);
	}

	async componentDidMount()
	{
		await this.loadStorage();

		if (navigator.userAgent.search("Firefox") > -1) {
		} else {
			let result = await browser.permissions.contains({permissions: ["system.display"]});
			if (!result) {
				setLocalStorage("hideWindows", false);
				this.setState({
					hideWindows: false
				});
			}
		}

		let _this = this;

		let runUpdate = debounce(this.update, 250);
		runUpdate = runUpdate.bind(this);

		var runTabUpdate = async (tabid, changeinfo, tab) => {
			this.dirtyWindow(tab.windowId);

			if (!!_this.refs["window" + tab.windowId]) {
				var window = _this.refs["window" + tab.windowId] as Window;
				if (!!window.refs["tab" + tabid]) {
					var _tabref = window.refs["tab" + tabid] as Tab;
					await _tabref.checkSettings();
				}
			}
		}

		browser.tabs.onCreated.addListener(runUpdate);
		browser.tabs.onUpdated.addListener(runUpdate);
		browser.tabs.onUpdated.addListener(runTabUpdate);
		browser.tabs.onMoved.addListener(runUpdate);
		browser.tabs.onRemoved.addListener(runUpdate);
		browser.tabs.onReplaced.addListener(runUpdate);
		browser.tabs.onDetached.addListener(runUpdate);
		browser.tabs.onAttached.addListener(runUpdate);

		browser.tabs.onCreated.addListener(this.onTabCreated);
		browser.tabs.onDetached.addListener(this.onTabDetached);
		browser.tabs.onAttached.addListener(this.onTabAttached);
		browser.tabs.onRemoved.addListener(this.onTabRemoved);

		browser.tabs.onActivated.addListener(runUpdate);
		browser.windows.onFocusChanged.addListener(runUpdate);
		browser.windows.onCreated.addListener(runUpdate);
		browser.windows.onRemoved.addListener(runUpdate);

		browser.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
			const request = message as ICommand;

			console.log(request.command);
			switch (request.command) {
				case S.refresh_windows:
					let window_ids : number[] = request.window_ids;
					for (let window_id of window_ids) {
						if (!_this.refs["window" + window_id]) continue;
						(_this.refs["window" + window_id] as Window).checkSettings();
					}
					break;
			}
		});


		browser.storage.onChanged.addListener(this.sessionSync);

		await this.sessionSync();

		(this.refs.root as HTMLElement).focus();
		this.focusRoot();

		setTimeout(async function() {
			var scrollArea = document.getElementsByClassName("window-container")[0];
			var activeWindow = document.getElementsByClassName("activeWindow");
			if (!!activeWindow && activeWindow.length > 0) {
				var activeTab = activeWindow[0].getElementsByClassName("highlighted");
				if (!!activeTab && activeTab.length > 0) {
					if (!!scrollArea && scrollArea.scrollTop > 0) {
					} else {
						var animations = await getLocalStorage("animations", false);
						activeTab[0].scrollIntoView({ behavior: animations ? "smooth" : "instant", block: "center", inline: "nearest" });
					}
				}
			}
		}, 250);

		// box.select();
		// box.focus();
	}
	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dupTabs && this.state.connectLines) {
			if (prevState.dupGroups !== this.state.dupGroups ||
				prevState.connectLines !== this.state.connectLines) {
				setTimeout(() => this.drawConnectLines(), 50);
			}
		}
	}
	async sessionSync() {
		let values = await getLocalStorage('sessions', {});
		//console.log(values);
		let sessions : ISavedSession[] = [];
		for (let key in values) {
			let sess = values[key];
			if (sess.id && sess.tabs && sess.windowsInfo) {
				sessions.push(sess);
			}
		}
		this.setState({
			sessions: sessions
		});
		await this.update();
	}
	focusRoot() {
		this.setState({ focusUpdates: (this.state.focusUpdates + 1) });
		setTimeout(
			function() {
				if (document.activeElement === document.body) {
					this.refs.root.focus();
					this.forceUpdate();
					if (this.state.focusUpdates < 5) this.focusRoot();
				}
			}.bind(this),
			500
		);
	}
	dragFavicon(icon : string) : string {
		if (!icon) {
			return this.state.dragFavicon;
		} else {
			this.setState({ dragFavicon: icon });
			return icon;
		}
	}
	rateExtension() {
		if (navigator.userAgent.search("Firefox") > -1) {
			browser.tabs.create({ url: "https://addons.mozilla.org/en-US/firefox/addon/tab-manager-plus-for-firefox/" });
		} else {
			browser.tabs.create({ url: "https://chrome.google.com/webstore/detail/tab-manager-plus-for-chro/cnkdjjdmfiffagllbiiilooaoofcoeff" });
		}
		this.forceUpdate();
	}
	toggleOptions() {
		this.setState({ optionsActive: !this.state.optionsActive });
		this.forceUpdate();
	}
	toggleColors(active : boolean, windowId : number) {
		this.setState({
			colorsActive: !!active ? windowId : 0
		})
		console.log("colorsActive", active, windowId, this.state.colorsActive);
		this.forceUpdate();
	}

	onTabCreated(tab : browser.Tabs.Tab) {
		this.dirtyWindow(tab.windowId);
	}

	onTabRemoved(tabId : number, removeInfo : browser.Tabs.OnRemovedRemoveInfoType) {
		this.dirtyWindow(removeInfo.windowId);
	}

	onTabDetached(tabId : number, detachInfo : browser.Tabs.OnDetachedDetachInfoType) {
		const windowId = detachInfo.oldWindowId;
		this.dirtyWindow(windowId);
	}

	onTabAttached(tabId : number, attachInfo: browser.Tabs.OnAttachedAttachInfoType) {
		const windowId = attachInfo.newWindowId;
		this.dirtyWindow(windowId);
	}

	dirtyWindow(windowId : number) {
		const window = this.refs['window' + windowId] as Window;
		if (!window) return;
		window.setState({dirty: true});
	}

	async update() {
		const windows : browser.Windows.Window[] = await browser.windows.getAll({ populate: true });
		const sort_windows = await getLocalStorage("windowAge", []);

		windows.sort(function(a, b) {
			var aSort = sort_windows.indexOf(a.id);
			var bSort = sort_windows.indexOf(b.id);
			if (a.state === "minimized" && b.state !== "minimized") return 1;
			if (b.state === "minimized" && a.state !== "minimized") return -1;
			if (aSort < bSort) return -1;
			if (aSort > bSort) return 1;
			return 0;
		});

		this.state.windowsbyid.clear();
		this.state.tabsbyid.clear();

		this.setState({
			lastOpenWindow: windows[0].id,
			windows: windows
		});

		let tabCount = 0;

		for (const window of windows) {
			this.state.windowsbyid.set(window.id, window);
			for (const tab of window.tabs) {
				this.state.tabsbyid.set(tab.id, tab);
				tabCount++;
			}
		}
		for (let id of this.state.selection.keys()) {
			if (!this.state.tabsbyid.has(id)) {
				this.state.selection.delete(id);
				this.setState({lastSelect: id});
			}
		}
		this.setState({
			tabCount: tabCount
		});
		//this.state.searchLen = 0;
		// this.forceUpdate();
	}
	async deleteTabs() {
		const _this = this;
		const tabs: browser.Tabs.Tab[] = [...this.state.selection.keys()].map(function(id) {
			return _this.state.tabsbyid.get(id);
		});
		if (tabs.length) {
			browser.runtime.sendMessage<ICommand>({command: S.close_tabs, tabs: tabs});
		} else {
			const t = await browser.tabs.query({ currentWindow: true, active: true });
			if (t && t.length > 0) {
				await browser.tabs.remove(t[0].id);
			}
		}
		this.forceUpdate();
	}
	deleteTab(tabId : number) {
		browser.tabs.remove(tabId);
	}
	async discardTabs() {
		const _this = this;
		const tabs : browser.Tabs.Tab[] = [...this.state.selection.keys()].map(function(id) {
			return _this.state.tabsbyid.get(id);
		});
		if (tabs.length) {
			browser.runtime.sendMessage<ICommand>({command: S.discard_tabs, tabs: tabs});
		}
		this.clearSelection();
	}
	discardTab(tabId) {
		browser.tabs.discard(tabId);
	}
	async addWindow() {
		const _this = this;
		const count = this.state.selection.size;
		const tabs : browser.Tabs.Tab[] = [...this.state.selection.keys()].map(function(id) {
			return _this.state.tabsbyid.get(id);
		});

		const incognito_tabs = tabs.filter(function(tab) {
			return tab.incognito;
		});

		const normal_tabs = tabs.filter(function(tab) {
			return !tab.incognito;
		});

		if (count === 0) {
			await browser.windows.create({});
		} else if (count === 1) {
			if (navigator.userAgent.search("Firefox") > -1) {
				await browser.runtime.sendMessage<ICommand>({command: S.focus_on_tab_and_window_delayed, tab: tabs[0]});
			}else{
				await browser.runtime.sendMessage<ICommand>({command: S.focus_on_tab_and_window, tab: tabs[0]});
			}
		} else {
			if (normal_tabs.length > 0) {
				await browser.runtime.sendMessage<ICommand>({command: S.create_window_with_tabs, tabs: normal_tabs, incognito: false});
			}
			if (incognito_tabs.length > 0) {
				await browser.runtime.sendMessage<ICommand>({command: S.create_window_with_tabs, tabs: incognito_tabs, incognito: true});
			}
		}
		if (!!window.inPopup) window.close();
	}
	async pinTabs() {
		const _this = this;
		const tabs : browser.Tabs.Tab[] = [...this.state.selection.keys()]
			.map(function(id) {
				return _this.state.tabsbyid.get(id);
			})
			.sort(function(a, b) {
				return a.index - b.index;
			});
		if (tabs.length) {
			if (tabs[0].pinned) tabs.reverse();
			for (let i = 0; i < tabs.length; i++) {
				await browser.tabs.update(tabs[i].id, { pinned: !tabs[0].pinned });
			}
		} else {
			const t = await browser.tabs.query({ currentWindow: true, active: true });
			if (t && t.length > 0) {
				await browser.tabs.update(t[0].id, { pinned: !t[0].pinned });
			}
		}
	}
	highlightDuplicates(e) {
		this.state.selection.clear();
		// 不再清 hiddenTabs，不隐藏非重复
		const dupTabs = !this.state.dupTabs;

		(this.refs.searchbox as HTMLInputElement).value = "";

		if (!dupTabs) {
			this.setState({
				dupTabs: dupTabs,
				dupGroups: new Map(),
				searchLen: 0,
				hiddenCount: 0
			});
			this.forceUpdate();
			return;
		}

		// 第一轮：统计每个 URL(去#hash) 出现次数
		const urlCounts = new Map<string, number>();
		for (const [id, tab] of this.state.tabsbyid) {
			if (!tab || !tab.url) continue;
			const cleanUrl = tab.url.split("#")[0];
			urlCounts.set(cleanUrl, (urlCounts.get(cleanUrl) || 0) + 1);
		}

		// 第二轮：只给出现 >1 次的 URL 从 1 连续编号
		const urlToGroup = new Map<string, number>();
		let groupNum = 0;
		for (const [url, count] of urlCounts) {
			if (count > 1) {
				groupNum++;
				urlToGroup.set(url, groupNum);
			}
		}

		// 第三轮：给每个重复标签分配组号
		const realDupGroups = new Map<number, number>();
		let dupCount = 0;
		for (const [id, tab] of this.state.tabsbyid) {
			if (!tab || !tab.url) continue;
			const cleanUrl = tab.url.split("#")[0];
			if (urlToGroup.has(cleanUrl)) {
				realDupGroups.set(id, urlToGroup.get(cleanUrl)!);
				dupCount++;
			}
		}

		if (dupCount === 0) {
			this.setState({
				topText: "未找到重复标签",
				bottomText: " ",
				dupTabs: dupTabs,
				dupGroups: new Map()
			});
		} else {
			this.setState({
				topText: "已高亮 " + dupCount + " 个重复标签",
				bottomText: "按回车键将它们移到新窗口",
				dupTabs: dupTabs,
				dupGroups: realDupGroups
			});
		}
		this.forceUpdate();
		if (this.state.connectLines) {
			setTimeout(() => this.drawConnectLines(), 100);
		}
	}
	toggleConnectLines(e) {
		if (!this.state.dupTabs) return;
		const connectLines = !this.state.connectLines;
		this.setState({ connectLines: connectLines });
		// 状态更新后需要重新计算连线
		if (connectLines) {
			setTimeout(() => this.drawConnectLines(), 100);
		} else {
			this.setState({ connectLinesData: [] });
		}
		this.forceUpdate();
	}
	drawConnectLines() {
		if (!this.state.dupTabs || !this.state.connectLines) return;

		const container = this.refs.windowcontainer as HTMLDivElement;
		if (!container) return;

		const containerRect = container.getBoundingClientRect();

		// 收集每个重复标签的位置和组号
		const tabPositions = new Map<number, { x: number; y: number; group: number }>();
		for (const [tabId, group] of this.state.dupGroups) {
			const tabEl = container.querySelector("#tab-" + tabId) as HTMLElement;
			if (!tabEl) continue;
			const rect = tabEl.getBoundingClientRect();
			tabPositions.set(tabId, {
				x: rect.left - containerRect.left + rect.width / 2,
				y: rect.top - containerRect.top + rect.height / 2,
				group: group
			});
		}

		// 按组分类
		const groups = new Map<number, Array<{ x: number; y: number }>>();
		for (const [tabId, pos] of tabPositions) {
			if (!groups.has(pos.group)) {
				groups.set(pos.group, []);
			}
			groups.get(pos.group)!.push({ x: pos.x, y: pos.y });
		}

		// 生成连线 path（同组内相邻标签连线）
		const lines: Array<{ x1: number; y1: number; x2: number; y2: number; group: number }> = [];
		const colors = [
			"rgba(255, 99, 71, 0.6)",
			"rgba(54, 162, 235, 0.6)",
			"rgba(255, 206, 86, 0.6)",
			"rgba(75, 192, 192, 0.6)",
			"rgba(153, 102, 255, 0.6)",
			"rgba(255, 159, 64, 0.6)",
			"rgba(199, 199, 199, 0.6)",
			"rgba(83, 102, 255, 0.6)",
			"rgba(40, 180, 99, 0.6)",
			"rgba(233, 78, 146, 0.6)"
		];

		for (const [group, positions] of groups) {
			if (positions.length < 2) continue;
			// 同组内按位置排序后两两连线
			for (let i = 0; i < positions.length - 1; i++) {
				lines.push({
					x1: positions[i].x,
					y1: positions[i].y,
					x2: positions[i + 1].x,
					y2: positions[i + 1].y,
					group: group
				});
			}
		}

		this.setState({ connectLinesData: lines, connectLinesColors: colors });
	}
	changeSearchMode(e) {
		this.setState({ searchMode: e.target.value });
		// 触发一次重新搜索
		const searchbox = this.refs.searchbox as HTMLInputElement;
		if (searchbox && searchbox.value) {
			searchbox.dispatchEvent(new Event('change'));
		}
	}
	search(e) {
		let hiddenCount = this.state.hiddenCount || 0;
		const searchQuery = e.target.value || "";
		const searchLen = searchQuery.length;

		let searchType = "normal";
		let searchTerms = [];
		if(searchQuery.indexOf(" ") === -1) {
			searchType = "normal";
		}else if(searchQuery.indexOf(" OR ") > -1) {
			searchTerms = searchQuery.split(" OR ");
			searchType = "OR";
		}else if(searchQuery.indexOf(" ") > -1) {
			searchTerms = searchQuery.split(" ");
			searchType = "AND";
		}
		if(searchType !== "normal") {
			searchTerms = searchTerms.filter(function(entry) { return entry.trim() !== ''; });
		}

		if (!searchLen) {
			this.state.selection.clear();
			this.state.hiddenTabs.clear();
			hiddenCount = 0;
		} else {
			let idList : number[];
			const lastSearchLen = this.state.searchLen;
			idList = [ ...this.state.tabsbyid.keys() ];
			if(searchType === "normal") {
				if (!lastSearchLen) {
					idList = [ ...this.state.tabsbyid.keys() ];
				} else if (lastSearchLen > searchLen) {
					idList = [ ...this.state.hiddenTabs.keys() ];
				} else if (lastSearchLen < searchLen) {
					idList = [ ...this.state.selection.keys() ];
				}
			}
			for (const id of idList) {
				const tab = this.state.tabsbyid.get(id);
				let tabSearchTerm = "";
				const mode = this.state.searchMode || "mixed";
				if (mode === "title") {
					if (!!tab.title) tabSearchTerm = tab.title;
				} else if (mode === "url") {
					if (!!tab.url) tabSearchTerm = tab.url;
				} else {
					if (!!tab.title) tabSearchTerm = tab.title;
					if (!!tab.url) tabSearchTerm += " " + tab.url;
				}
				tabSearchTerm = tabSearchTerm.toLowerCase();
				let match = false;
				if(searchType === "normal") {
					match = (tabSearchTerm.indexOf(e.target.value.toLowerCase()) >= 0);
				}else if(searchType === "OR") {
					for (let searchOR of searchTerms) {
						searchOR = searchOR.trim().toLowerCase();
						if(tabSearchTerm.indexOf(searchOR) >= 0) {
							match = true;
							break;
						}
					}
				}else if(searchType === "AND") {
					let andMatch = true;
					for (let searchAND of searchTerms) {
						searchAND = searchAND.trim().toLowerCase();
						if(tabSearchTerm.indexOf(searchAND) >= 0) {

						}else{
							andMatch = false;
							break;
						}
					}
					match = andMatch;
				}
				if (match) {
					hiddenCount -= this.state.hiddenTabs.has(id) ? 1 : 0;
					this.state.selection.add(id);
					this.state.hiddenTabs.delete(id);
				} else {
					hiddenCount += 1 - (this.state.hiddenTabs.has(id) ? 1 : 0);
					this.state.hiddenTabs.add(id);
					this.state.selection.delete(id);
				}
				this.setState({
					lastSelect: id
				});
			}
		}

		this.setState({
			hiddenCount: hiddenCount,
			searchLen: searchLen
		})

		const matches = this.state.selection.size;
		// var matchtext = "";
		if (matches === 0 && searchLen > 0) {
			this.setState({
				topText: "未找到匹配 '" + searchQuery + "' 的标签",
				bottomText: ""
			});
		} else if (matches === 0) {
			this.setState({
				topText: "",
				bottomText: ""
			});
		} else if (matches > 1) {
			this.setState({
				topText: this.state.selection.size + " 个匹配 '" + searchQuery + "'",
				bottomText: "按回车键将它们移到新窗口"
			});
		} else if (matches === 1) {
			this.setState({
				topText: this.state.selection.size + " 个匹配 '" + searchQuery + "'",
				bottomText: "按回车键切换到该标签"
			});
		}
		this.forceUpdate();
	}
	clearSelection() {
		this.state.selection.clear();
		this.setState({
			lastSelect: 0
		});
	}
	checkKey(e) {
		// enter
		if (e.keyCode === 13) this.addWindow();
		// escape key
		if (e.keyCode === 27) {
			if(this.state.searchLen > 0 || this.state.selection.size > 0) {
				// stop popup from closing if we have search text or selection active
				e.nativeEvent.preventDefault();
				e.nativeEvent.stopPropagation();
			}

			this.state.hiddenTabs.clear();
			this.setState({
				searchLen: 0
			});

			(this.refs.searchbox as HTMLInputElement).value = "";
			this.clearSelection();
		}
		// any typed keys
		if (
			(e.keyCode >= 48 && e.keyCode <= 57) ||
			(e.keyCode >= 65 && e.keyCode <= 90) ||
			(e.keyCode >= 186 && e.keyCode <= 192) ||
			(e.keyCode >= 219 && e.keyCode <= 22) ||
			e.keyCode === 8 ||
			e.keyCode === 46 ||
			e.keyCode === 32
		) {
			if (document.activeElement !== this.refs.searchbox) {
				var activeInputElement = document.activeElement as HTMLInputElement;
				console.log(activeInputElement);
				console.log(this.refs.searchbox);
				if (activeInputElement.type !== "text" && activeInputElement.type !== "input") {
					(this.refs.searchbox as HTMLElement)?.focus();
				}
			}
		}
		// arrow keys
		/*
			left arrow  37
			up arrow  38
			right arrow 39
			down arrow  40
		*/
		if (e.keyCode >= 37 && e.keyCode <= 40) {
			if (document.activeElement !== this.refs.windowcontainer && document.activeElement !== this.refs.searchbox) {
				console.log(activeInputElement);
				console.log(this.refs.windowcontainer);
				(this.refs.windowcontainer as HTMLElement)?.focus();
			}

			if (document.activeElement !== this.refs.searchbox || !((this.refs.searchbox as HTMLInputElement).value)) {
				let goLeft = e.keyCode === 37;
				let goRight = e.keyCode === 39;
				let goUp = e.keyCode === 38;
				let goDown = e.keyCode === 40;
				if (this.state.layout === "vertical") {
					goLeft = e.keyCode === 38;
					goRight = e.keyCode === 40;
					goUp = e.keyCode === 37;
					goDown = e.keyCode === 39;
				}
				if (goLeft || goRight || goUp || goDown) {
					e.nativeEvent.preventDefault();
					e.nativeEvent.stopPropagation();
				}
				const altKey = e.nativeEvent.metaKey || e.nativeEvent.altKey || e.nativeEvent.shiftKey || e.nativeEvent.ctrlKey;
				if (goLeft || goRight) {
					let selectedTabs = [...this.state.selection.keys()];
					if (!altKey && selectedTabs.length > 1) {
					} else {
						let found = false;
						let selectedNext = false;
						let selectedTab = 0;
						let first = 0;
						let prev = 0;
						let last = 0;
						if (selectedTabs.length === 1) {
							selectedTab = selectedTabs[0];
							// console.log("one tab", selectedTab);
						} else if (selectedTabs.length > 1) {
							if (!!this.state.lastSelect) {
								selectedTab = this.state.lastSelect;
								// console.log("more tabs, last", selectedTab);
							} else {
								selectedTab = selectedTabs[0];
								// console.log("more tabs, first", selectedTab);
							}
						} else if (selectedTabs.length === 0 && !!this.state.lastSelect) {
							selectedTab = this.state.lastSelect;
							// console.log("no tabs, last", selectedTab);
						}
						if (!!this.state.lastDirection) {
							if (goRight && this.state.lastDirection === "goRight") {
							} else if (goLeft && this.state.lastDirection === "goLeft") {
							} else if (selectedTabs.length > 1) {
								// console.log("turned back, last", this.state.lastSelect, selectedTab);
								this.select(this.state.lastSelect);
								this.setState({
									lastDirection: ""
								});
								found = true;
							} else {
								this.setState({
									lastDirection: ""
								});
							}
						}
						if (!this.state.lastDirection) {
							if (goRight) this.setState({ lastDirection: "goRight" });
							if (goLeft) this.setState({ lastDirection: "goLeft" });
						}
						for (const _w of this.state.windows) {
							if (found) break;
							if (_w.state !== "minimized") {
								for (const _t of _w.tabs) {
									last = _t.id;
									if (!first) first = _t.id;
									if (!selectedTab) {
										if (!altKey) this.state.selection.clear();
										this.select(_t.id);
										found = true;
										break;
									} else if (selectedTab === _t.id) {
										// console.log("select next one", selectedNext);
										if (goRight) {
											selectedNext = true;
										} else if (!!prev) {
											if (!altKey) this.state.selection.clear();
											this.select(prev);
											found = true;
											break;
										}
									} else if (selectedNext) {
										if (!altKey) this.state.selection.clear();
										this.select(_t.id);
										found = true;
										break;
									}
									prev = _t.id;
									// console.log(_t, _t.id === selectedTab);
								}
							}
						}
						for (const _w of this.state.windows) {
							if (found) break;
							if (_w.state === "minimized") {
								for (const _t of _w.tabs) {
									last = _t.id;
									if (!first) first = _t.id;
									if (!selectedTab) {
										if (!altKey) this.state.selection.clear();
										this.select(_t.id);
										found = true;
										break;
									} else if (selectedTab === _t.id) {
										if (goRight) {
											selectedNext = true;
										} else if (!!prev) {
											if (!altKey) this.state.selection.clear();
											this.select(prev);
											found = true;
											break;
										}
									} else if (selectedNext) {
										if (!altKey) this.state.selection.clear();
										this.select(_t.id);
										found = true;
										break;
									}
									prev = _t.id;
									// console.log(_t, _t.id === selectedTab);
								}
							}
						}
						if (!found && goRight && !!first) {
							if (!altKey) this.state.selection.clear();
							this.select(first);
							found = true;
						}
						if (!found && goLeft && !!last) {
							if (!altKey) this.state.selection.clear();
							this.select(last);
							found = true;
						}
					}
				}
				if (goUp || goDown) {
					let selectedTabs = [...this.state.selection.keys()];
					if (selectedTabs.length > 1) {
					} else {
						let found = false;
						let selectedNext = false;
						let selectedTab = -1;
						let first = 0;
						let prev = 0;
						let last = 0;
						let tabPosition = -1;
						let i = -1;
						if (selectedTabs.length === 1) {
							selectedTab = selectedTabs[0];
							// console.log(selectedTab);
						}
						for (const _w of this.state.windows) {
							i = 0;
							if (found) break;
							if (_w.state !== "minimized") {
								if (!first) first = _w.id;
								for (const _t of _w.tabs) {
									i++;
									last = _w.id;
									if (!selectedTab) {
										this.selectWindowTab(_w.id, tabPosition);
										found = true;
										break;
									} else if (selectedTab === _t.id) {
										tabPosition = i;
										// console.log("found tab", _w.id, _t.id, selectedTab, i);
										if (goDown) {
											// console.log("select next window ", selectedNext, tabPosition);
											selectedNext = true;
											break;
										} else if (!!prev) {
											// console.log("select prev window ", prev, tabPosition);
											this.selectWindowTab(prev, tabPosition);
											found = true;
											break;
										}
									} else if (selectedNext) {
										// console.log("selecting next window ", _w.id, tabPosition);
										this.selectWindowTab(_w.id, tabPosition);
										found = true;
										break;
									}

									// console.log(_t, _t.id === selectedTab);
								}
								prev = _w.id;
							}
						}
						for (const _w of this.state.windows) {
							i = 0;
							if (found) break;
							if (_w.state === "minimized") {
								if (!first) first = _w.id;
								for (const _t of _w.tabs) {
									i++;
									last = _w.id;
									if (!selectedTab) {
										this.selectWindowTab(_w.id, tabPosition);
										found = true;
										break;
									} else if (selectedTab === _t.id) {
										tabPosition = i;
										// console.log("found tab", _w.id, _t.id, selectedTab, i);
										if (goDown) {
											// console.log("select next window ", selectedNext, tabPosition);
											selectedNext = true;
											break;
										} else if (!!prev) {
											// console.log("select prev window ", prev, tabPosition);
											this.selectWindowTab(prev, tabPosition);
											found = true;
											break;
										}
									} else if (selectedNext) {
										// console.log("selecting next window ", _w.id, tabPosition);
										this.selectWindowTab(_w.id, tabPosition);
										found = true;
										break;
									}
									// console.log(_t, _t.id === selectedTab);
								}
								prev = _w.id;
							}
						}
						// console.log(found, goDown, first);
						if (!found && goDown && !!first) {
							// console.log("go first", first);
							this.state.selection.clear();
							this.selectWindowTab(first, tabPosition);
							found = true;
						}
						// console.log(found, goUp, last);
						if (!found && goUp && !!last) {
							// console.log("go last", last);
							this.state.selection.clear();
							this.selectWindowTab(last, tabPosition);
							found = true;
						}
					}
				}
			}
		}
		// page up / page down
		if (e.keyCode === 33 || e.keyCode === 34) {
			if (document.activeElement != this.refs.windowcontainer) {
				(this.refs.windowcontainer as HTMLElement).focus();
			}
		}
	}
	selectWindowTab(windowId, tabPosition) {
		if (!tabPosition || tabPosition < 1) tabPosition = 1;
		for (let _w of this.state.windows) {
			if (_w.id !== windowId) continue;
			let i = 0;
			for (let _t of _w.tabs) {
				i++;
				if ((_w.tabs.length >= tabPosition && tabPosition === i) || (_w.tabs.length < tabPosition && _w.tabs.length === i)) {
					this.state.selection.clear();
					this.select(_t.id);
				}
			}
		}
	}
	scrollTo(what : string, id : number) {
		var els = document.getElementById(what + "-" + id);
		if (!!els) {
			if (!this.elVisible(els)) {
				els.scrollIntoView({ behavior: this.state.animations ? "smooth" : "instant", block: "center", inline: "nearest" });
			}
		}
	}
	async changelayout(layout) {
		var newLayout;
		if (layout && typeof (layout) === "string") {
			newLayout = layout;
		} else {
			newLayout = this.nextlayout();
		}
		await setLocalStorage("layout", newLayout);

		this.setState({
			layout: newLayout,
			topText: "已切换到 " + this.readablelayout(this.state.layout) + " 视图",
			bottomText: " "
		});

		this.forceUpdate();
	}
	nextlayout() {
		switch (this.state.layout) {
			case "blocks":
				return "blocks-big";
			case "blocks-big":
				return "horizontal";
			case "horizontal":
				return "vertical";
			default:
				return "blocks";
		}
	}
	readablelayout(layout) {
		switch (layout) {
			case "blocks":
				return "块状";
			case "blocks-big":
				return "大块状";
			case "horizontal":
				return "横向";
			default:
				return "纵向";
		}
	}
	select(id : number) {
		if (this.state.selection.has(id)) {
			this.state.selection.delete(id);
			this.setState({
				lastSelect: id
			});
		} else {
			this.state.selection.add(id);
			this.setState({
				lastSelect: id
			});
		}
		this.scrollTo('tab', id);
		var tab = this.state.tabsbyid.get(id);
		if(!!this.refs['window' + tab.windowId] && !!(this.refs['window' + tab.windowId] as Window).refs['tab' + id]) {
			((this.refs['window' + tab.windowId] as Window).refs['tab' + id] as Tab).resolveFavIconUrl();
		}

		console.log(this.state.selection);
		var selected = this.state.selection.size;
		if (selected === 0) {
			this.setState({
				topText: "未选中任何标签",
				bottomText: " "
			});
		} else if (selected === 1) {
			this.setState({
				topText: "已选中 " + selected + " 个标签",
				bottomText: "按回车键切换到该标签"
			});
		} else {
			this.setState({
				topText: "已选中 " + selected + " 个标签",
				bottomText: "按回车键将它们移到新窗口"
			});
		}
	}
	selectTo(id : number, tabs : browser.Tabs.Tab[]) {
		let activate = false;
		const lastSelect = this.state.lastSelect;
		if (id === lastSelect) {
			this.select(id);
			return;
		}
		if (!!lastSelect) {
			if (this.state.selection.has(lastSelect)) {
				activate = true;
			}
		} else {
			if (this.state.selection.has(id)) {
				activate = false;
			} else {
				activate = true;
			}
		}

		let rangeIndex1 : number;
		let rangeIndex2 : number;
		for (let i = 0; i < tabs.length; i++) {
			if (tabs[i].id === id) {
				rangeIndex1 = i;
			}
			if (!!lastSelect && tabs[i].id === lastSelect) {
				rangeIndex2 = i;
			}
		}
		if (!!lastSelect && !rangeIndex2) {
			this.select(id);
			return;
		}
		if (!rangeIndex2) {
			const neighbours = [];
			for (let i = 0; i < tabs.length; i++) {
				const tabId = tabs[i].id;
				if (tabId !== id) {
					if (this.state.selection.has(tabId)) {
						neighbours.push(tabId);
					}
				}
			}

			if (activate) {
				// find closest selected item that's not connected
				let leftSibling = 0;
				let rightSibling = tabs.length - 1;
				for (let i = 0; i < rangeIndex1; i++) {
					if (neighbours.indexOf(i) > -1) {
						leftSibling = i;
					}
				}
				for (let i = tabs.length - 1; i > rangeIndex1; i--) {
					if (neighbours.indexOf(i) > -1) {
						rightSibling = i;
					}
				}
				let diff1 = rangeIndex1 - leftSibling;
				let diff2 = rightSibling - rangeIndex1;
				if (diff1 > diff2) {
					rangeIndex2 = rightSibling;
				} else {
					rangeIndex2 = leftSibling;
				}
			} else {
				// find furthest selected item that's connected
				let leftSibling = rangeIndex1;
				let rightSibling = rangeIndex1;
				for (let i = rangeIndex1; i > 0; i--) {
					if (neighbours.indexOf(i) > -1) {
						leftSibling = i;
					}
				}
				for (let i = rangeIndex1; i < tabs.length; i++) {
					if (neighbours.indexOf(i) > -1) {
						rightSibling = i;
					}
				}
				let diff1 = rangeIndex1 - leftSibling;
				let diff2 = rightSibling - rangeIndex1;
				if (diff1 > diff2) {
					rangeIndex2 = leftSibling;
				} else {
					rangeIndex2 = rightSibling;
				}
			}
		}

		this.setState({
			lastSelect: tabs[rangeIndex2].id
		});
		if (rangeIndex2 < rangeIndex1) {
			let r1 = rangeIndex2;
			let r2 = rangeIndex1;
			rangeIndex1 = r1;
			rangeIndex2 = r2;
		}

		for (let i = 0; i < tabs.length; i++) {
			if (i >= rangeIndex1 && i <= rangeIndex2) {
				const _tab_id = tabs[i].id;
				if (activate) {
					this.state.selection.add(_tab_id);
				} else {
					this.state.selection.delete(_tab_id);
				}
			}
		}

		this.scrollTo('tab', this.state.lastSelect);

		const selected = this.state.selection.size;
		if (selected === 0) {
			this.setState({
				topText: "未选中任何标签",
				bottomText: " "
			});
		} else if (selected === 1) {
			this.setState({
				topText: "已选中 " + selected + " 个标签",
				bottomText: "按回车键切换到该标签"
			});
		} else {
			this.setState({
				topText: "已选中 " + selected + " 个标签",
				bottomText: "按回车键将它们移到新窗口"
			});
		}
		this.forceUpdate();
	}
	drag(e : React.DragEvent<HTMLDivElement>, id : number) {
		if (!this.state.selection.has(id)) {
			this.state.selection.add(id);
			this.setState({
				lastSelect: id
			});
		}
		this.forceUpdate();
	}
	async drop(id : number, before : boolean) {
		var _this = this;
		var tab : browser.Tabs.Tab = this.state.tabsbyid.get(id);
		var tabs : browser.Tabs.Tab[] = [...this.state.selection.keys()].map(function(id) {
			return _this.state.tabsbyid.get(id);
		});
		var index = tab.index + (before ? 0 : 1);

		for (let i = 0; i < tabs.length; i++) {
			const t : browser.Tabs.Tab = tabs[i];
			await browser.tabs.move(t.id, { windowId: tab.windowId, index: index });
			await browser.tabs.update(t.id, { pinned: t.pinned });
		}
		this.state.selection.clear();
		this.update();
	}
	async dropWindow(windowId : number) {
		var _this = this;
		var tabs : browser.Tabs.Tab[] = [...this.state.selection.keys()].map(function(id) {
			return _this.state.tabsbyid.get(id);
		});

		browser.runtime.sendMessage<ICommand>({command: S.move_tabs_to_window, window_id: windowId, tabs: tabs});

		this.state.selection.clear();
	}
	async changeTabLimit(e : React.ChangeEvent<HTMLInputElement>) {
		var _tab_limit = parseInt(e.target.value);
		this.setState({
			tabLimit: _tab_limit
		});
		await setLocalStorage("tabLimit", _tab_limit);
		this.tabLimitText();
		this.forceUpdate();
	}
	tabLimitText() {
		this.setState({
			bottomText: "限制每个窗口的标签数量。新标签会移到新窗口。设为 0 关闭此功能"
		});
	}
	async changeTabWidth(e : React.ChangeEvent<HTMLInputElement>) {
		var _tab_width = parseInt(e.target.value);
		this.setState({
			tabWidth: _tab_width
		});
		await setLocalStorage("tabWidth", _tab_width);
		document.body.style.width = _tab_width + "px";
		this.tabWidthText();
		this.forceUpdate();
	}
	tabWidthText() {
		this.setState({
			bottomText: "更改此窗口的宽度。默认 800。"
		});
	}
	async changeTabHeight(e : React.ChangeEvent<HTMLInputElement>) {
		var _tab_height = parseInt(e.target.value);
		this.setState({
			tabHeight: _tab_height
		});
		await setLocalStorage("tabHeight", _tab_height);
		document.body.style.height = _tab_height + "px";
		this.tabHeightText();
		this.forceUpdate();
	}
	tabHeightText() {
		this.setState({
			bottomText: "更改此窗口的高度。默认 600。"
		});
	}
	async toggleAnimations() {
		var _animations = !this.state.animations;
		this.setState({ animations: _animations });
		await setLocalStorage("animations", _animations);
		this.animationsText();
		this.forceUpdate();
	}
	animationsText() {
		this.setState({
			bottomText: "启用/禁用动画效果。默认：开启"
		});
	}
	async toggleWindowTitles() {
		var _window_titles = !this.state.windowTitles;
		this.setState({windowTitles: _window_titles});
		await setLocalStorage("windowTitles", _window_titles);
		this.windowTitlesText();
		this.forceUpdate();
	}
	windowTitlesText() {
		this.setState({
			bottomText: "启用/禁用窗口标题。默认：开启"
		});
	}
	async toggleCompact() {
		var _compact = !this.state.compact;
		this.setState({compact: _compact});
		await setLocalStorage("compact", _compact);
		this.compactText();
		this.forceUpdate();
	}
	compactText() {
		this.setState({
			bottomText: "紧凑模式是更紧凑的布局。默认：关闭"
		});
	}
	async toggleDark() {
		var _dark = !this.state.dark;
		this.setState({dark: _dark});
		await setLocalStorage("dark", _dark);

		this.darkText();
		if (_dark) {
			document.body.className = "dark";
			document.documentElement.className = "dark";
		} else {
			document.body.className = "";
			document.documentElement.className = "";
		}
		this.forceUpdate();
	}
	darkText() {
		this.setState({
			bottomText: "深色模式会反转布局颜色 - 对眼睛更友好。默认：关闭"
		});
	}
	async toggleTabActions() {
		var _tabactions = !this.state.tabactions;
		this.setState({tabactions: _tabactions});
		await setLocalStorage("tabactions", _tabactions);
		this.tabActionsText();
		this.forceUpdate();
	}
	tabActionsText() {
		this.setState({
			bottomText: "为每个窗口添加「打开新标签页」和「关闭此窗口」选项。默认：开启"
		});
	}
	async toggleBadge() {
		var _badge = !this.state.badge;
		this.setState({badge: _badge});
		await setLocalStorage("badge", _badge);
		this.badgeText();
		browser.runtime.sendMessage<ICommand>({command: S.update_tab_count});
		this.forceUpdate();
	}
	badgeText() {
		this.setState({
			bottomText: "在 Tab Manager 图标上显示打开的标签数。默认：开启"
		});
	}
	async toggleOpenInOwnTab() {
		var _openInOwnTab = !this.state.openInOwnTab;
		this.setState({openInOwnTab: _openInOwnTab});
		await setLocalStorage("openInOwnTab", _openInOwnTab);
		this.openInOwnTabText();
		browser.runtime.sendMessage<ICommand>({ command: S.reload_popup_controls });
		this.forceUpdate();
	}
	openInOwnTabText() {
		this.setState({
			bottomText: "默认在独立标签页中打开 Tab Manager，还是作为弹窗打开？"
		});
	}
	async toggleSessions() {
		var _sessionsFeature = !this.state.sessionsFeature;
		this.setState({sessionsFeature: _sessionsFeature});
		await setLocalStorage("sessionsFeature", _sessionsFeature);
		this.sessionsText();
		this.forceUpdate();
	}
	sessionsText() {
		this.setState({
			bottomText: "允许你将窗口保存/恢复为会话。（标签历史记录会丢失）默认：关闭"
		});
	}
	exportSessions() {
		if (this.state.sessions.length === 0) {
			window.alert("你当前没有保存供以后使用的窗口。没有可导出的内容。");
			return;
		}
		var exportName = "tab-manager-plus-backup";
		var today = new Date();
		var y = today.getFullYear();
		// JavaScript months are 0-based.
		var m = ("0" + (today.getMonth() + 1)).slice(-2);
		var d = ("0" + today.getDate()).slice(-2);
		var h = ("0" + today.getHours()).slice(-2);
		var mi = ("0" + today.getMinutes()).slice(-2);
		var s = ("0" + today.getSeconds()).slice(-2);
		exportName += "-" + y + m + d + "-" + h + mi + "-" + s;
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.sessions, null, 2));
		var downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", exportName + ".json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
		this.exportSessionsText();
		this.forceUpdate();
	}
	exportSessionsText() {
		this.setState({
			bottomText: "允许你将已保存的窗口导出为外部备份"
		});
	}
	importSessions(evt : React.ChangeEvent<HTMLInputElement>) {
		if (navigator.userAgent.search("Firefox") > -1) {
			if(window.inPopup) {
				window.alert("由于 Firefox 的一个 bug，弹窗中无法导入会话。请使用选项页面或在独立标签页中打开 Tab Manager Plus");
				return;
			}
		}
		try {
			let inputField = evt.target; // #session_import
			let files = evt.target.files;
			if (!files.length) {
				alert("未选择文件！");
				this.setState({ bottomText: "错误：无法读取备份文件！" });
				return;
			}
			let file = files[0];
			let reader = new FileReader();

			reader.onload = async event => {
				//console.log('FILE CONTENT', event.target.result);
				var backupFile;
				try {
					backupFile = JSON.parse(event.target.result.toString());
				} catch (err) {
					console.error(err);
					window.alert(err);
					this.setState({ bottomText: "错误：无法读取备份文件！" });
				}
				if (!!backupFile && backupFile.length > 0) {
					var success = backupFile.length;
					for (let i = 0; i < backupFile.length; i++) {
						var newSession = backupFile[i];
						if (newSession.windowsInfo && newSession.tabs && newSession.id) {
							let sessions = await getLocalStorage('sessions', {});
							sessions[newSession.id] = newSession;
							//this.state.sessions.push(obj);

							await setLocalStorage('sessions', sessions).catch(function(err) {
								console.log(err);
								console.error(err.message);
								success--;
							});
							//console.log(value);
						}
					}
					this.setState({ bottomText: "成功恢复 " + success + " 个窗口！" });
				} else {
					this.setState({ bottomText: "错误：无法从备份文件恢复任何窗口！" });
				}
				inputField.value = "";
				this.sessionSync();
			};
			reader.readAsText(file);
		} catch (err) {
			console.error(err);
			window.alert(err);
		}
		this.importSessionsText();
		this.forceUpdate();
	}
	importSessionsText() {
		this.setState({
			bottomText: "允许你从外部备份恢复已保存的窗口"
		});
	}
	async toggleHide() {

		var _hide_windows = this.state.hideWindows;
		if (navigator.userAgent.search("Firefox") > -1) {
			_hide_windows = false;
		} else {
			var granted = await chrome.permissions.request({ permissions: ["system.display"] });
			if (granted) {
				_hide_windows = !_hide_windows;
			} else {
				_hide_windows = false;
			}
		}

		await setLocalStorage("hideWindows", _hide_windows);
		this.setState({
			hideWindows: _hide_windows
		});
		this.hideText();
		this.forceUpdate();
	}
	hideText() {
		this.setState({
			bottomText: "自动最小化非活动的 Chrome 窗口。默认：关闭"
		});
	}
	async toggleFilterMismatchedTabs() {
		var _filter_tabs = !this.state.filterTabs;
		this.setState({
			filterTabs: _filter_tabs
		});
		await setLocalStorage("filter-tabs", _filter_tabs);
		this.forceUpdate();
	}
	getTip() {
		var tips = [
			"你可以右键点击标签来选中它",
			"按回车键将所有选中标签移到新窗口",
			"中键点击可关闭标签",
			"Tab Manager Plus 热爱为你节省时间",
			"要查看隐身标签，请在扩展设置中启用隐身访问权限",
			"你可以将标签拖放到其他窗口",
			"你可以直接输入进行搜索",
			"你可以搜索不同的标签：google OR yahoo"
		];

		return "提示：" + tips[Math.floor(Math.random() * tips.length)];
	}
	elVisible(elem : HTMLElement) {
		if (!(elem instanceof Element)) throw Error("DomUtil: elem is not an element.");
		var style = getComputedStyle(elem);
		if (style.display === "none") return false;
		if (style.visibility !== "visible") return false;
		let _opacity : number = parseFloat(style.opacity);
		if (_opacity < 0.1) return false;
		if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height + elem.getBoundingClientRect().width === 0) {
			return false;
		}
		var elemCenter = {
			x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
			y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
		};

		if (elemCenter.x < 0) return false;
		if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
		if (elemCenter.y < 0) return false;
		if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
		var pointContainer : ParentNode = document.elementFromPoint(elemCenter.x, elemCenter.y);
		do {
			if (pointContainer === elem) return true;
		} while ((pointContainer = pointContainer.parentNode))
		return false;
	}
}