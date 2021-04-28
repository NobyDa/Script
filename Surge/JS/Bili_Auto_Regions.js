/**************************

哔哩哔哩, 港澳台番剧自动切换地区 & 显示豆瓣评分

如需禁用豆瓣评分, 可前往BoxJs设置.
BoxJs订阅地址: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

Update: 2021.04.28
Author: @NobyDa
Use: Surge, QuanX, Loon

****************************
港澳台自动切换地区说明 :
****************************

地区自动切换功能仅适用于Surge4.7+ (iOS), 低于该版本或其他APP仅显示豆瓣评分.
地区自动切换功能仅适用于Surge4.7+ (iOS), 低于该版本或其他APP仅显示豆瓣评分.
地区自动切换功能仅适用于Surge4.7+ (iOS), 低于该版本或其他APP仅显示豆瓣评分.

您需要配置相关规则集（https://raw.githubusercontent.com/DivineEngine/Profiles/master/Surge/Ruleset/StreamingMedia/StreamingSE.list）绑定相关select策略组，并且需要具有相关的区域代理服务器纳入您的子策略中。
最后，您可以通过BoxJs设置策略名和子策略名，或者手动填入脚本.

***************************
Surge 4.7+ 远程脚本配置 :
****************************

[Script]
Bili Region = type=http-response,pattern=^https:\/\/ap(p|i)\.bilibili\.com\/(pgc\/view\/(v\d\/)?app|x(\/v\d)?\/view\/video)\/(season|online)\?access_key,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

[MITM]
hostname = ap?.bilibili.com

****************************
Quantumult X 远程脚本配置 :
****************************

[rewrite_local]
^https:\/\/ap(p|i)\.bilibili\.com\/(pgc\/view\/(v\d\/)?app|x(\/v\d)?\/view\/video)\/(season|online)\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

[mitm]
hostname = ap?.bilibili.com

[filter_local]
#可选, 由于qx纯tun特性, 不添加规则可能会导致脚本失效.
ip-cidr, 203.107.1.1/24, reject

***************************/

let body = JSON.parse($response.body);
const $ = nobyda();
const play = body.data || body.result || {};
const run = $.isSurge ? SwitchRegion() : QueryRating();

async function SwitchRegion() {
	const Group = $.read('BiliArea_Policy') || '📺 DomesticMedia'; //Your blibli policy group name.
	const CN = $.read('BiliArea_CN') || 'DIRECT'; //Your China sub-policy name.
	const TW = $.read('BiliArea_TW') || '🇹🇼 sub-policy'; //Your Taiwan sub-policy name.
	const HK = $.read('BiliArea_HK') || '🇭🇰 sub-policy'; //Your HongKong sub-policy name.
	const current = await $.getPolicy(Group) || 'Policy error ⚠️';
	const area = (() => {
		if (/\u50c5[\u4e00-\u9fa5]+\u6e2f/.test(play.title)) {
			if (current != HK) return HK;
		} else if (/\u50c5[\u4e00-\u9fa5]+\u53f0/.test(play.title)) {
			if (current != TW) return TW;
		} else if (current != CN) return CN;
	})()

	if (area) {
		const change = await $.setPolicy(Group, area);
		const notify = $.read('BiliAreaNotify') === 'true';
		if (!notify) $.notify(play.title || ``, ``, `${current}  =>  ${area}  =>  ${change?`🟢`:`🔴`}`);
		if (change) {
			$done(); //Kill the connection. Due to the characteristics of Surge, it will auto reconnect with the new policy.
		} else {
			QueryRating();
		}
	} else {
		QueryRating();
	}
}

async function QueryRating() {
	try {
		const ratingEnabled = $.read('BiliDoubanRating') === 'false';
		if (!ratingEnabled && play.title && body.data && body.data.badge_info) {
			const [t1, t2] = await Promise.all([
				GetRawInfo(play.title),
				GetRawInfo(play.origin_name)
			]);
			const exYear = body.data.publish.release_date_show.split(/^(\d{4})/)[1];
			const filterInfo = [play.title, play.origin_name, play.staff.info + play.actor.info, exYear];
			const [rating, folk, name, id, other] = ExtractMovieInfo([...t1, ...t2], filterInfo);
			body.data.detail = body.data.new_ep.desc.replace(/连载中,/, '');
			body.data.badge_info.text = `⭐️ 豆瓣：${!$.is403?`${rating||'无评'}分 (${folk||'无评价'})`:`查询频繁！`}`;
			body.data.evaluate = `${body.data.evaluate||''}\n\n豆瓣评分搜索结果: ${JSON.stringify(other,0,1)}`;
			body.data.new_ep.desc = name;
			body.data.styles.unshift({
				name: "⭐️ 点击此处打开豆瓣剧集详情页",
				url: `https://m.douban.com/${id?`movie/subject/${id}/`:`search/?query=${encodeURI(play.title)}`}`
			});
		}
	} catch (err) {
		console.log(`Douban rating: \n${err}\n`);
	} finally {
		$done({
			body: JSON.stringify(body)
		});
	}
}

