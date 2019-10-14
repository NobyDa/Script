/*
Pumpkin movie unlock vip
Surge:
http-response ^https:\/\/(p\.doras\.api\.vcinema\.cn|pay\.guoing\.com)\/(v5\.0\/user\/\d+$|d\/user\/get_user_info) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/ngdy.js

QX:
^https:\/\/(p\.doras\.api\.vcinema\.cn|pay\.guoing\.com)\/(v5\.0\/user\/\d+$|d\/user\/get_user_info) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/ngdy.js

Surge & QX MITM = pay.guoing.com, p.doras.api.vcinema.cn,
*/

let obj = JSON.parse($response.body);
let url = $request.url;
let photo = "https://avatars2.githubusercontent.com/u/53217160";
let name = "禁止牟利, TG频道@NobyDa";
const vip = 'v5.0/user';
const pay = 'user/get_user_info';

　if (url.indexOf(vip) != -1) {
　　obj.content["user_seed_int"] = "6666666";
　　obj.content["user_photo"] = photo;
　　obj.content["user_id"] = "12873551";
　　obj.content["user_phone"] = "16666666666";
　　obj.content["user_level_str"] = "Lv5男爵";
　　obj.content["user_vip_state"] = "2";
　　obj.content["user_nickname"] = name;
　　obj.content["user_vip_start_date"] = "2016.06.06";
　　obj.content["user_vip_end_date"] = "2066.06.06";
}

　if (url.indexOf(pay) != -1) {
　　obj.content["user_vip_end_date"] = "2066-06-06";
　　obj.content["user_phone"] = "16666666666";
　　obj.content["user_nickname"] = name;
　　obj.content["user_photo"] = photo;
}
$done({body: JSON.stringify(obj)});
