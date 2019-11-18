/*
KuWo music unlock lossless download, need to use with KuWo music VIP script. this script is only compatible with surge 4.0

Surge4.0:
http-request https?:\/\/musicpay\.kuwo.cn\/music\.pay\?uid=\d+ script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/KuWoMusicDownload.js
*/

let url = $request.url.replace(/uid=\d+/g, "uid=1");
$done({url});