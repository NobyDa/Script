/********************************
Google搜索人机验证解决方案
搜索内容时遇到人机验证立即并发使用多个代理策略、策略组尝试搜索内容，并返回最优结果。

脚本作者：@NobyDa
更新时间：2024/05/19
平台兼容：Surge(iOS4.9.3+/macOS4.2.3+) / QuantumultX(1.0.26+) / Loon(3.1.9[694]+)

可在 BoxJs(低优先级)、Surge模块参数、Loon插件参数中填写筛选的代理策略、策略组的正则表达式。
所有代理策略、策略组至多筛选、使用20个，可在BoxJs中测试匹配的策略，不筛选则表示随机使用。

注意：Surge由于策略架构问题，正则表达式筛选的"代理策略"不包含"外部代理策略"；
QuantumultX、Loon则无此限制，正则表达式可筛选所有"策略组"内的"代理策略"。

*********************************
Surge(iOS 5.9.0+/macOS 5.5.0+) 模块：
https://raw.githubusercontent.com/NobyDa/Script/master/Surge/Module/GoogleCAPTCHA.sgmodule

*********************************
QuantumultX(1.0.26+) 重写资源引用：
https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Snippet/GoogleCAPTCHA.snippet

*********************************
Loon(3.1.9[694]+) 插件：
https://raw.githubusercontent.com/NobyDa/Script/master/Loon/Loon_Google_CAPTCHA.plugin

*********************************
BoxJs 订阅地址：
https://raw.githubusercontent.com/NobyDa/Script/master/NobyDa_BoxJs.json

*********************************/

const $ = new NobyDa_Tools();
$.ret = {};

!(async () => {
    if (($response.status || $response.statusCode) == 200) return;
    const req = JSON.parse(JSON.stringify($request));
    const policy = await $.policy();
    const regexText = (typeof $argument == 'string' && $argument) ||
        $.data.read('GOOGLE_CAPTCHA_REGEX') || // loon plugin args.
        JSON.parse($.data.read('GOOGLE_CAPTCHA') || '{}').Regex || ''; // empty = all
    const selected = [...policy.group, ...policy.proxy]
        .filter((n) => n && new RegExp(regexText).test(n))
        .sort(() => Math.random() - 0.5).slice(0, 20); // prevent too many TCP, filtered to random select up to 20
    console.log(`[INFO]: Use policy ${JSON.stringify(selected, null, 2)}`);
    await Promise.any([
        ...selected.map(
            (i) => new Promise((r, e) => {
                if (req.headers['User-Agent']) req.headers.Cookie = `${Math.random()}`; // prevent set-cookie
                if (req.headers['user-agent']) req.headers.cookie = `${Math.random()}`; // h2
                $.http[req.method.toLowerCase()]({
                    policy: i, node: i, opts: { policy: i }, // policy:surge, node:loon, opts:qx
                    ...req
                }).then((v) => {
                    if (v.status == 200) {
                        r({ policy: i, body: { ...v, status: $.isQuanX ? 'HTTP/1.1 200' : 200 } })
                    } else if (v.status == 429) {
                        e(console.log(`[INFO]: Policy "${i}" need to CAPTCHA`))
                    } else {
                        e(console.log(`[INFO]: Policy "${i}" unknown resp status "${v.status}"`))
                    }
                }).catch((err) => e(console.log(`[ERROR]: ${err}`)))
            })
        )
    ]).then((data) => {
        $.ret = data.body;
        console.log(`[INFO]: Use data from "${data.policy}"`);
    })
})()
    .catch((err) => console.log(`[ERROR]: ${(err && err.message) || err}`))
    .finally(() => $done($.ret));


function NobyDa_Tools() {
    this.isLoon = typeof $loon !== "undefined";
    this.isQuanX = typeof $configuration !== 'undefined';
    this.isSurge = typeof $environment !== 'undefined' && $environment['surge-version'];
    this.isNode = typeof module !== 'undefined' && !!module.exports;
    this.http = Object.fromEntries(
        ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].map(
            (m) => [m.toLowerCase(), (opts) => {
                if (this.isQuanX) return new Promise((resolve, reject) => {
                    $task.fetch({ method: m, ...opts })
                        .then((r) => resolve({
                            status: r.statusCode, headers: r.headers, body: r.body,
                        }), e => reject(e.error))
                });
                if (this.isSurge || this.isLoon || this.isNode) return new Promise((resolve, reject) => {
                    const request = this.isNode ? require("request") : $httpClient;
                    request[m.toLowerCase()](opts, (e, r, b) => {
                        if (e) reject(e);
                        else resolve({ status: r.status || r.statusCode, headers: r.headers, body: b })
                    })
                });
            }]
        )
    );
    this.policy = () => {
        if (this.isSurge) return new Promise((r) => {
            $httpAPI("GET", "v1/policies", null, (v) => r({
                proxy: v.proxies,
                group: v['policy-groups']
            }))
        });
        if (this.isQuanX) return new Promise((r) => {
            $configuration.sendMessage({
                action: "get_customized_policy"
            }).then(b => r({
                proxy: Object.keys(b.ret)
                    .reduce((t, i) => [...new Set([...t, ...b.ret[i].candidates || []])], [])
                    .filter((v) => !b.ret[v] && !['direct', 'proxy', 'reject'].includes(v)),
                group: Object.keys(b.ret)
            }), () => r({}));
        });
        if (this.isLoon) return new Promise(async (r1) => {
            const config = JSON.parse($config.getConfig());
            const groupData = await Promise.all(config['all_policy_groups'].map((i) => new Promise((r2) => {
                $config.getSubPolicies(i, (b) => { r2(JSON.parse(b || '[]')) })
            })));
            r1({
                proxy: groupData.reduce((t, i) => [...new Set([...t, ...i.filter((v) => {
                    return v.type == 'node' && !config['all_buildin_nodes'].includes(v.name)
                }).map((n) => n.name)])], []),
                group: config['all_policy_groups']
            })
        });
    };
    this.data = Object.fromEntries(['read', 'write'].map(
        (i) => [i, (v1, v2) => {
            if (i === 'write') {
                if (this.isSurge || this.isLoon) return $persistentStore.write(v1, v2);
                if (this.isQuanX) return $prefs.setValueForKey(v1, v2);
            } else if (i === 'read') {
                if (this.isSurge || this.isLoon) return $persistentStore.read(v1);
                if (this.isQuanX) return $prefs.valueForKey(v1);
            }
        }]
    ));
}