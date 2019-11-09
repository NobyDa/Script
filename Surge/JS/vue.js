var body = $response.body;
var obj = JSON.parse(body);
var url = $request.url;
var cod = $response.statusCode;
const path = '/api/v1/subtitle/prepare';

if (url.indexOf(path) != -1) {
obj.entity.valid = true;
}
if (cod == 200) {
obj.entity.isPremium = true;
}
body = JSON.stringify(obj); 
$done({body});