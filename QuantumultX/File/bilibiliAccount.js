/*
 * @supported 0C02A0BCC5B7 819366A72B49
 */

let body = $response.body
body=JSON.parse(body)
body['data']['sections'].splice(2,1)
body=JSON.stringify(body)
$done({body})
