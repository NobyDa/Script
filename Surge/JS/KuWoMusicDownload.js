/*
KuWo music unlock lossless download, need to use with KuWo music VIP script.

Surge4.0:
http-request https?:\/\/musicpay\.kuwo.cn\/music\.pay\?uid=\d+ script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/KuWoMusicDownload.js
#Vip script:
http-response ^https?:\/\/vip1\.kuwo\.cn\/(vip\/v2\/user\/vip|vip\/spi/mservice) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Kuwo.js

QX1.0.0:
^https?:\/\/musicpay\.kuwo\.cn\/music\.pay\?uid\=\d+ url 302 http://musicpay.kuwo.cn/music.pay?uid=1
#Vip script:
^https?:\/\/vip1\.kuwo\.cn\/(vip\/v2\/user\/vip|vip\/spi/mservice) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Kuwo.js

Surge & QX MITM = vip1.kuwo.cn
*/

let url = $request.url.replace(/uid=\d+/g, "uid=1");
$done({url});