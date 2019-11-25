/*
Watermark sprite vip （Author: Alex0510）
Surge4：
http-response https:\/\/api1\.dobenge\.cn\/api\/user\/getuserinfo requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/syjl.js

QX：
https:\/\/api1\.dobenge\.cn\/api\/user\/getuserinfo url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/syjl.js

Surge & QX MITM = api1.dobenge.cn
*/

let obj = JSON.parse($response.body);
obj.data["is_vip"] = 1;
obj.data["vip_end_time"] = "2066-06-06";
$done({body: JSON.stringify(obj)});