var body = $response.body;
var url = $request.url;

const path1 = '/pgc/player/api/playurl';

if (url.indexOf(path1) != -1) {
    let obj = JSON.parse(body);
	obj["quality"] = obj["accept_quality"][0];
	body = JSON.stringify(obj);  
 }

$done({body});