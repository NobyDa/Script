/*
 * iOS IPA应用辅助安装脚本.
 * 
 * 兼容: QuantumultX、Surge5，Loon、Shadowrocket、Stash
 * 作者: @NobyDa
 * 
 * 快捷指令 + Shu配合安装:
 * 导入IPA文件至Shu -> Shu长按IPA文件 -> 导出文件 -> WiFi传输 -> 本机 -> 系统共享 -> 分享至IPA-Installer快捷指令
 * 
 * 快捷指令 + JSBox/Pythonista配合安装:
 * IPA文件长按分享至IPA-Installer快捷指令(iOS14跳过)，完成后再分享至Jsbox/pythonista分享扩展. 
 * 
 * 
 * QuanX重写: https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/IPA-Installer.snippet
 * 
 * Surge模块: https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/IPA_install.sgmodule
 * 
 * loon插件: https://raw.githubusercontent.com/NobyDa/Script/master/Loon/Loon_IPA_Installer.plugin
 * 
 * Stash覆写: https://raw.githubusercontent.com/NobyDa/Script/master/Stash/IPA-Installer.stoverride
 * 
 * 快捷指令(iOS15+): https://www.icloud.com/shortcuts/4a121aa54cae4619a952baa29e044e30
 * 
 * 快捷指令(iOS14): https://www.icloud.com/shortcuts/179dfcd7505e44f89207086d2b1a32ea
 * 
 * JSBox脚本: https://xteko.com/redir?url=https%3A%2F%2Fraw.githubusercontent.com%2FNobyDa%2FScript%2Fmaster%2FIPA-Installer%2FIPA-Installer-JSBox.js&name=IPA%20Installer%20%28NobyDa%29
 * 
 * Pythonista脚本: https://github.com/NobyDa/Script/blob/master/IPA-Installer/IPA-Installer-Pythonista.py
 */

const $ = new compatible_tool();

(async function () {
	const args = urlArgs($request.url);
	const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>items</key>
	<array>
		<dict>
			<key>assets</key>
			<array>
				<dict>
					<key>kind</key>
					<string>software-package</string>
					<key>url</key>
					<string>https://nobyda.app/download?url=${encodeURIComponent(args.url)}</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>${args.bundleId || $.read("nobyda_ipa_bundle_id") || "*"}</string>
				<key>bundle-version</key>
				<string>1.0</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>IPA</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>`;
	if ($request.url.includes("/install?")) {
		if (args.bundleId) {
			$.write(args.bundleId, "nobyda_ipa_bundle_id");
		};
		$.resp = { response: { status: 200, body: args.client && plist || "{}" } };
	} else {
		if ($request.method == "GET") {
			const size = await ipaSize(args.url);
			$.notify(`IPA Installer`, ``, size && `Installing IPA, Size: ${size} MB` || `HTTP local server read failed!`);
		}
		$.resp = { response: { status: 307, headers: { Location: args.url }, body: "{}" } };
	}
})()
	.catch((e) => $.notify(`IPA Installer`, ``, `ERROR: ${e.message || e}\nPATH: ${e.stack}`))
	.finally(() => $.done($.resp))


function ipaSize(url) {
	return new Promise((r, e) => {
		$.http({ method: "head", url: url, policy: "DIRECT", }, (e, h, d) => {
			r(h && h.status == 200 && `${((h.headers["Content-Length"] || 0) / 1000 / 1000).toFixed(2)}`)
		});
		setTimeout(() => r(), 1000)
	});
}

function urlArgs(str) {
	return Object.fromEntries(
		(str.startsWith("http") && str.split("?")[1] || str).split("&")
			.map((item) => item.split("="))
			.map(([k, v]) => [k, decodeURIComponent(v)])
	);
}

function compatible_tool() {
	const isSurge = typeof $httpClient != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isStash = typeof $environment == "object" && $environment["stash-version"];
	const adapterStatus = (response) => {
		if (response && response.statusCode) {
			response.status = response.statusCode;
		}
		return response
	};
	this.read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key);
		if (isSurge) return $persistentStore.read(key);
	};
	this.write = (value, key) => {
		if (isQuanX) return $prefs.setValueForKey(value, key);
		if (isSurge) return $persistentStore.write(value, key);
	};
	this.notify = (title, subtitle, message) => {
		if (isQuanX) $notify(title, subtitle, message);
		if (isSurge) $notification.post(title, subtitle, message);
	};
	this.http = (options, callback) => {
		if (options.policy) {
			options.node = options.policy;
			options.opts = { policy: options.policy };
			if (isStash) options.headers = {
				...options.headers,
				...{ "X-Stash-Selected-Proxy": encodeURIComponent(options.policy) }
			};
		}
		if (isQuanX) {
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			$httpClient[options.method](options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	};
	this.done = (value = {}) => {
		if (value.response && isQuanX) {
			value.response.status = `HTTP/1.1 ${value.response.status}`;
		}
		$done((value.response && isQuanX) ? value.response : value)
	}
};