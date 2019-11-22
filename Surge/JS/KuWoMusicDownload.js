/*
KuWo music unlock lossless download, need to use with KuWo music VIP script. this script is only compatible with surge 4.0

Surge4.0:
http-request https?:\/\/musicpay\.kuwo.cn\/music\.pay\?uid=\d+ script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/KuWoMusicDownload.js
#Vip script:
http-response ^https?:\/\/vip1\.kuwo\.cn\/(vip\/v2\/user\/vip|vip\/spi/mservice) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Kuwo.js

*/

let url = $request.url.replace(/uid=\d+/g, "uid=1");
$done({url});