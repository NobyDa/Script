/*
皮皮虾去广告
原自Choler, 由Liquor030修改

Surge4:
http-response ^https?://[a-z]*\.snssdk\.com/bds/feed/stream/ requires-body=1,max-size=-1,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Super.js

QuanX:
https:\/\/api\.termius\.com\/api\/v3\/bulk\/account\/ url script-response-body Super.js

MITM = *.snssdk.com
*/

var obj = JSON.parse($response.body);
if (obj.data.data) {
  for (var i = obj.data.data.length - 1; i >= 0; i--) {
    if (obj.data.data[i].ad_info != null) {
      obj.data.data.splice(i, 1);
    }
  }
}
var obj2 = JSON.stringify(obj);
var obj3 = obj2.replace(/\"cell_id\":\d+,\"cell_id_str\":\"(\d+)\"/g,'\"cell_id\":$1,\"cell_id_str\":\"$1\"');
var body = obj3.replace(/\"item_id\":\d+,\"item_id_str\":\"(\d+)\"/g,'\"item_id\":$1,\"item_id_str\":\"$1\"');
$done({body});
