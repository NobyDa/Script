/*
[Script]
http-response ^https?:\/\/api\.faceapp\.io(.*)\/api\/v3.0\/auth\/user\/credentials requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/FaceApp.js

[MITM]
hostname = api.faceapp.io

禁止用于牟利用途, 脚本仅供学习参考
转载注明出处, TG频道 @NobyDa 
*/

    let headers = $response.headers;
    let status = $response.status;
    let obj = JSON.parse($response.body);

    {
    obj = {"subscription_apple":{"subscription_exp":3042979200,"product_id":"y"},"subscription_google":null,"user_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzZXNzaW9uX2lkIjoiIiwiZGV2aWNlX2lkIjoiRUQ4MzU3MkEtRUE1RC00Q0ZCLUI3QUItQzJEQTI4NDEyMThFIiwiZXhwIjoxNTY0MTkzODQwLCJzdWJzY3JpcHRpb24iOnsic3Vic2NyaXB0aW9uX2V4cCI6MTU5NTI5MTUyNCwiY3VzdG9tZXJfaWQiOiJFU1pSMEYvQWxibTZSMjZNdmVFYmp3aHVxdC9lM1hOWTRNVU9kTlF6cHRzPSIsInByb2R1Y3RfaWQiOiJ5In0sImxpZmV0aW1lIjo4NjQwMH0.3necQWyCB2_1omqXE7pc01JSbxHoehbZisY2TQ3Eiux_999OMW-_ObgWXxN8VorQ9Js88uCbUOafuOKIKH4WvQ","user_token_lifetime":86400,"user":null};

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