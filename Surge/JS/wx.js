let obj = JSON.parse($response.body);
let url = $request.url;
const path = 'auth';
const path1 = 'info';

if (url.indexOf(path1) != -1) {
　　obj.data.nickname = "脚本禁止牟利,TG频道@NobyDa";
　　obj.data.tstime = 59169305884;
　　obj.data.vip_expire_time = 59169305884;
　　obj.data.tsvip = 1;
　　obj.data.vip_level = 3;
}

if (url.indexOf(path) != -1) {
　　obj.code = 200;
　　obj.suc = 200;
}
$done({body: JSON.stringify(obj)});