let body = $response.body
body=JSON.parse(body)
delete body['ad_info']
body=JSON.stringify(body)
$done({body})
