/*
[Script]
http-response ^https?:\/\/api\.faceapp\.io(.*)\/api\/v.*\/auth\/user\/credentials requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/FaceApp.js

[MITM]
hostname = api.faceapp.io
*/

let headers = $response.headers; 
let obj = JSON.parse($response.body);
 
obj = {"subscription_apple":{"subscription_exp":3042979200,"product_id":"p"}};  

delete headers['X-FaceApp-ErrorCode'];
 
$done({
    body: JSON.stringify(obj),
    headers: headers,
    status: 200,
});
