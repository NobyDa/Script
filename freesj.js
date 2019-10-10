var body = $response.body;
var obj = JSON.parse(body);

obj.tradeEndTime = 1999999999000;
body = JSON.stringify(obj);
$done(body);
