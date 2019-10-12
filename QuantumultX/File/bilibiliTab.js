//Customize whitelist
let whitelist=['追番','推荐','直播','热门','影视']

let body = $response.body
body=JSON.parse(body)

body['data']['tab'].forEach((element, index) => {
if(!(whitelist.includes(element['name']))) body['data']['tab'].splice(index,1)  
});

delete body['data']['top']
body=JSON.stringify(body)
$done({body}) 