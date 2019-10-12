let body = $response.body
body=JSON.parse(body)
body['data']['sections'].splice(0,1)
body['data']['sections'].splice(1,1)
body=JSON.stringify(body)
$done({body})