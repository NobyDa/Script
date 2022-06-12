/******************************

Sub-Store外置流量查询脚本

该脚本基于Sub-Store, 可解决APP使用Sub-Store链接后, 没有流量通知的问题. 使用前需确认您的机场订阅是否支持流量信息. (注:节点名流量信息暂不支持)
Sub-Store订阅管理器: https://github.com/Peng-YM/Sub-Store

最后更新: 2022.6.12
测试兼容: QuantumultX, Surge, Loon. 
使用方法: 打开Sub-Store => 订阅 => 编辑 => 节点操作+ => 脚本操作 => 填入脚本链接或粘贴脚本 => 保存

您的APP更新Sub-Store订阅链接时, 将自动发送流量通知.

脚本链接: https://raw.githubusercontent.com/NobyDa/Script/master/Sub-store-parser/DataQuery.js

******************************/

async function operator(proxies, client) {
    if (['JSON', 'URI'].includes(client)) return proxies;
    const $ = API('sub-store');
    const single = $.read('subs');
    const collection = $.read('collections');
    const subtag = decodeURIComponent($request.url.split(/download\/(collection\/|)(.*)/)[2]);
    const group = [];
    if ($request.url.includes('/collection/')) { //collection subscription.
        const deployed = collection[subtag].process.filter((c) => c.type == 'Script Operator' && c.args.content.includes('/DataQuery.js')).length;
        for (let i = 0; i < collection[subtag].subscriptions.length; i++) {
            if (deployed) group.push({
                name: collection[subtag].subscriptions[i], url: single[collection[subtag].subscriptions[i]].url
            });
        }
    } else { //single subscription.
        group.push({ name: single[subtag].name, url: single[subtag].url })
    }
    await Promise.all(
        group.map((c) => $.http.get(c.url)
            .then((r) => {
                const t = parseInfo(r);
                $.notify(
                    `🔹 订阅昵称:「 ${c.name} 」`,
                    t.expire ? `🔹 过期时间:「 ${t.expire} 」` : ``,
                    `🔸 已用流量:「 ${t.used} GB 」\n🔸 剩余流量:「 ${t.free} GB 」`
                );
            })
            .catch((e) => $.notify(`🔹 订阅昵称:「 ${c.name} 」`, ``, `🔺 查询失败:「 ${e.message || e} 」`))
        )
    )
    return proxies;
}

function parseInfo(resp) { //reference to https://github.com/KOP-XIAO/QuantumultX/blob/master/Scripts/resource-parser.js
    var sinfo = JSON.stringify(resp.headers || '').replace(/ /g, "").toLowerCase();
    if (sinfo.indexOf("total=") == -1 && sinfo.indexOf("download=") == -1)
        throw new Error('该订阅不包含流量信息');
    // var total = (parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)).toFixed(0);
    var usd = ((parseFloat(sinfo.indexOf("upload") != -1 ? sinfo.split("upload=")[1].split(",")[0] : "0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3)).toFixed(2);
    var left = ((parseFloat(sinfo.split("total=")[1].split(",")[0]) / (1024 ** 3)) - ((parseFloat(sinfo.indexOf("upload") != -1 ? sinfo.split("upload=")[1].split(",")[0] : "0") + parseFloat(sinfo.split("download=")[1].split(",")[0])) / (1024 ** 3))).toFixed(2);
    if (sinfo.indexOf("expire=") != -1) {
        var epr = new Date(parseFloat(sinfo.split("expire=")[1].split(",")[0]) * 1000);
        var year = epr.getFullYear();
        var mth = epr.getMonth() + 1 < 10 ? '0' + (epr.getMonth() + 1) : (epr.getMonth() + 1);
        var day = epr.getDate() < 10 ? "0" + (epr.getDate()) : epr.getDate();
        return { expire: `${year}-${mth}-${day}`, used: usd, free: left }
    }
    return { used: usd, free: left }
}

// https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
function ENV() { const e = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: "undefined" != typeof $task, isLoon: "undefined" != typeof $loon, isSurge: "undefined" != typeof $httpClient && "undefined" != typeof $utils, isBrowser: "undefined" != typeof document, isNode: "function" == typeof require && !e, isJSBox: e, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: o, isScriptable: n, isNode: i, isBrowser: r } = ENV(), u = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; const a = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(h => a[h.toLowerCase()] = (a => (function (a, h) { h = "string" == typeof h ? { url: h } : h; const d = e.baseURL; d && !u.test(h.url || "") && (h.url = d ? d + h.url : h.url), h.body && h.headers && !h.headers["Content-Type"] && (h.headers["Content-Type"] = "application/x-www-form-urlencoded"); const l = (h = { ...e, ...h }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...h.events }; let f, p; if (c.onRequest(a, h), t) f = $task.fetch({ method: a, ...h }); else if (s || o || i) f = new Promise((e, t) => { (i ? require("request") : $httpClient)[a.toLowerCase()](h, (s, o, n) => { s ? t(s) : e({ statusCode: o.status || o.statusCode, headers: o.headers, body: n }) }) }); else if (n) { const e = new Request(h.url); e.method = a, e.headers = h.headers, e.body = h.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } else r && (f = new Promise((e, t) => { fetch(h.url, { method: a, headers: h.headers, body: h.body }).then(e => e.json()).then(t => e({ statusCode: t.status, headers: t.headers, body: t.data })).catch(t) })); const y = l ? new Promise((e, t) => { p = setTimeout(() => (c.onTimeout(), t(`${a} URL: ${h.url} exceeds the timeout ${l} ms`)), l) }) : null; return (y ? Promise.race([y, f]).then(e => (clearTimeout(p), e)) : f).then(e => c.onResponse(e)) })(h, a))), a } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: o, isSurge: n, isNode: i, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (i) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (o || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), i) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (o || n) && $persistentStore.write(e, this.name), i && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || o) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); i && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || o ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : i ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || o) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); i && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", a = "", h = {}) { const d = h["open-url"], l = h["media-url"]; if (s && $notify(e, t, a, h), n && $notification.post(e, t, a + `${l ? "\n多媒体:" + l : ""}`, { url: d }), o) { let s = {}; d && (s.openUrl = d), l && (s.mediaUrl = l), "{}" === JSON.stringify(s) ? $notification.post(e, t, a) : $notification.post(e, t, a, s) } if (i || u) { const s = a + (d ? `\n点击跳转: ${d}` : "") + (l ? `\n多媒体: ${l}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { s || o || n ? $done(e) : i && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }