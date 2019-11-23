/*
 * @supported 0C02A0BCC5B7
 */

let obj = JSON.parse($response.body);
obj["result"]["user_status"]["vip"] = 1;
$done({body: JSON.stringify(obj)});
