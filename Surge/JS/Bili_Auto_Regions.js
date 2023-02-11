/**************************

哔哩哔哩(白图标外区版), 港澳台番剧自动切换地区 & 显示豆瓣评分

如需禁用豆瓣评分或策略通知, 可前往BoxJs设置.
BoxJs订阅地址: https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

Update: 2023.02.11
Author: @NobyDa
Use: Surge, QuanX, Loon

****************************
港澳台自动切换地区说明 :
****************************

地区自动切换功能仅适用于Surge4.7+(iOS)，Loon2.1.10(286)+，QuanX1.0.22(543)+
低于以上版本仅显示豆瓣评分.

您需要配置相关规则集:
Surge、Loon: 
https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Bilibili.list

QuanX: 
https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Bilibili.list

绑定相关select或static策略组，并且需要具有相关的区域代理服务器纳入您的子策略中，子策略可以是服务器也可以是其他区域策略组．
最后，您可以通过BoxJs设置策略名和子策略名，或者手动填入脚本.

如需搜索指定地区番剧, 可在搜索框添加后缀" 港", " 台", " 中". 例如: 进击的巨人 港

QX用户注: 使用切换地区功能请确保您的QX=>其他设置=>温和策略机制处于关闭状态, 以及填写策略名和子策略名时注意大小写.

****************************
Surge 4.7+ 远程脚本配置 :
****************************
[Script]
Bili Region = type=http-response,pattern=^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/(pgc\/view\/v\d\/app\/season|x\/offline\/version)\?,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

#可选, 适用于搜索指定地区的番剧
Bili Search = type=http-request,pattern=^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/x\/v\d\/search(\/type)?\?.+?%20(%E6%B8%AF|%E5%8F%B0|%E4%B8%AD)&,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

[MITM]
hostname = ap?.bili*i.com, ap?.bili*i.net

****************************
Quantumult X 远程脚本配置 :
****************************
[rewrite_local]
^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/(pgc\/view\/v\d\/app\/season|x\/offline\/version)\? url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

#可选, 适用于搜索指定地区的番剧
^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/x\/v\d\/search(\/type)?\?.+?%20(%E6%B8%AF|%E5%8F%B0|%E4%B8%AD)& url script-request-header https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js

[mitm]
hostname = ap?.bili*i.com, ap?.bili*i.net

[filter_local]
#可选, 由于qx纯tun特性, 不添加规则可能会导致脚本失效. https://github.com/NobyDa/Script/issues/382
ip-cidr, 203.107.1.1/24, reject

****************************
Loon 远程脚本配置 :
****************************
[Script]
http-response ^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/(pgc\/view\/v\d\/app\/season|x\/offline\/version)\? script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js, requires-body=true, tag=bili自动地区

#可选, 适用于搜索指定地区的番剧
http-request ^https:\/\/ap(p|i)\.bili(bili|api)\.(com|net)\/x\/v\d\/search(\/type)?\?.+?%20(%E6%B8%AF|%E5%8F%B0|%E4%B8%AD)& script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Bili_Auto_Regions.js, tag=bili自动地区(搜索)

[Mitm]
hostname = ap?.bili*i.com, ap?.bili*i.net

***************************/

let $ = nobyda();
let run = EnvInfo();

