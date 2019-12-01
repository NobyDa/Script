/*
Remove Zhihu ads

Regex: ^https://api.zhihu.com/market/header
*/

let body = $response.body 
body=JSON.parse(body)
body['sub_webs'].splice(0,1)
body['sub_webs'].splice(1,1)
body=JSON.stringify(body)
$done({body})

// by onewayticket255