/*
[Script]
http-response https://r\.inews\.qq.com\/get(QQNewsUnreadList|RecommendList) requires-body=1,max-size=-1,script-path=https://Choler.github.io/Surge/Script/QQNews.js

[MITM]
hostname = r.inews.qq.com
*/

var obj = JSON.parse($response.body);
delete obj.adList;
$done({body: JSON.stringify(obj)});