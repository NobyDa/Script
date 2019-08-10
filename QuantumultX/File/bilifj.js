var body = $response.body;
var url = $request.url;

const path1 = '/pgc/player/api/playurl';

if (url.indexOf(path1) != -1) {
    let obj = JSON.parse(body);
	obj["quality"] = 116;
	body = JSON.stringify(obj);  
 }

$done({body});