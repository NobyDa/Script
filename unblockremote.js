/*
[rewrite_local]
^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body NobyDa/unblockremote.js
[mitm]
hostname = raw.githubusercontent.com, *.github.io
*/
var body = $response.body;
body = '\/*\n@supported DeviceID1 DeviceID2 DeviceID3\n*\/\n' + body;
$done(body);
