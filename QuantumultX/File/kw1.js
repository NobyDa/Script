var body = $response.body;
var obj = JSON.parse(body);

obj.data["isNewUser"] = "2";
obj.data["vipLuxuryExpire"] = "1835312949000";
obj.data["time"] = "1961170340993";
obj.data["isYearUser"] = "2";
obj.data["vipmExpire"] = "1835312949000";
obj.data["vipOverSeasExpire"] = "1835312949000";
obj.data["vipExpire"] = "1835312949000";
obj.data["vip3Expire"] = "1835312949000";
body = JSON.stringify(obj);
$done(body);
