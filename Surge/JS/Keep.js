/*
Keep app unlock private lessons and action libraries.
There is a bug in the QX app. This script may not work, but the surge does not have this problem.

QX1.0.0:
^https:\/\/api\.gotokeep\.com\/(.+\/subject|.+\/dynamic) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Keep.js

Surge4.0:
http-response https:\/\/api\.gotokeep\.com\/(.+\/subject|.+\/dynamic) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Keep.js

MITM = api.gotokeep.com
*/

let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

const path1 = 'dynamic';
const path2 = 'subject';

if (url.indexOf(path1) != -1) {
   obj.data.permission.isMembership = true;
   obj.data.permission.membership = true;
   obj.data.permission.inSuit = true;
}
if (url.indexOf(path2) != -1) {
   for (var i = 0; i < obj.data.subjectInfos.length; i++) {
         obj.data.subjectInfos[i].needPay = false;
   }
}
body = JSON.stringify(obj);
$done({body});