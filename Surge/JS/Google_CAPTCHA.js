/*
Google搜索内容时并发使用多个策略(组)，以避免可能出现的人机验证

注：该脚本仅兼容Surge(4.9.3+)，使用时需要在脚本配置内的argument参数中填写筛选策略/组的正则表达式，留空则表示同时使用所有策略/组

Surge脚本配置:

[Script]
Google CAPTCHA = type=http-response,pattern=^https:\/\/www\.google\.com(?:\.[a-z]+|)\/(?:search\?(?:|.+?&)q=|$),requires-body=1,debug=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Google_CAPTCHA.js,max-size=0,timeout=10,ability=http-client-policy,argument=^(🇸🇬|🇭🇰)\s.*\d+$

[MITM]
hostname = www.google.com*

*/

let ret = {};

(async () => {
    if ($response.status !== 200) {
        const allPolicy = await new Promise((r) => {
            $httpAPI("GET", "v1/policies", null, (v) => r(
                [...v.proxies, ...v['policy-groups']]
            ))
        });
        const selected = allPolicy.filter((n) => {
            return n && new RegExp(typeof $argument == 'string' ? $argument : "").test(n)
        });
        console.log(`[INFO]: Use policy ${JSON.stringify(selected, null, 2)}`);
        delete $request.headers.cookie;
        delete $request.headers.Cookie;
        const http = [
            new Promise((r, e) => setTimeout(() => e('Timeout'), 5000)),
            ...selected.map(
                (v) => new Promise((r, e) => {
                    $httpClient[$request.method.toLowerCase()]({
                        url: $request.url,
                        headers: $request.headers,
                        policy: v
                    }, (error, response, body) => {
                        if (response && response.status == 200) {
                            r({
                                policy: v,
                                body: {
                                    headers: response.headers,
                                    status: response.status,
                                    body: body
                                }
                            })
                        } else if (response && response.status == 429) {
                            console.log(`[ERROR]: Policy "${v}" need to CAPTCHA`);
                        } else if (error) {
                            console.log(`[ERROR]: Policy "${v}" ${error}`);
                        }
                    })
                })
            )
        ];
        await Promise.race(http).then((data) => {
            ret = data.body;
            console.log(`[INFO]: Use data from "${data.policy}"`);
        });
    }
})()
    .catch((err) => console.log(`[ERROR]: ${(err && err.message) || err}`))
    .finally(() => $done(ret));