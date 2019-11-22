/*
PicsArt app unlocks pro

Surge4.0:
http-response https:\/\/api\.picsart\.com\/users\/show\/me\.json requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/PicsArt.js

QX1.0.0
^https:\/\/api\.picsart\.com\/users\/show\/me\.json url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/PicsArt.js

Surge & QX Mitm = api.picsart.com
*/

let obj = JSON.parse($response.body);
obj.subscription.granted = "true";
$done({body: JSON.stringify(obj)});