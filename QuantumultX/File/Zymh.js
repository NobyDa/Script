/*
解锁知音漫客付费章节 (需登录)

***************************
QuantumultX:

[rewrite_local]
^https:\/\/apigate\.kaimanhua\.com\/(zymk-getuserinfo-api\/v1\/getuserinfo|zymk-userpurchased-api\/v1\/userpurchased\/paychapters)\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/Zymh.js

[mitm]
hostname = apigate.kaimanhua.com

***************************
Surge4 or Loon:

[Script]
http-response ^https:\/\/apigate\.kaimanhua\.com\/(zymk-getuserinfo-api\/v1\/getuserinfo|zymk-userpurchased-api\/v1\/userpurchased\/paychapters)\/ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/Zymh.js

[MITM]
hostname = apigate.kaimanhua.com
**************************/

var obj = JSON.parse($response.body);
obj.status = 0;
obj.data.isvip = 1;
obj.data.coins = 6666;
obj.data.Cgold = 6666;
$done({body: JSON.stringify(obj)});
