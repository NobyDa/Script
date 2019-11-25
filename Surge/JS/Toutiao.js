/*
[Script]
http-response ^https://[a-zA-Z]*\.snssdk\.com/api/news/feed/v88/ requires-body=1,max-size=-1,script-path=https://Choler.github.io/Surge/Script/Toutiao.js

[MITM]
hostname = *.snssdk.com
*/

var obj = JSON.parse($response.body);
if (obj.data) {
  for (var i = obj.data.length - 1; i >= 0; i--) {
    if (obj.data[i].content.indexOf("raw_ad_data") > 0) {
      obj.data.splice(i, 1);
    }
  }
}
$done({body: JSON.stringify(obj)});