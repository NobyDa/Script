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
    const $ = $substore; //OpenAPI in Sub-Store
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