async function SwitchRegion(title, url, body) {
	const Group = $.read('BiliArea_Policy') || '📺 DomesticMedia'; //Your blibli policy group name.
	const CN = $.read('BiliArea_CN') || 'DIRECT'; //Your China sub-policy name.
	const TW = $.read('BiliArea_TW') || '🇹🇼 sub-policy'; //Your Taiwan sub-policy name.
	const HK = $.read('BiliArea_HK') || '🇭🇰 sub-policy'; //Your HongKong sub-policy name.
	const DF = $.read('BiliArea_DF') || '🏁 sub-policy'; //Sub-policy name used after region is blocked(e.g. url 404)
	const off = $.read('BiliArea_disabled') || ''; //WiFi blacklist(disable region change), separated by commas.
	const current = await $.getPolicy(Group);
	const area = (() => {
		let select = {};
		let chtMatch = title && title.split('').some(v => zhHans().includes(v));
		if (/\u6e2f[\u4e00-\u9fa5]+\u5340|%20%E6%B8%AF&/.test(title || url)) {
			const test = /\u53f0[\u4e00-\u9fa5]+\u5340/.test(title);
			if (current != HK && (current == TW && test ? 0 : 1))
				select = { policy: HK, mode: '香港' };
		} else if (/\u53f0[\u4e00-\u9fa5]+\u5340|%20%E5%8F%B0&/.test(title || url)) {
			if (current != TW) select = { policy: TW, mode: '台湾' };
		} else if (body.code === -404 || chtMatch) {
			if (current != DF) select = { policy: DF, mode: '后备' };
		} else if (current != CN) {
			select = { policy: CN, mode: '直连' };
		}
		if ($.isQuanX && current === 'direct' && select.policy === 'DIRECT') {
			select = {}; //prevent loopback in some cases
		}
		return select;
	})()

	if (area.policy && !off.includes($.ssid || undefined)) {
		const change = await $.setPolicy(Group, area.policy);
		const msg = (() => {
			if (change && typeof current !== 'number') {
				return `${current} ➤ ${area.policy}`;
			} else if (current === 2) {
				return `策略组名未填写或填写有误 ⚠️`
			} else if (current === 3) {
				return `不支持您的VPN应用版本 ⚠️`
			} else if (change === 0) {
				return `子策略名未填写或填写有误 ⚠️`
			} else {
				return `未知错误 ⚠️`
			}
		})()
		if ($.read('BiliAreaNotify') === 'true') {
			console.log(`${title || ''}\n模式: 策略组使用"${area.mode}"子策略\n走向: ${msg}`);
		} else {
			$.notify(title || '', ``, `模式: 策略组使用"${area.mode}"子策略\n走向: ${msg}`);
		}
		if (change) {
			return true;
		}
	}
	return false;
}

function EnvInfo() {
	const url = $request.url;
	if (typeof ($response) !== 'undefined') {
		const raw = JSON.parse($response.body || "{}");
		const data = raw.data || raw.result || {};
		const title = [data.title, data.series && data.series.series_title, data.season_title]
			.filter(c => /\u5340\uff09/.test(c))[0] || data.title;
		SwitchRegion(title, null, raw)
			.then(s => s ? $done({
				status: $.isQuanX ? "HTTP/1.1 307" : 307,
				headers: {
					Location: url
				},
				body: "{}"
			}) : QueryRating(raw, data));
	} else {
		const res = {
			url: url.replace(/%20(%E6%B8%AF|%E5%8F%B0|%E4%B8%AD)&/g, '&')
		};
		SwitchRegion(null, url, {}).then(() => $done(res));
	}
}

