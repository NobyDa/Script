/*
Surge 3+:
[Script]
http-response ^https:\/\/api\.revenuecat\.com\/v.*\/(subscribers\/.*|receipts$) requires-body=1,max-size=0,script-path=Scripts/NotoNote.pro.js

[MITM]
hostname = api.revenuecat.com

注：请勿发送至公开群组，请勿用于盈利。
*/

let obj = JSON.parse($response.body);
let url = $request.url;

if(url.endsWith("offerings")) {
  $done({});
} else {
  let pro = obj["subscriber"]["entitlements"];
  let sub = obj["subscriber"]["subscriptions"];

  pro["pro"] = {
    "expires_date": "2099-12-31T23:59:59Z",
    "product_identifier": "com.lkzhao.editor.pro.ios.yearly",
    "purchase_date": "2019-12-01T00:00:00Z"
  };

  sub["com.lkzhao.editor.pro.ios.yearly"] = {
    "billing_issues_detected_at": null,
    "expires_date": "2099-12-31T23:59:59Z",
    "is_sandbox": false,
    "original_purchase_date": "2019-12-01T00:00:00Z",
    "period_type": "active",
    "purchase_date": "2019-12-01T00:00:00Z",
    "store": "app_store",
    "unsubscribe_detected_at": null
  };

  $done({body: JSON.stringify(obj)});
}