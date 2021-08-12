/*
NiChi 解锁素材包

***************************
QuantumultX:

[rewrite_local]
^https?:\/\/m(p|ini-hk)\.bybutter\.com\/mood\/(official-templates|privileges) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

[mitm]
hostname = m*.bybutter.com

***************************
Surge4 or Loon:

[Script]
http-response https?:\/\/m(p|ini-hk)\.bybutter\.com\/mood\/(official-templates|privileges) requires-body=1,max-size=524288,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

[MITM]
hostname = m*.bybutter.com

**************************/

var body = $response.body
    .replace(/preview/g, "free")
    .replace(/view/g, "unlimited")
    .replace(/true/g, "false");
$done({ body });