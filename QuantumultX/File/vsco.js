/********************************
Membership unlock for VSCO & 1Blocker & HTTPBot
Please note that you may need to reinstall app for script to work.

QuantumultX rewrite link:
https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js

Please note that the above rewrite link requires open KOP-XIAO's resource parser

*********************************
Surge4, Loon and Shadowrocket configuration:

[Script]
http-request ^https?:\/\/api\.revenuecat\.com\/v\d\/subscribers\/ script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js
http-response ^https?:\/\/api\.revenuecat\.com\/v\d\/subscribers\/ requires-body=1,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js

[MITM]
hostname = api.revenuecat.com
********************************/

const resp = {};
const obj = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];
const list = {
	'HTTPBot': { name: 'rc_lifetime', id: 'com.behindtechlines.HTTPBot.prounlock' },
	'VSCO': { name: 'membership', id: 'com.circles.fin.premium.yearly' },
	'1Blocker': { name: 'premium', id: 'blocker.ios.subscription.yearly' }
};
const data = {
	"expires_date": "2030-02-18T07:52:54Z",
	"original_purchase_date": "2020-02-11T07:52:55Z",
	"purchase_date": "2020-02-11T07:52:54Z"
};

if (typeof $response == "undefined") {
	delete $request.headers["x-revenuecat-etag"]; // prevent 304 issues
	delete $request.headers["X-RevenueCat-ETag"];
	resp.headers = $request.headers;
} else if (obj && obj.subscriber) {
	obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
	obj.subscriber.entitlement = obj.subscriber.entitlement || {};
	for (const i in list) {
		if (new RegExp(`^${i}`, `i`).test(ua)) {
			obj.subscriber.subscriptions[list[i].id] = data;
			obj.subscriber.entitlements[list[i].name] = JSON.parse(JSON.stringify(data));
			obj.subscriber.entitlements[list[i].name].product_identifier = list[i].id;
			break;
		}
	}
	resp.body = JSON.stringify(obj);
}

$done(resp);
