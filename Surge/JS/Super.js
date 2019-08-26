/*
[Script]
http-response ^https?://[a-z]*\.snssdk\.com/bds/feed/stream/ requires-body=1,max-size=-1,script-path=https://Choler.github.io/Surge/Script/Super.js

[MITM]
hostname = *.snssdk.com
*/

var obj = JSON.parse($response.body);
if (obj.data.data) {
  for (var i = obj.data.data.length - 1; i >= 0; i--) {
    if (obj.data.data[i].ad_info != null) {
      obj.data.data.splice(i, 1);
    }
  }
}
$done({body: JSON.stringify(obj)});