/*
NiChi app unlocks material
Because QX limits the maximum rewrite size of the response body, So this script may not work under a certain version of QX.
If your QX version is greater than 1.0.1 (130) then it is recommended to point to the local script path and enable AlwaysOn.

Surge4.0:
http-response https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) requires-body=1,max-size=524288,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

QX 1.0.0:
^https?:\/\/mp\.bybutter\.com\/mood\/(official-templates|privileges) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/NiChi.js

Surge & QX Mitm = mp.bybutter.com
*/

body = $response.body.replace(/preview/g, "free").replace(/view/g, "unlimited").replace(/true/g, "false");
$done({body});