function ExtractMovieInfo(ret, fv) {
	const sole = new Set(ret.map(s => JSON.stringify(s))); //delete duplicate
	const f1 = [...sole].map(p => JSON.parse(p))
		.filter(t => {
			t.accuracy = 0;
			if (t.name && fv[0]) { //title
				if (t.name.includes(fv[0].slice(0, 4))) t.accuracy++;
				if (t.name.includes(fv[0].slice(-3))) t.accuracy++;
			}
			if (t.origin && fv[1]) { //origin title
				if (t.origin.includes(fv[1].slice(0, 4))) t.accuracy++;
				if (t.origin.includes(fv[1].slice(-3))) t.accuracy++;
			}
			if (t.pd && fv[2]) { //producer or actor
				const len = t.pd.split('/').filter(c => fv[2].includes(c));
				t.accuracy += len.length;
			}
			if (t.year && fv[3] && t.year == fv[3]) t.accuracy++; //year
			return Boolean(t.accuracy);
		});
	let x = {}; //assign most similar
	const f2 = f1.reduce((p, c, i) => c.accuracy > p ? (x = c, c.accuracy) : p, 0);
	return [x.rating, x.folk, x.name, x.id, f1];
}

function GetRawInfo(t) {
	let res = [];
	let st = Date.now();
	return new Promise((resolve) => {
		if (!t) return resolve(res);
		$.get({
			url: `https://www.douban.com/search?cat=1002&q=${encodeURIComponent(t)}`,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
				'Cookie': JSON.stringify(st)
			}
		}, (error, resp, data) => {
			if (error) {
				console.log(`Douban rating: \n${t}\nRequest error: ${error}\n`);
			} else {
				if (resp.status == 403) $.is403 = true;
				let s = data.replace(/\n| |&#\d{2}/g, '')
					.match(/\[\u7535\u5f71\].+?subject-cast\">.+?<\/span>/g) || [];
				for (let i = 0; i < s.length; i++) {
					res.push({
						name: s[i].split(/\}\)">(.+?)<\/a>/)[1],
						origin: s[i].split(/\u540d:(.+?)(\/|<)/)[1],
						pd: s[i].split(/\u539f\u540d.+?\/(.+?)\/\d+<\/span>$/)[1],
						rating: s[i].split(/">(\d\.\d)</)[1],
						folk: s[i].split(/(\d+\u4eba\u8bc4\u4ef7)/)[1],
						id: s[i].split(/sid:(\d+)/)[1],
						year: s[i].split(/(\d+)<\/span>$/)[1]
					})
				}
				let et = ((Date.now() - st) / 1000).toFixed(2);
				console.log(`Douban rating: \n${t}\n${res.length} movie info searched. (${et} s)\n`);
			}
			resolve(res);
		})
	})
}

function nobyda() {
	const isHTTP = typeof $httpClient != "undefined";
	const isLoon = typeof $loon != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isSurge = typeof $network != "undefined" && typeof $script != "undefined";
	const notify = (title, subtitle, message) => {
		console.log(`${title}\n${subtitle}\n${message}`);
		if (isQuanX) $notify(title, subtitle, message);
		if (isHTTP) $notification.post(title, subtitle, message);
	}
	const read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key);
		if (isHTTP) return $persistentStore.read(key);
	}
	const adapterStatus = (response) => {
		if (!response) return null;
		if (response.status) {
			response["statusCode"] = response.status;
		} else if (response.statusCode) {
			response["status"] = response.statusCode;
		}
		return response;
	}
	const getPolicy = (groupName) => {
		if (isSurge) {
			if (typeof($httpAPI) === 'undefined')
				return `切换策略失败, 请升级您的Surge\n`;
			return new Promise((resolve) => {
				$httpAPI("GET", "v1/policy_groups/select", {
					group_name: encodeURIComponent(groupName)
				}, (body) => resolve(body.policy))
			})
		}
		if (isLoon) {
			const get = JSON.parse($config.getConfig());
			return get.policy_select[groupName];
		}
	}
	const setPolicy = (group, policy) => {
		if (isSurge && typeof($httpAPI) !== 'undefined') {
			return new Promise((resolve) => {
				$httpAPI("POST", "v1/policy_groups/select", {
					group_name: group,
					policy: policy
				}, (body) => resolve(!body.error))
			})
		}
		if (isLoon) {
			const set = $config.setSelectPolicy(group, policy);
			return getPolicy(group) === policy;
		}
	}
	const get = (options, callback) => {
		if (isQuanX) {
			options["method"] = "GET";
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isHTTP) {
			if (isSurge) options.headers['X-Surge-Skip-Scripting'] = false;
			$httpClient.get(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	return {
		getPolicy,
		setPolicy,
		isSurge,
		isLoon,
		notify,
		read,
		get
	}
}