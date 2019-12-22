/*
Vientiane live download link：https://m.51168.tv/
Surge4：
http-response https:\/\/u\.kanghuayun\.com\/api\/v2\/info requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/wxzb.js

QX：
https:\/\/u\.kanghuayun\.com\/api\/v2\/info url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/wxzb.js

Surge & QX MITM = u.kanghuayun.com
*/
　　let obj = JSON.parse($response.body);
　　obj.data.nickname = "脚本禁止牟利,TG频道@NobyDa";
　　obj.data.tstime = 59169305884;
　　obj.data.vip_expire_time = 59169305884;
　　obj.data.tsvip = 1;
　　obj.data.vip_level = 3;
　　$done({body: JSON.stringify(obj)});