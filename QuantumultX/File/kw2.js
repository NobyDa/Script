var body = $response.body;
var obj = JSON.parse(body);

obj["isVIPMAutoPay"] = 2;
obj["isVIPLuxAutoPay"] = 2;
body = JSON.stringify(obj);
$done(body);
