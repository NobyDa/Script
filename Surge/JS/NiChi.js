/*
NiChi app unlocks material

Surge4.0:
http-response https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

QX 1.0.0:
^https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

Surge & QX Mitm = mp.bybutter.com
*/

body = $response.body.replace(/preview/g, "free").replace(/view/g, "unlimited").replace(/true/g, "false");
$done({body});