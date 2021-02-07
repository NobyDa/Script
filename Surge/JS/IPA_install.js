/*
 * iOS14 IPA辅助安装脚本.
 *
 * 该脚本仅兼容Surge4.0+, 可解决iOS14或IPadOS14无法在移动端安装IPA的问题. 
 * 注: 该脚本需要使用"Shu+捷径"或"Jsbox"辅助安装. 具体安装演示请移步TG频道 @NobyDa 查看.
 *
 * 作者: @NobyDa
 *
 * Surge模块地址: https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/IPA_install.sgmodule
 * 
 * Jsbox辅助安装脚本: https://gist.githubusercontent.com/NobyDa/2489e84ca833a9ae559c2cf534b9cdc8/raw/IPA_Jsbox.js
 *
 * 捷径地址: https://www.icloud.com/shortcuts/53a7dad769c6453ca2ee54fa2a021ea2
 *
 */

const eva = $request;
const ipaUrl = eva.url.match(/\/jsbox/) ? "http://localhost:8080/download?path=%2Fapp.ipa" : "http://localhost/";
if (eva.url.match(/install/)) {
	$httpClient.head(ipaUrl, (err, resp, data) => {
		if (resp && resp.headers && JSON.stringify(resp.headers).match(/UTF-8''.+?\.ipa/) && resp.status == 200) {
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
					<string>https://nobyda/download${eva.url.match(/jsbox/)?"/jsbox":""}</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>*</string>
				<key>bundle-version</key>
				<string>1.0</string>
				<key>kind</key>
				<string>software</string>
				<key>title</key>
				<string>${decodeURIComponent(JSON.stringify(resp.headers).match(/UTF-8''(.+?)\.ipa/)[1])}</string>
			</dict>
		</dict>
	</array>
</dict>
</plist>`;
			$done({
				response: {
					status: 200,
					body: plist
				}
			});
		} else {
			$notification.post('APP安装失败', '', '无法读取IPA安装包');
			$done()
		}
	})
} else if (eva.method == "GET") {
	$httpClient.head(ipaUrl, (err, resp, data) => {
		if (resp && resp.headers && resp.status == 200) {
			const name = `正在安装: ${JSON.stringify(resp.headers).match(/UTF-8''(.+?)\.ipa/)[1]} ...`
			const size = `应用大小: ${(resp.headers['Content-Length'] / 1000 / 1000).toFixed(2)} MB`
			$notification.post(decodeURIComponent(name), size, '');
		} else {
			$notification.post('APP安装失败', '', `无法下载IPA安装包`);
		}
		$done({
			url: ipaUrl
		});
	})
} else {
	$done({
		url: ipaUrl
	});
}