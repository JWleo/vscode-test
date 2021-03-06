/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import { parse as parseUrl } from 'url';
import * as https from 'https';

let downloadPlatform;

switch (process.platform) {
	case 'darwin':
		downloadPlatform = 'darwin';
		break;
	case 'win32':
		downloadPlatform = 'win32-archive';
		break;
	default:
		downloadPlatform = 'linux-x64';
}

export function getVSCodeDownloadUrl(version: string) {
	if (version === 'insiders') {
		return `https://update.code.visualstudio.com/latest/${downloadPlatform}/insider`;
	}
	return `https://update.code.visualstudio.com/${version}/${downloadPlatform}/stable`;
}

const HttpsProxyAgent = require('https-proxy-agent');
const HttpProxyAgent = require('http-proxy-agent');

let PROXY_AGENT = undefined;
let HTTPS_PROXY_AGENT = undefined;

if (process.env.npm_config_proxy) {
	PROXY_AGENT = new HttpProxyAgent(process.env.npm_config_proxy);
	HTTPS_PROXY_AGENT = new HttpsProxyAgent(process.env.npm_config_proxy);
}
if (process.env.npm_config_https_proxy) {
	HTTPS_PROXY_AGENT = new HttpsProxyAgent(process.env.npm_config_https_proxy);
}

export function urlToOptions(url: string): https.RequestOptions {
	const options: https.RequestOptions = parseUrl(url);
	if (PROXY_AGENT && options.protocol.startsWith('http:')) {
		options.agent = PROXY_AGENT;
	}

	if (HTTPS_PROXY_AGENT && options.protocol.startsWith('https:')) {
		options.agent = HTTPS_PROXY_AGENT;
	}
	return options;
}

export function downloadDirToExecutablePath(dir: string) {
	if (process.platform === 'win32') {
		return path.resolve(dir, 'Code.exe');
	} else if (process.platform === 'darwin') {
		return path.resolve(dir, 'Visual Studio Code.app/Contents/MacOS/Electron');
	} else {
		return path.resolve(dir, 'VSCode-linux-x64/code');
	}
}

export function insidersDownloadDirToExecutablePath(dir: string) {
	if (process.platform === 'win32') {
		return path.resolve(dir, 'Code - Insiders.exe');
	} else if (process.platform === 'darwin') {
		return path.resolve(dir, 'Visual Studio Code - Insiders.app/Contents/MacOS/Electron');
	} else {
		return path.resolve(dir, 'VSCode-linux-x64/code-insiders');
	}
}
