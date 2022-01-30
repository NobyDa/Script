/*
陆琪讲故事 解锁电台

***************************
QuantumultX:

[rewrite_local]
^https:\/\/www\.luqijianggushi\.com\/api\/v2\/user\/get url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/luqi.js

[mitm]
hostname = www.luqijianggushi.com

***************************
Surge4 or Loon:

[Script]
http-response ^https:\/\/www\.luqijianggushi\.com\/api\/v2\/user\/get requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/luqi.js

[MITM]
hostname = www.luqijianggushi.com

**************************/

let obj = JSON.parse($response.body);
obj.data.is_vip = 1;
obj.data.vip_endtime = 1630296877;
$done({body: JSON.stringify(obj)});
