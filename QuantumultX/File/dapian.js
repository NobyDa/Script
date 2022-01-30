/*
Bigshot 解锁高级特权(需登录)

***************************
QuantumultX:

[rewrite_local]
^https:\/\/vni\.kwaiying\.com\/api\/v1\/user\/profile url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/dapian.js

[mitm]
hostname = vni.kwaiying.com

***************************
Surge4 or Loon:

[Script]
http-response ^https:\/\/vni\.kwaiying\.com\/api\/v1\/user\/profile requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/dapian.js

[MITM]
hostname = vni.kwaiying.com
**************************/

var obj = JSON.parse($response.body);

if (obj.data && obj.data.userInfo) {
    obj.data.userInfo.isVip = 1;
    obj.data.userInfo.memberId = 666
    obj.data.userInfo.vipStartTime = 1591430766000;
    obj.data.userInfo.vipEndTime = 3043037166000;
}

$done({ body: JSON.stringify(obj) });