/*
bilibili remove some account modules. by onewayticket255

QX:
^https://app.bilibili.com/x/v2/account/mine\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliAccount.js

Surge4：
http-response ^https://app.bilibili.com/x/v2/account/mine\?access_key requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliAccount.js

Surge & QX MITM = app.bilibili.com
*/

let body = $response.body

body = JSON.parse(body)
body['data']['sections'] = [

    {
        "title": "个人中心",
        "items": [
            {
                "title": "历史记录",
                "uri": "bilibili://user_center/history",
                "icon": "http://i0.hdslb.com/bfs/archive/ae502b4b69b6a3b287ea59b1552859332e59c277.png",

            },
            {
                "title": "我的收藏",
                "uri": "bilibili://user_center/favourite",
                "icon": "http://i0.hdslb.com/bfs/archive/1e6b0583257a086f40779c10ad7e2fcd72984463.png",
            },
            {
                "title": "稍后再看",
                "uri": "bilibili://user_center/watch_later",
                "icon": "http://i0.hdslb.com/bfs/archive/56893a05f41d7c503f7f1f5b67e9ee2add8581fa.png",

            },
            {
                "title": "离线缓存",
                "uri": "bilibili://user_center/download",
                "icon": "http://i0.hdslb.com/bfs/archive/0f3e682b0611f9404c6e9d0a8d57f7246f91bffd.png",
            },
        ]
    },
    {
        "type": 1,
        "title": "创作中心",
        "items": [
            {
                "need_login": 1,
                "display": 1,
                "id": 171,
                "title": "创作首页",
                "global_red_dot": 1,
                "uri": "bilibili://uper/homevc",
                "icon": "http://i0.hdslb.com/bfs/archive/d3aad2d07538d2d43805f1fa14a412d7a45cc861.png"
            },
        ]
    },
]

body = JSON.stringify(body)
$done({ body })