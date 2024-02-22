/********************************
TestFlight账户管理脚本

脚本作者: @NobyDa 
脚本兼容: Surge4、QuantumultX、Loon(2.1.20 413+)
更新时间: 2024/02/23
主要功能：
1. 自动存储多个TestFlight账户，并自动合并APP列表，避免切换账户。

2. 账户内单个测试版APP允许多方共享：
 - 导出：点击测试版APP -> 底部开发者许可协议 -> 复制密钥并分享给对方
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
$.env.isNode ? $request = $.read('Request') : null;
const [arr, obj, req, rsp] = [[], new Map(), $request, {}];
const [k1, k2, k3] = ['x-session-id', 'x-request-id', 'x-session-digest'];
const [list, appList] = [$.read('AccountList') || {}, $.read('AppList') || {}];
$.debug = $.read('Debug') === 'true';

runs()
    .catch(e => $.error(e.error || e.message || e))
    .finally(() => {
        const ret = {
            ...{
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            },
            ...rsp
        };
        ret.headers = formatHeaders(ret.headers); //compatible with HTTP/2
        ret.status = $.env.isQX ? `HTTP/1.1 ${ret.status}` : ret.status;
        delete ret.headers['content-length'];
        delete ret.headers['transfer-encoding']; //prevent issues in qx
        $.log(`Return to client: ${$.stringify(ret)}`);
        $.done($.env.isQX ? ret : {
            response: ret
        })
    });

async function runs() {
    // Object.keys(list).map(a => delete list[a].only)
    req.headers = formatHeaders(req.headers); //compatible with HTTP/2
    const appID = req.url.split(/\/apps\/(\d+)/)[1];
    const build = req.url.split(/\/builds\/(\d+)/)[1];
    const other = /\/(accept|withdraw|devices|session|notifications|status)/.test(req.url);
    if (/accounts\/[a-z0-9-]{36}\/apps$/.test(req.url)) {
        const acc = SaveAccount(req.url.split(/\/([a-z0-9-]{36})\//)[1]);
        const all = await Promise.all(Object.keys(acc).map(QueryAppList));
        const out = arr.filter(r => !r.previouslyTested && !obj.has(r.appAdamId) && obj.set(r.appAdamId, 1));
        $.log(`Final app: ${$.stringify(out.map(i => i.name))}`);
        if (out.length) {
            rsp.body = $.stringify({
                data: out,
                error: null
            });
            $.write(out.reduce((l, v) => (l[v.appAdamId] = v.aid, l), {}), 'AppList');
        }
    } else if (/\/install$/.test(req.url) && req.body) {
        req.body = JSON.parse(req.body);
        req.body.storefrontId = '143441-19,29'; //prevent regional restrictions
        req.body = $.stringify(req.body);
    } else if (/\d+\/eula$/.test(req.url)) {
        rsp.body = $.stringify(ShareAccount(appID, build));
    } else if (/\/[A-Z]{200,}\/redeem$/.test(req.url)) {
        rsp.body = ExternalAccount(req.url.split(/\/([A-Z]+)\/redeem$/)[1]);
    }
    if (!rsp.body) {
        await QueryFallback(!other && appList[appID]);
    }
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

function ChangeHeaders(id) {
    const re = JSON.parse(JSON.stringify(req)); //easy deep copy
    re.timeout = 30;
    if (id) {
        $.log(`Request header replaced, using "${id}"`);
        re.headers[k1] = list[id][k1];
        re.headers[k2] = list[id][k2];
        re.headers[k3] = list[id][k3];
        re.url = re.url.replace(/\/[a-z0-9-]{36}\//, `/${id}/`);
    }
    if ($.env.isShadowrocket) {
        re.proxy = false; //prevent shadowrocket infinite loop
    }
    delete re.headers['if-none-match']; //prevent 304
    delete re.headers['content-length'];
    $.log(`Send request: ${$.stringify(re)}`);
    return re;
}

function QueryFallback(o) {
    return $.http[req.method.toLowerCase()](ChangeHeaders(o))
        .then(r => {
            $.log(`Received response: status=${r.statusCode}, body=${Boolean(r.body)}`);
            [rsp.status, rsp.headers, rsp.body] = [r.statusCode, r.headers, r.body];
            if (/\/apps\/\d+\/builds\/\d+$/.test(req.url) && r.body) { //beta app page
                r.body = JSON.parse(r.body);
                r.body.data.builds.map(e => e.eula = `https://testflight.apple.com/v1/apps/${e.appAdamId}/builds/${e.id}/eula`);
                rsp.body = $.stringify(r.body);
            }
        })
        .catch(e => $.error(`Response failed: ${e.error || e.message || e}`))
}

function QueryAppList(o) {
    return $.http[req.method.toLowerCase()](ChangeHeaders(o))
        .then(r => {
            const m = req.url.includes(o);
            $.log(`Received response: status=${r.statusCode}, body=${Boolean(r.body)}, account=${o}, main=${m}`);
            if (m) {
                [rsp.status, rsp.headers, rsp.body] = [r.statusCode, r.headers, r.body];
            }
            if (r.statusCode == 401) {
                throw new Error('Key expires');
            }
            const res = JSON.parse(r.body || '{}');
            $.log(`Account "${o}" app list: ${$.stringify((res.data || []).map(i => i.name))}`);
            return (res.data || []).filter(i => (i.aid = o, !list[o].only || list[o].only.includes(String(i.appAdamId))))
                .map(p => arr[m ? 'unshift' : 'push'](p))
        }).catch(e => { //surge cannot get 401 in apple domain
            if (/Key expires|NSURLErrorDomain.+?-1012/.test(e.error || e.message || e)) {
                if (list[o].InvalidKey >= 2) { //prevent misjudgment
                    delete list[o];
                } else {
                    list[o].InvalidKey = (list[o].InvalidKey || 0) + 1;
                }
                $.write(list, 'AccountList');
                e = `key expired ⚠️`;
                $.notify('TestFlight Account', '', `Account ID "${o}" ${e}`);
            };
            $.error(`Account "${o}" response failed: ${e.error || e.message || e}`);
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

function ShareAccount(appID, bid) {
    const raw = $.stringify({
        appID: appID,
        accID: appList[appID],
        key: list[appList[appID]]
    });
    const key = letterEncode(raw);
    const disclaimer = `
请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️
请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️
请注意，使用"共享"功能时，请务必仔细阅读以下声明 ‼️

======================================

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

======================================

该脚本在"默认"情况下，对方仅可查看/下载您共享的单个APP，但仍建议仅与您信任的人共享：

`;
    $.log(`Raw data: ${raw}\nEncode data: ${key}`);
    return {
        data: {
            buildId: bid,
            eula: disclaimer + key
        },
        messages: null
    }
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
function ENV() { const e = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: "undefined" != typeof $task, isLoon: "undefined" != typeof $loon, isSurge: "undefined" != typeof $httpClient && "undefined" == typeof $loon, isShadowrocket: "undefined" != typeof $Shadowrocket, isBrowser: "undefined" != typeof document, isNode: "function" == typeof require && !e, isJSBox: e, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP() { const { isQX: t, isLoon: s, isSurge: o, isScriptable: n, isNode: i, isBrowser: r } = ENV(), u = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; const a = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(h => a[h.toLowerCase()] = (a => (function (a, h) { h = "string" == typeof h ? { url: h } : h; h.timeout && s && (h.timeout = h.timeout * 1000); let f, p; if (t) f = $task.fetch({ method: a, ...h }); else if (s || o || i) f = new Promise((e, t) => { (i ? require("request") : $httpClient)[a.toLowerCase()](h, (s, o, n) => { s ? t(s) : e({ statusCode: o.status || o.statusCode, headers: o.headers, body: n }) }) }); else if (n) { const e = new Request(h.url); e.method = a, e.headers = h.headers, e.body = h.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } else r && (f = new Promise((e, t) => { fetch(h.url, { method: a, headers: h.headers, body: h.body }).then(e => e.json()).then(t => e({ statusCode: t.status, headers: t.headers, body: t.data })).catch(t) })); return f })(h, a))), a } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (i) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (o || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), i) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (o || n) && $persistentStore.write(e, this.name), i && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || o) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); i && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || o ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : i ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || o) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); i && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", a = "", h = {}) { const d = h["open-url"], l = h["media-url"]; if (s && $notify(e, t, a, h), n && $notification.post(e, t, a + `${l ? "\n多媒体:" + l : ""}`, { url: d }), o) { let s = {}; d && (s.openUrl = d), l && (s.mediaUrl = l), "{}" === JSON.stringify(s) ? $notification.post(e, t, a) : $notification.post(e, t, a, s) } if (i || u) { const s = a + (d ? `\n点击跳转: ${d}` : "") + (l ? `\n多媒体: ${l}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { s || o || n ? $done(e) : i && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }