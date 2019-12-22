/*
Gyroscope unlock pro (Script author: @Maasea )
Surge:
http-response ^https:\/\/api\.gyrosco\.pe\/v1\/account\/$ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/gyroscope.js

QuantumultX:
^https:\/\/api\.gyrosco\.pe\/v1\/account\/$ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/gyroscope.js

QX & Surge MITM = api.gyrosco.pe
*/

let obj = JSON.parse($response.body);
obj.user["active_until_time"] = "2099-01-01T00:00:00Z";
$done({body: JSON.stringify(obj)});