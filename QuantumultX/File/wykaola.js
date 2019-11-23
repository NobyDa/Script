/*
 * @supported 0C02A0BCC5B7
 */

var obj = JSON.parse($response.body);
obj.body = null;
$done({body: JSON.stringify(obj)}); 