async function QueryRating(body, play) {
	try {
		const ratingEnabled = $.read('BiliDoubanRating') === 'false';
		if (!ratingEnabled && play.title && body.data && body.data.badge_info) {
			const [t1, t2] = await Promise.all([
				GetRawInfo(play.title.replace(/\uff08[\u4e00-\u9fa5]+\u5340\uff09/, '')),
				GetRawInfo(play.origin_name)
			]);
			const exYear = body.data.publish.release_date_show.split(/^(\d{4})/)[1];
			const info1 = (play.staff && play.staff.info) || '';
			const info2 = (play.actor && play.actor.info) || '';
			const info3 = (play.celebrity && play.celebrity.map(n => n.name).join('/')) || '';
			const filterInfo = [play.title, play.origin_name, info1 + info2 + info3, exYear];
			const [rating, folk, name, id, other] = ExtractMovieInfo([...t1, ...t2], filterInfo);
			const limit = JSON.stringify(body.data.modules)
				.replace(/"\u53d7\u9650"/g, `""`).replace(/("area_limit":)1/g, '$10');
			body.data.modules = JSON.parse(limit);
			body.data.detail = body.data.new_ep.desc.replace(/连载中,/, '');
			body.data.badge_info.text = `⭐️ 豆瓣：${!$.is403 ? `${rating || '无评'}分 (${folk || '无评价'})` : `查询频繁！`}`;
			body.data.evaluate = `${body.data.evaluate || ''}\n\n豆瓣评分搜索结果: ${JSON.stringify(other, 0, 1)}`;
			body.data.new_ep.desc = name;
			body.data.styles.unshift({
				name: "⭐️ 点击此处打开豆瓣剧集详情页",
				url: `https://m.douban.com/${id ? `movie/subject/${id}/` : `search/?query=${encodeURI(play.title)}`}`
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
	const f2 = f1.reduce((p, c) => c.accuracy > p ? (x = c, c.accuracy) : p, 0);
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
				if (/\u767b\u5f55<\/a>\u540e\u91cd\u8bd5\u3002/.test(data)) $.is403 = true;
				let s = data.replace(/\n| |&#\d{2}/g, '')
					.match(/\[(\u7535\u5f71|\u7535\u89c6\u5267)\].+?subject-cast\">.+?<\/span>/g) || [];
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
	const ssid = (() => {
		if (isQuanX && typeof ($environment) !== 'undefined') {
			return $environment.ssid;
		}
		if (isSurge && $network.wifi) {
			return $network.wifi.ssid;
		}
		if (isLoon) {
			return JSON.parse($config.getConfig()).ssid;
		}
	})();
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
			if (typeof ($httpAPI) === 'undefined') return 3;
			return new Promise((resolve) => {
				$httpAPI("GET", "v1/policy_groups/select", {
					group_name: encodeURIComponent(groupName)
				}, (b) => resolve(b.policy || 2))
			})
		}
		if (isLoon) {
			if (typeof ($config.getPolicy) === 'undefined') return 3;
			const getName = $config.getPolicy(groupName);
			return getName || 2;
		}
		if (isQuanX) {
			if (typeof ($configuration) === 'undefined') return 3;
			return new Promise((resolve) => {
				$configuration.sendMessage({
					action: "get_policy_state"
				}).then(b => {
					if (b.ret && b.ret[groupName]) {
						resolve(b.ret[groupName][1]);
					} else resolve(2);
				}, () => resolve());
			})
		}
	}
	const setPolicy = (group, policy) => {
		if (isSurge && typeof ($httpAPI) !== 'undefined') {
			return new Promise((resolve) => {
				$httpAPI("POST", "v1/policy_groups/select", {
					group_name: group,
					policy: policy
				}, (b) => resolve(!b.error || 0))
			})
		}
		if (isLoon && typeof ($config.getPolicy) !== 'undefined') {
			const set = $config.setSelectPolicy(group, policy);
			return set || 0;
		}
		if (isQuanX && typeof ($configuration) !== 'undefined') {
			return new Promise((resolve) => {
				$configuration.sendMessage({
					action: "set_policy_state",
					content: {
						[group]: policy
					}
				}).then((b) => resolve(!b.error || 0), () => resolve());
			})
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
		isQuanX,
		isLoon,
		notify,
		read,
		ssid,
		get
	}
}

// https://zh.wikipedia.org/wiki/Wikipedia:Unihan%E7%B9%81%E7%AE%80%E4%BD%93%E5%AF%B9%E7%85%A7%E8%A1%A8/%E7%B9%81%E7%AE%80%E4%B8%80%E4%B8%80%E5%AF%B9%E5%BA%94%E8%A1%A8
function zhHans() {
	return `䊷䋙䝼䰾䲁丟並乾亂亞佇馀併來侖侶俁係俔俠倀倆倈倉個們倫偉側偵偽傑傖傘備傭傯傳傴債傷傾僂僅僉僑僕僞僥僨價儀儂億儈儉儐儔儕儘償優儲儷儺儻儼兌兒兗內兩冊冪凈凍凜凱別刪剄則剋剎剗剛剝剮剴創劃劇劉劊劌劍劑勁動務勛勝勞勢勩勱勵勸勻匭匯匱區協卻厙厠厭厲厴參叄叢吒吳吶呂咼員唄唚問啓啞啟啢喎喚喪喬單喲嗆嗇嗊嗎嗚嗩嗶嘆嘍嘔嘖嘗嘜嘩嘮嘯嘰嘵嘸嘽噓噝噠噥噦噯噲噴噸噹嚀嚇嚌嚕嚙嚦嚨嚲嚳嚴嚶囀囁囂囅囈囑囪圇國圍園圓圖團垵埡埰執堅堊堖堝堯報場塊塋塏塒塗塢塤塵塹墊墜墮墳墻墾壇壈壋壓壘壙壚壞壟壠壢壩壯壺壼壽夠夢夾奐奧奩奪奬奮奼妝姍姦娛婁婦婭媧媯媼媽嫗嫵嫻嫿嬀嬈嬋嬌嬙嬡嬤嬪嬰嬸孌孫學孿宮寢實寧審寫寬寵寶將專尋對導尷屆屍屓屜屢層屨屬岡峴島峽崍崗崢崬嵐嶁嶄嶇嶔嶗嶠嶢嶧嶮嶴嶸嶺嶼巋巒巔巰帥師帳帶幀幃幗幘幟幣幫幬幹幺幾庫廁廂廄廈廚廝廟廠廡廢廣廩廬廳弒弳張強彈彌彎彙彞彥後徑從徠復徵徹恆恥悅悞悵悶惡惱惲惻愛愜愨愴愷愾慄態慍慘慚慟慣慤慪慫慮慳慶憂憊憐憑憒憚憤憫憮憲憶懇應懌懍懟懣懨懲懶懷懸懺懼懾戀戇戔戧戩戰戱戲戶拋拾挩挾捨捫掃掄掗掙掛採揀揚換揮損搖搗搵搶摑摜摟摯摳摶摻撈撏撐撓撝撟撣撥撫撲撳撻撾撿擁擄擇擊擋擓擔據擠擬擯擰擱擲擴擷擺擻擼擾攄攆攏攔攖攙攛攜攝攢攣攤攪攬敗敘敵數斂斃斕斬斷時晉晝暈暉暘暢暫曄曆曇曉曏曖曠曨曬書會朧東杴极柵桿梔梘條梟梲棄棖棗棟棧棲棶椏楊楓楨業極榪榮榲榿構槍槤槧槨槳樁樂樅樓標樞樣樸樹樺橈橋機橢橫檁檉檔檜檟檢檣檮檯檳檸檻櫃櫓櫚櫛櫝櫞櫟櫥櫧櫨櫪櫫櫬櫱櫳櫸櫻欄權欏欒欖欞欽歐歟歡歲歷歸歿殘殞殤殨殫殮殯殲殺殻殼毀毆毿氂氈氌氣氫氬氳決沒沖況洶浹涇涼淚淥淪淵淶淺渙減渦測渾湊湞湯溈準溝溫滄滅滌滎滬滯滲滷滸滻滾滿漁漚漢漣漬漲漵漸漿潁潑潔潙潛潤潯潰潷潿澀澆澇澗澠澤澦澩澮澱濁濃濕濘濟濤濫濰濱濺濼濾瀅瀆瀉瀏瀕瀘瀝瀟瀠瀦瀧瀨瀲瀾灃灄灑灕灘灝灠灣灤灧災為烏烴無煉煒煙煢煥煩煬熅熒熗熱熲熾燁燈燉燒燙燜營燦燭燴燼燾爍爐爛爭爲爺爾牆牘牽犖犢犧狀狹狽猙猶猻獁獄獅獎獨獪獫獮獰獲獵獷獸獺獻獼玀現琺琿瑋瑒瑣瑤瑩瑪瑲璉璣璦璫環璽瓊瓏瓔瓚甌產産畝畢異畵當疇疊痙痾瘂瘋瘍瘓瘞瘡瘧瘮瘲瘺瘻療癆癇癉癘癟癢癤癥癧癩癬癭癮癰癱癲發皚皰皸皺盜盞盡監盤盧眥眾睏睜睞瞘瞜瞞瞶瞼矓矚矯硜硤硨硯碩碭碸確碼磑磚磣磧磯磽礆礎礙礦礪礫礬礱祿禍禎禕禡禦禪禮禰禱禿秈稅稈稟種稱穀穌積穎穠穡穢穩穫穭窩窪窮窯窵窶窺竄竅竇竈竊竪競筆筍筧筴箋箏節範築篋篔篤篩篳簀簍簞簡簣簫簹簽簾籃籌籙籜籟籠籩籪籬籮粵糝糞糧糲糴糶糹糾紀紂約紅紆紇紈紉紋納紐紓純紕紖紗紘紙級紛紜紝紡紬細紱紲紳紵紹紺紼紿絀終組絅絆絎結絕絛絝絞絡絢給絨絰統絲絳絶絹綁綃綆綈綉綌綏經綜綞綠綢綣綫綬維綯綰綱網綳綴綸綹綺綻綽綾綿緄緇緊緋緑緒緓緔緗緘緙線緝緞締緡緣緦編緩緬緯緱緲練緶緹緻縈縉縊縋縐縑縕縗縛縝縞縟縣縧縫縭縮縱縲縳縵縶縷縹總績繃繅繆繒織繕繚繞繡繢繩繪繫繭繮繯繰繳繸繹繼繽繾纈纊續纍纏纓纖纘纜缽罈罌罰罵罷羅羆羈羋羥義習翹耬耮聖聞聯聰聲聳聵聶職聹聽聾肅脅脈脛脫脹腎腖腡腦腫腳腸膃膚膠膩膽膾膿臉臍臏臘臚臟臠臢臨臺與興舉舊艙艤艦艫艱艷芻苎苧茲荊莊莖莢莧華萇萊萬萵葉葒著葤葦葯葷蒓蒔蒞蒼蓀蓋蓮蓯蓴蓽蔔蔞蔣蔥蔦蔭蕁蕆蕎蕒蕓蕕蕘蕢蕩蕪蕭蕷薀薈薊薌薔薘薟薦薩薴薺藍藎藝藥藪藴藶藹藺蘄蘆蘇蘊蘋蘚蘞蘢蘭蘺蘿虆處虛虜號虧虯蛺蛻蜆蜡蝕蝟蝦蝸螄螞螢螻螿蟄蟈蟎蟣蟬蟯蟲蟶蟻蠅蠆蠐蠑蠟蠣蠨蠱蠶蠻衆術衕衚衛衝衹袞裊裏補裝裡製複褌褘褲褳褸褻襇襏襖襝襠襤襪襯襲見覎規覓視覘覡覥覦親覬覯覲覷覺覽覿觀觴觶觸訁訂訃計訊訌討訐訒訓訕訖託記訛訝訟訢訣訥訩訪設許訴訶診註詁詆詎詐詒詔評詖詗詘詛詞詠詡詢詣試詩詫詬詭詮詰話該詳詵詼詿誄誅誆誇誌認誑誒誕誘誚語誠誡誣誤誥誦誨說説誰課誶誹誼誾調諂諄談諉請諍諏諑諒論諗諛諜諝諞諢諤諦諧諫諭諮諱諳諶諷諸諺諼諾謀謁謂謄謅謊謎謐謔謖謗謙謚講謝謠謡謨謫謬謭謳謹謾證譎譏譖識譙譚譜譫譯議譴護譸譽譾讀變讎讒讓讕讖讜讞豈豎豐豬豶貓貝貞貟負財貢貧貨販貪貫責貯貰貲貳貴貶買貸貺費貼貽貿賀賁賂賃賄賅資賈賊賑賒賓賕賙賚賜賞賠賡賢賣賤賦賧質賫賬賭賴賵賺賻購賽賾贄贅贇贈贊贋贍贏贐贓贔贖贗贛贜赬趕趙趨趲跡踐踴蹌蹕蹣蹤蹺躂躉躊躋躍躑躒躓躕躚躡躥躦躪軀車軋軌軍軑軒軔軛軟軤軫軲軸軹軺軻軼軾較輅輇輈載輊輒輓輔輕輛輜輝輞輟輥輦輩輪輬輯輳輸輻輾輿轀轂轄轅轆轉轍轎轔轟轡轢轤辦辭辮辯農逕這連進運過達違遙遜遞遠適遲遷選遺遼邁還邇邊邏邐郟郵鄆鄉鄒鄔鄖鄧鄭鄰鄲鄴鄶鄺酇酈醖醜醞醫醬醱釀釁釃釅釋釐釒釓釔釕釗釘釙針釣釤釧釩釵釷釹釺鈀鈁鈃鈄鈈鈉鈍鈎鈐鈑鈒鈔鈕鈞鈣鈥鈦鈧鈮鈰鈳鈴鈷鈸鈹鈺鈽鈾鈿鉀鉅鉈鉉鉋鉍鉑鉕鉗鉚鉛鉞鉢鉤鉦鉬鉭鉶鉸鉺鉻鉿銀銃銅銍銑銓銖銘銚銛銜銠銣銥銦銨銩銪銫銬銱銳銷銹銻銼鋁鋃鋅鋇鋌鋏鋒鋙鋝鋟鋣鋤鋥鋦鋨鋩鋪鋭鋮鋯鋰鋱鋶鋸鋼錁錄錆錇錈錏錐錒錕錘錙錚錛錟錠錡錢錦錨錩錫錮錯録錳錶錸鍀鍁鍃鍆鍇鍈鍋鍍鍔鍘鍚鍛鍠鍤鍥鍩鍬鍰鍵鍶鍺鎂鎄鎇鎊鎔鎖鎘鎛鎡鎢鎣鎦鎧鎩鎪鎬鎮鎰鎲鎳鎵鎸鎿鏃鏇鏈鏌鏍鏐鏑鏗鏘鏜鏝鏞鏟鏡鏢鏤鏨鏰鏵鏷鏹鏽鐃鐋鐐鐒鐓鐔鐘鐙鐝鐠鐦鐧鐨鐫鐮鐲鐳鐵鐶鐸鐺鐿鑄鑊鑌鑒鑔鑕鑞鑠鑣鑥鑭鑰鑱鑲鑷鑹鑼鑽鑾鑿钁長門閂閃閆閈閉開閌閎閏閑間閔閘閡閣閥閨閩閫閬閭閱閲閶閹閻閼閽閾閿闃闆闈闊闋闌闍闐闒闓闔闕闖關闞闠闡闤闥阪陘陝陣陰陳陸陽隉隊階隕際隨險隱隴隸隻雋雖雙雛雜雞離難雲電霢霧霽靂靄靈靚靜靦靨鞀鞏鞝鞽韁韃韉韋韌韍韓韙韜韞韻響頁頂頃項順頇須頊頌頎頏預頑頒頓頗領頜頡頤頦頭頮頰頲頴頷頸頹頻頽顆題額顎顏顒顓顔願顙顛類顢顥顧顫顬顯顰顱顳顴風颭颮颯颱颳颶颸颺颻颼飀飄飆飈飛飠飢飣飥飩飪飫飭飯飲飴飼飽飾飿餃餄餅餉養餌餎餏餑餒餓餕餖餚餛餜餞餡館餱餳餶餷餺餼餾餿饁饃饅饈饉饊饋饌饑饒饗饜饞饢馬馭馮馱馳馴馹駁駐駑駒駔駕駘駙駛駝駟駡駢駭駰駱駸駿騁騂騅騌騍騎騏騖騙騤騫騭騮騰騶騷騸騾驀驁驂驃驄驅驊驌驍驏驕驗驚驛驟驢驤驥驦驪驫骯髏髒體髕髖髮鬆鬍鬚鬢鬥鬧鬩鬮鬱魎魘魚魛魢魨魯魴魷魺鮁鮃鮊鮋鮍鮎鮐鮑鮒鮓鮚鮜鮝鮞鮦鮪鮫鮭鮮鮳鮶鮺鯀鯁鯇鯉鯊鯒鯔鯕鯖鯗鯛鯝鯡鯢鯤鯧鯨鯪鯫鯴鯷鯽鯿鰁鰂鰃鰈鰉鰍鰏鰐鰒鰓鰜鰟鰠鰣鰥鰨鰩鰭鰮鰱鰲鰳鰵鰷鰹鰺鰻鰼鰾鱂鱅鱈鱉鱒鱔鱖鱗鱘鱝鱟鱠鱣鱤鱧鱨鱭鱯鱷鱸鱺鳥鳧鳩鳬鳲鳳鳴鳶鳾鴆鴇鴉鴒鴕鴛鴝鴞鴟鴣鴦鴨鴯鴰鴴鴷鴻鴿鵁鵂鵃鵐鵑鵒鵓鵜鵝鵠鵡鵪鵬鵮鵯鵲鵷鵾鶄鶇鶉鶊鶓鶖鶘鶚鶡鶥鶩鶪鶬鶯鶲鶴鶹鶺鶻鶼鶿鷀鷁鷂鷄鷈鷊鷓鷖鷗鷙鷚鷥鷦鷫鷯鷲鷳鷸鷹鷺鷽鷿鸇鸌鸏鸕鸘鸚鸛鸝鸞鹵鹹鹺鹽麗麥麩麵麽黃黌點黨黲黶黷黽黿鼉鼴齊齋齎齏齒齔齕齗齙齜齟齠齡齦齪齬齲齶齷龍龎龐龔龕龜`
}