/********************************
TestFlight账户管理脚本

脚本作者: @NobyDa 
脚本兼容: Surge4、QuantumultX、Loon(2.1.20 413+)
更新时间: 2024/04/26
主要功能：
1. 自动存储多个TestFlight账户，并自动合并APP列表，避免切换账户。

2. 账户内单个测试版APP允许多方共享：
 - 导出：点击测试版APP -> App详情 -> 描述 -> 复制底部密钥并分享给对方
 - 导入：TestFlight 右上角"兑换" -> 粘贴密钥 -> 弹出保存成功通知后刷新APP列表
 - 多方共享为实验性功能，双方都需要使用该脚本； 该功能主要解决某些APP的TF名额稀缺的问题

请注意，该脚本已经与"TF区域限制解除脚本"合并，如需使用该脚本请务必禁用它，否则可能出现APP安装异常

*********************************
Surge4 添加脚本：
*********************************

Surge模块地址：
https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/TestFlightAccount.sgmodule

*********************************
QuantumultX 添加脚本：
*********************************

QuantumultX重写引用地址：
https://raw.githubusercontent.com/NobyDa/Script/master/TestFlight/TestFlightAccount.js

注：以上引用地址需要打开并使用KOP-XIAO资源解析器，如没有解析器请使用脚本配置：

[rewrite_local]
^https:\/\/testflight\.apple\.com\/v\d\/(app|account|invite)s\/ url script-analyze-echo-response https://raw.githubusercontent.com/NobyDa/Script/master/TestFlight/TestFlightAccount.js

[mitm]
hostname = testflight.apple.com

*********************************
Loon 添加脚本：
*********************************

Loon插件地址：
https://raw.githubusercontent.com/NobyDa/Script/master/Loon/Loon_TF_Account.plugin

*********************************/

const $ = API("TESTFLIGHT-ACCOUNT");
const args = formatArgument(typeof $argument == "string" && $argument || '');
$.env.isNode ? $request = $.read('Request') : null;
const [obj, req, rsp] = [new Map(), $request, {}];
const [k1, k2, k3] = ['x-session-id', 'x-request-id', 'x-session-digest'];
const [list, appList, cacheInfo] = [$.read('AccountList') || {}, $.read('AppList') || {}, $.read('CachedInfo') || {}];
$.debug = Number(args.debug) || ($.read('Debug') === 'true');
$.EnableCache = !(Number(args.enableCache) === 0) || !($.read('EnableCache') === 'false');
$.ForceIOSlist = Number(args.forceIOSlist) || ($.read('ForceIOSlist') === 'true');
$.RequestTimeout = Number(args.timeout || $.read('Timeout')) || 30;

runs()
    .then((resp) => {
        resp = ChangeBody(resp);
        rsp.body = resp.body || '{}';
        rsp.headers = formatHeaders(resp.headers || { 'Content-Type': 'application/json' });
        rsp.status = $.env.isQX ? `HTTP/1.1 ${resp.status || 200}` : resp.status || 200;
        delete rsp.headers['content-length'];
        delete rsp.headers['transfer-encoding']; //prevent issues in qx
        $.log(`Return to client: ${$.stringify(rsp)}`);
    })
    .catch(e => $.error(e.error || e.message || e))
    .finally(() => $.done($.env.isQX ? rsp : { response: rsp }));

