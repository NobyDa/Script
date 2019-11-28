
/*
 * @supported 819366A72B49
 */
/*
http-response ^https?:\/\/live\.infltr\.us\/parse\/functions\/verifySubscriptionUsingReceipt requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Tooris/JScript/master/Surge/UnlockInfltr.js

*/

var body = $response.body;
var url = $request.url;

const sub = '/parse/functions/verifySubscriptionUsingReceipt';

if(url.indexOf(sub) != -1)
{
  let obj = JSON_parse(body);
  obj["isValidSubscriber"] = true;
    body = JSON.stringify(obj);
}
$done({body});
