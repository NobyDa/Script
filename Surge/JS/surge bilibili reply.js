/*
 * @supported 0C02A0BCC5B7 819366A72B49
 */
 
let body = $response.body
body=JSON.parse(body)
delete body['data']['notice']
body=JSON.stringify(body)
$done({body})
