"use strict";

import {openPopup, openAsOwnTab, openSidebar} from "@ui/open";
import * as S from "@strings";
import * as browser from 'webextension-polyfill';

export async function setupContextMenus() {
	await browser.contextMenus.removeAll();

	browser.contextMenus.create({
		id: S.open_in_own_tab,
		title: "📔 在独立标签页打开",
		contexts: ["action"]
	});

	if (!!browser.action.openPopup) {
		browser.contextMenus.create({
			id: S.open_popup,
			title: "📑 打开弹窗",
			contexts: ["action"]
		});
	}

	if (!!browser.sidebarAction) {
		browser.contextMenus.create({
			id: S.open_sidebar,
			title: "🗂 打开侧边栏",
			contexts: ["action"]
		});
	}

	browser.contextMenus.create({
		id: S.sep1,
		type: "separator",
		contexts: ["action"]
	});

	browser.contextMenus.create({
		title: "🤔 问题与建议",
		id: S.code_menu,
		"contexts": ["action"]
	});

	browser.contextMenus.create({
		id: S.changelog,
		title: "🆕 查看最近更新",
		"contexts": ["action"],
		parentId: "code_menu"
	});

	browser.contextMenus.create({
		id: S.options,
		title: "⚙ 编辑选项",
		"contexts": ["action"],
		parentId: "code_menu"
	});

	browser.contextMenus.create({
		id: S.source,
		title: "💻 查看 Fork 源码",
		"contexts": ["action"],
		parentId: "code_menu"
	});

	browser.contextMenus.create({
		id: S.report,
		title: "🤔 报告问题",
		"contexts": ["action"],
		parentId: "code_menu"
	});

	browser.contextMenus.create({
		id: S.send,
		title: "💡 发送建议",
		"contexts": ["action"],
		parentId: "code_menu"
	});

	browser.contextMenus.onClicked.removeListener(contextListeners);
	browser.contextMenus.onClicked.addListener(contextListeners);
}

async function contextListeners(info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab)
{
	switch (info.menuItemId) {
		case S.open_in_own_tab:
			await openAsOwnTab();
			break;
		case S.open_popup:
			await openPopup();
			break;
		case S.open_sidebar:
			await openSidebar();
			break;
		case S.changelog:
			await browser.tabs.create({url: 'changelog.html'});
			break;
		case S.options:
			await browser.tabs.create({url: 'options.html'});
			break;
		case S.report:
			await browser.tabs.create({url: 'https://github.com/fairstar14/Tab-Manager-Plus/issues'});
			break;
		case S.source:
			await browser.tabs.create({url: 'https://github.com/fairstar14/Tab-Manager-Plus'});
			break;
		case S.send:
			await browser.tabs.create({url: 'https://github.com/fairstar14/Tab-Manager-Plus/issues'});
			break;

	}
}