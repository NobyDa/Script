/*
[Script]
http-response ^https?:\/\/api\.faceapp\.io(.*)\/api\/v.*\/auth\/user\/credentials requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/FaceApp.js

[MITM]
hostname = api.faceapp.io
*/

    let headers = $response.headers;
    let status = $response.status;
    let obj = JSON.parse($response.body);

    {
    obj = {"subscription_apple":{"subscription_exp":3042979200,"product_id":"y"},"subscription_google":null};
    $done({body: JSON.stringify(obj)});
}
    {
    status = 200;
    $done({status});
}
    {
    delete headers['X-FaceApp-ErrorCode'];
    $done({headers});
}
