/*
JibJab 解锁高级功能

***************************
QuantumultX:

[rewrite_local]
https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/jibjab.js

[mitm]
hostname = origin-prod-phoenix.jibjab.com

***************************
Surge4 or Loon:

[Script]
http-response https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/jibjab.js

[MITM]
hostname = origin-prod-phoenix.jibjab.com

**************************/

let obj = JSON.parse($response.body);
obj.data.attributes["is-paid"] = true;
obj.data.attributes["email"] = "禁止牟利,TG频道@NobyDa";
$done({body: JSON.stringify(obj)});