async function runs() {
    // Object.keys(list).map(a => delete list[a].only)
    req.headers = formatHeaders(req.headers); //compatible with HTTP/2
    const appID = req.url.split(/\/apps\/(\d+)/)[1];
    const other = /\/(accept|withdraw|devices|session|notifications|status)/.test(req.url);
    if (/accounts\/[a-z0-9-]{36}\/apps$/.test(req.url)) {
        const acc = SaveAccount(req.url.split(/\/([a-z0-9-]{36})\//)[1]);
        return await Promise.all(Object.keys(acc).map(QueryRequest));
    } else if (/\/install$/.test(req.url) && req.body) {
        req.body = JSON.parse(req.body);
        req.body.storefrontId = '143441-19,29'; //prevent regional restrictions
        req.body = JSON.stringify(req.body);
    } else if (/\/[A-Z]{200,}\/redeem$/.test(req.url)) {
        return { body: ExternalAccount(req.url.split(/\/([A-Z]+)\/redeem$/)[1]) };
    }
    return await QueryRequest(!other && appList[appID] || null);
}

function SaveAccount(id, part, o) {
    if (!list[id]) {
        list[id] = {};
        const text = `Account ID "${id}" saved. (total ${Object.keys(list).length}) 🎉`;
        $.notify('TestFlight Account', '', text);
        $.info(text);
    };
    list[id][k1] = (part || req.headers)[k1];
    list[id][k2] = (part || req.headers)[k2];
    list[id][k3] = (part || req.headers)[k3];
    if (o) {
        if (list[id].only) {
            list[id].only.push(o);
            $.notify('TestFlight Account', '', `App ID "${o}" saved 🎉`);
        } else {
            list[id].only = [o];
        }
    }
    return $.write(list, 'AccountList'), list;
}

function formatHeaders(h) {
    return Object.keys(h).reduce((t, i) => (t[i.toLowerCase()] = h[i], t), {})
}

function formatArgument(s) {
    return Object.fromEntries(s.split('&').map(item => item.split('=')))
}

function ChangeHeaders(id) {
    const re = JSON.parse(JSON.stringify(req)); //easy deep copy
    re.url = re.url.replace(/:\/\/.+?\//, '://testflight.apple.com/'); //prevent cdn issues
    re.timeout = $.RequestTimeout * 1000;
    re.insecure = true; //skip ssl
    re['X-Surge-Skip-Scripting'] = true; //prevent shadowrocket loopback issues
    if ($.ForceIOSlist && req.url.endsWith('/apps') && re.headers['user-agent'].includes('Mac')) {
        re.headers['user-agent'] = 'Oasis/3.5.1 OasisBuild/425.2 iOS/17.4 model/iPhone16,2 hwp/t8130 build/21E219 (6; dt:311) AMS/1 TSE/0';
    }
    if (id) {
        $.log(`Request header replaced, using "${id}"`);
        re.headers[k1] = list[id][k1];
        re.headers[k2] = list[id][k2];
        re.headers[k3] = list[id][k3];
        re.url = re.url.replace(/\/[a-z0-9-]{36}\//, `/${id}/`);
    }
    delete re.headers['if-none-match']; //prevent 304
    delete re.headers['content-length'];
    $.log(`Send request: ${$.stringify(re)}`);
    return re;
}

function ChangeBody(resp) {
    if (req.url.endsWith('/apps')) {
        resp = resp.reduce((t, d) => {
            d.body = JSON.parse(d.status == 200 && d.body || '{}');
            $.log(`Account "${d.account}" app list: ${$.stringify((d.body.data || []).map(i => i.name))}`);
            d.body.data = (d.body.data || []).map(i => {
                if ($.ForceIOSlist) {
                    i.platforms = i.platforms.map(j => {
                        if (j.name == 'osx') {
                            $.log(`Account "${d.account}" app [${i.name}] force mac compatible`);
                            j.build.compatible = true;
                            j.build.platformCompatible = true;
                            j.build.osCompatible = true;
                            j.build.hardwareCompatible = true;
                        }
                        return j
                    })
                }
                i.aid = d.account;
                const only = !list[d.account].only || list[d.account].only.includes(String(i.appAdamId));
                return only && t.body.data[req.url.includes(d.account) ? 'unshift' : 'push'](i), i;
            });
            if (req.url.includes(d.account)) {
                [t.status, t.headers] = [d.status, d.headers];
            }
            return t
        }, { body: { data: [], error: null } });
        resp.body.data = resp.body.data.filter(r => !r.previouslyTested && !obj.has(r.appAdamId) && obj.set(r.appAdamId, 1));
        $.write(resp.body.data.reduce((l, v) => (l[v.appAdamId] = v.aid, l), {}), 'AppList');
        $.log(`Final app: ${$.stringify(resp.body.data.map(i => i.name))}`);
        resp.body = JSON.stringify(resp.body);
    }
    if (/\/apps\/\d+\/builds\/\d+$/.test(req.url) && resp.status == 200 && resp.body) { //beta app page
        const share = ShareAccount(req.url.split(/\/apps\/(\d+)/)[1]);
        resp.body = JSON.parse(resp.body);
        resp.body.data.builds.map(e => e.description = `${e.description || '-'}${share}`);
        resp.body = JSON.stringify(resp.body);
    }
    return resp;
}

function QueryRequest(o) {
    const option = ChangeHeaders(o);
    const needCache = $.EnableCache && (option.url.endsWith('/apps') || /\/apps\/\d+\/builds\/\d+$/.test(req.url));
    return $.http[req.method.toLowerCase()](option)
        .then(r => {
            $.log(`URL "${option.url}" response: status=${r.status}, body=${Boolean(r.body)}`);
            if (r.status == 401 && o) {
                if (list[o].InvalidKey >= 2) { //prevent misjudgment
                    delete list[o];
                } else {
                    list[o].InvalidKey = (list[o].InvalidKey || 0) + 1;
                }
                $.write(list, 'AccountList');
                $.notify('TestFlight Account', '', `Account ID "${o}" key expired ⚠️`);
                throw 'key expired ⚠️';
            }
            if (needCache && r.status == 200 && r.body && r.body.startsWith('{')) {
                const cacheKey = (cacheInfo[option.url] && cacheInfo[option.url].key) || `TESTFLIGHT-ACCOUNT-${letterEncode(option.url.split(/\/\/.+?\/(.+)/)[1])}`;
                $.log(`Write to cache, URL "${option.url}", READ KEY "${cacheKey}"`);
                cacheInfo[option.url] = { key: cacheKey, lastUsed: Date.now() };
                Object.keys(cacheInfo).forEach((i) => (Date.now() - (cacheInfo[i].lastUsed || 0) > 864e5 * 3) && $.delete(`#${cacheInfo[i].key}`) && delete cacheInfo[i]); //clear unused cache for 3 days
                $.write(cacheInfo, 'CachedInfo');
                $.write(JSON.stringify(r), `#${cacheKey}`);
            }
            return { ...r, account: o }
        })
        .catch(e => {
            if (needCache && cacheInfo[option.url] && !(e).includes('key expired')) {
                $.log(`URL "${option.url}" Try using cached data`);
                const cachedData = $.read(`#${cacheInfo[option.url].key}`);
                cacheInfo[option.url].lastUsed = Date.now();
                !cachedData ? delete cacheInfo[option.url] : null;
                $.write(cacheInfo, 'CachedInfo');
                return { ...JSON.parse(cachedData || '{}'), account: o }
            }
            $.error(`URL "${option.url}" response failed: ${e}`);
            return { account: o }
        })
}

function ExternalAccount(key) {
    try {
        const k = JSON.parse(letterDecode(key));
        $.log(`Raw data: ${key}\nDecode data: ${$.stringify(k)}`);
        if (!k.appID || !k.accID || !k.key[k1] || !k.key[k2] || !k.key[k3]) {
            throw new Error('Missing data');
        } else if (appList[k.appID]) {
            $.notify('TestFlight Account', '', `Failed, app already exists ⚠️`);
        } else {
            const save = SaveAccount(k.accID, k.key, k.appID);
        }
    } catch (e) {
        const text = `External account parse failed`;
        $.notify('TestFlight Account', '', `${text} ⚠️`);
        $.error(`${text}: ${e.message || e}`);
    }
    return '{}'
}

function ShareAccount(appID) {
    const raw = $.stringify({
        appID: appID,
        accID: appList[appID],
        key: list[appList[appID]]
    });
    const key = letterEncode(raw);
    const disclaimer = `\n\n\n
================================
TestFlight 账户管理脚本：

请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️
请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️
请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️
================================

权限：
您即将共享的密钥理论上具有以下权限，包括但不限于：

 - 查看/下载您 TestFlight 账号内的任何测试版 APP
 - 使用您的密钥接受测试 TestFlight 中的任何测试版 APP
 - 停止测试您 TestFlight 账号内的任何测试版 APP
 - 查看您接受 TestFlight 测试版 APP 邀请时所使用的邮箱
 - 查看/加入/移除您 TestFlight 账号中的设备列表
 - 更改您 TestFlight 测试版 APP 中的推送/电子邮件更新通知

免责：
任何用户使用"共享"功能时都应该仔细阅读权限声明，一旦您开始使用该功能，即视为您已知晓并理解密钥所具有的权限，密钥泄漏可能会导致不可预知的损失或损害，脚本作者(NobyDa)不对由此产生的任何后果负责。

================================

该脚本在"默认"情况下，对方仅可查看/下载您共享的单个APP，但仍建议仅与您信任的人共享：

`;
    $.log(`Raw data: ${raw}\nEncode data: ${key}`);
    return disclaimer + key;
}

// private encode method, based on variant in RFC4648
function letterEncode(e) {
    e = e.split("").map(e => e.charCodeAt());
    const t = new Uint8Array(4 * Math.ceil(8 * e.length / 4));
    let n = 0;
    for (const o of e) {
        let e = 128;
        for (let r = 0; r < 8; r++) t[n++] = o & e ? 1 : 0, e >>= 1
    }
    let o = "",
        r = 0;
    return t.forEach((e, t) => {
        r = r << 1 | e, (t + 1) % 4 == 0 && (o += "XKNWSPRMCTGZVDHF"[r], r = 0)
    }), o
}

function letterDecode(e) {
    const t = new Uint8Array(4 * e.length);
    let n = 0;
    for (const o of e) {
        const e = "XKNWSPRMCTGZVDHF".indexOf(o);
        let r = 8;
        for (let o = 0; o < 4; o++) t[n++] = e & r ? 1 : 0, r >>= 1
    }
    const o = new Uint8Array(Math.floor(t.length / 8));
    return t.forEach((e, t) => {
        const n = Math.floor(t / 8);
        n < o.length && (o[n] = o[n] << 1 | e)
    }), String.fromCharCode(...o)
}

// https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
function ENV() { const a = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: "undefined" != typeof $task, isLoon: "undefined" != typeof $loon, isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon, isShadowrocket: "undefined" != typeof $Shadowrocket, isBrowser: "undefined" != typeof document, isNode: "function" == typeof require && !a, isJSBox: a, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(a = { baseURL: "" }) { function b(b, j) { j = "string" == typeof j ? { url: j } : j; const k = a.baseURL; k && !i.test(j.url || "") && (j.url = k ? k + j.url : j.url), j = { ...a, ...j }; const l = j.timeout, m = { ...{ onRequest: () => { }, onResponse: a => a, onTimeout: () => { } }, ...j.events }; m.onRequest(b, j); let n; if (c) n = new Promise((a, c) => { $task.fetch({ method: b, ...j }).then(b => a({ status: b.statusCode, headers: b.headers, body: b.body }), a => c(a.error)) }); else if (d || e || g) n = new Promise((a, c) => { var e = Math.ceil; const f = g ? require("request") : $httpClient; !j.timeout || g || d || (j.timeout = e(j.timeout / 1e3)), f[b.toLowerCase()](j, (b, d, e) => { b ? c(b) : a({ status: d.status || d.statusCode, headers: d.headers, body: e }) }) }); else if (f) { const a = new Request(j.url); a.method = b, a.headers = j.headers, a.body = j.body, n = new Promise((b, c) => { a.loadString().then(c => { b({ status: a.response.statusCode, headers: a.response.headers, body: c }) }).catch(a => c(a)) }) } else h && (n = new Promise((a, c) => { fetch(j.url, { method: b, headers: j.headers, body: j.body }).then(a => a.json()).then(b => a({ status: b.status, headers: b.headers, body: b.data })).catch(c) })); let o; const p = l ? new Promise((a, b) => { o = setTimeout(() => (m.onTimeout(), b(`timeout`)), l) }) : null; return (p ? Promise.race([p, n]).then(a => ("undefined" != typeof clearTimeout && clearTimeout(o), a)) : n).then(a => m.onResponse(a)) } const { isQX: c, isLoon: d, isSurge: e, isScriptable: f, isNode: g, isBrowser: h } = ENV(), i = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, j = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(a => j[a.toLowerCase()] = c => b(a, c)), j } function API(a = "untitled", b = !1) { const { isQX: c, isLoon: d, isSurge: e, isNode: f, isJSBox: g, isScriptable: h } = ENV(); return new class { constructor(a, b) { this.name = a, this.debug = b, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (f) { const a = require("fs"); return { fs: a } } return null })(), this.initCache(); const c = (a, b) => new Promise(function (c) { setTimeout(c.bind(null, b), a) }); Promise.prototype.delay = function (a) { return this.then(function (b) { return c(a, b) }) } } initCache() { if (c && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (d || e) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), f) { let a = "root.json"; this.node.fs.existsSync(a) || this.node.fs.writeFileSync(a, JSON.stringify({}), { flag: "wx" }, a => console.log(a)), this.root = {}, a = `${this.name}.json`, this.node.fs.existsSync(a) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(a, JSON.stringify({}), { flag: "wx" }, a => console.log(a)), this.cache = {}) } } persistCache() { const a = JSON.stringify(this.cache, null, 2); c && $prefs.setValueForKey(a, this.name), (d || e) && $persistentStore.write(a, this.name), f && (this.node.fs.writeFileSync(`${this.name}.json`, a, { flag: "w" }, a => console.log(a)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, a => console.log(a))) } write(a, b) { if (this.log(`SET ${b}`), -1 !== b.indexOf("#")) { if (b = b.substr(1), e || d) return $persistentStore.write(a, b); if (c) return $prefs.setValueForKey(a, b); f && (this.root[b] = a) } else this.cache[b] = a; this.persistCache() } read(a) { if (this.log(`READ ${a}`), -1 !== a.indexOf("#")) { if (a = a.substr(1), e || d) return $persistentStore.read(a); if (c) return $prefs.valueForKey(a); if (f) return this.root[a] } else return this.cache[a] } delete(a) { if (this.log(`DELETE ${a}`), -1 !== a.indexOf("#")) { if (a = a.substr(1), e || d) return $persistentStore.write(null, a); if (c) return $prefs.removeValueForKey(a); f && delete this.root[a] } else delete this.cache[a]; this.persistCache() } notify(a, b = "", i = "", j = {}) { const k = j["open-url"], l = j["media-url"]; if (c && $notify(a, b, i, j), e && $notification.post(a, b, i + `${l ? "\n\u591A\u5A92\u4F53:" + l : ""}`, { url: k }), d) { let c = {}; k && (c.openUrl = k), l && (c.mediaUrl = l), "{}" === JSON.stringify(c) ? $notification.post(a, b, i) : $notification.post(a, b, i, c) } if (f || h) { const c = i + (k ? `\n点击跳转: ${k}` : "") + (l ? `\n多媒体: ${l}` : ""); if (g) { const d = require("push"); d.schedule({ title: a, body: (b ? b + "\n" : "") + c }) } else console.log(`${a}\n${b}\n${c}\n\n`) } } log(a) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(a)}`) } info(a) { console.log(`[${this.name}] INFO: ${this.stringify(a)}`) } error(a) { console.log(`[${this.name}] ERROR: ${this.stringify(a)}`) } wait(a) { return new Promise(b => setTimeout(b, a)) } done(a = {}) { c || d || e ? $done(a) : f && !g && "undefined" != typeof $context && ($context.headers = a.headers, $context.statusCode = a.statusCode, $context.body = a.body) } stringify(a) { if ("string" == typeof a || a instanceof String) return a; try { return JSON.stringify(a, null, 2) } catch (a) { return "[object Object]" } } }(a, b) }