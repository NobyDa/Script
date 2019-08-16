var body = $response.body;
var url = $request.url;

const vip = '/v1/users/';
const ad = '/v1/banners';

if (url.indexOf(vip) != -1) {
    let obj = JSON.parse(body);
    obj.user.is_member = 1;
	body = JSON.stringify(obj);  
 }

if (url.indexOf(ad) != -1) {
    let obj = JSON.parse(body);
	delete obj.banners
	body = JSON.stringify(obj); 
 }

$done({body});