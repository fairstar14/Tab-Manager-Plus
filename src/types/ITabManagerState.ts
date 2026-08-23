import * as browser from "webextension-polyfill";
import {ISavedSession} from "@types";

export interface ITabManagerState {
	tabCount: number,
	hiddenCount: number,

	animations: boolean,
	badge: boolean,
	compact: boolean,
	dark: boolean,
	filterTabs: boolean,
	hideWindows: boolean,
	lastOpenWindow: number,
	layout: string,
	openInOwnTab: boolean,
	sessionsFeature: boolean,
	tabHeight: number,
	tabLimit: number,
	tabWidth: number,
	tabactions: boolean,
	windowTitles: boolean,

	windows: browser.Windows.Window[],
	sessions: ISavedSession[],
	selection: Set<number>,
	hiddenTabs: Set<number>,
	dupGroups: Map<number, number>,
	tabsbyid: Map<number, browser.Tabs.Tab>,
	windowsbyid: Map<number, browser.Windows.Window>,

	lastSelect: number,
	searchLen: number,
	searchMode: string,
	height: number,
	hasScrollBar: boolean,
	focusUpdates: number,
	topText: string,
	bottomText: string,
	lastDirection: string,
	optionsActive: boolean,
	dupTabs: boolean,
	dragFavicon: string,
	colorsActive: number,

	connectLines: boolean,
	connectLinesData: Array<{ x1: number; y1: number; x2: number; y2: number; group: number }>,
	connectLinesColors: string[],

	resetTimeout: number
}