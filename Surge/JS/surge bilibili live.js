/*
 * @supported 0C02A0BCC5B7
 */

let body = $response.body
body=JSON.parse(body)
body['data']['activity_banner_info']=null
body=JSON.stringify(body)
$done({body})
