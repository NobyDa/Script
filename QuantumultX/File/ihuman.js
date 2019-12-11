
var body = $response.body;
var url = $request.url;
const path = "/v1/report_log";
let obj = JSON.parse(body);
if (url.indexOf(path) != -1) {
	obj["code"] = "1";
	body = JSON.stringify(obj);
 }
$done({body});