/*
   感谢tg大佬 2333
   Surge 4.0:
   http-response ^https:\/\/commerce-api\.faceu\.mobi\/commerce\/v1\/subscription\/user_info requires-body=1,script-path=https://raw.githubusercontent.com/velazquez111/Script/master/Surge/JS/ulike.js

*/
let obj = JSON.parse($response.body);
obj ={
"ret":"0",
"errmsg":"Success",
"systime":"",
"data":{
"flag":true,
"start_time":1579094492,
"end_time":3725012184,
"is_first_subscribe":false,
"is_cancel_subscribe":false,
"uid":"4089778978429341",
"subscribe_uid":"70851259049"
}
};
$done({body: JSON.stringify(obj)});

