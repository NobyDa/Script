/*
 * @supported 0C02A0BCC5B7 819366A72B49
 */

/*
[rewrite_local]
^https?://mp.weixin.qq.com/mp/getappmsgad url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/Wechat.js

hostname = mp.weixin.qq.com,
*/

var obj = JSON.parse($response.body);
obj.advertisement_num = 0;
obj.advertisement_info = [];
$done({body: JSON.stringify(obj)}); 
