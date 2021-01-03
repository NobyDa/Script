//简讯解锁Vip 

//下载地址:https://apps.apple.com/cn/app/%E7%AE%80%E8%AE%AF-%E5%BE%88%E5%A4%9A%E4%BA%8B%E7%9F%A5%E9%81%93%E7%BB%93%E8%AE%BA%E5%B0%B1%E5%A4%9F%E4%BA%86/id1160249028

//host
//ios.tipsoon.com

//rewrite_local
//^https:\/\/ios\.tipsoon\.com\/\?a=getUserInfo url script-response-body Jx.js

var obj = JSON.parse($response.body);
obj = {
  "status" : 1,
  "user" : {
    "device" : "",
    "devicetoken" : "",
    "expire_time" : "2020-12-21 20:15:26",
    "remark" : "--",
    "country" : "",
    "icon_url" : "https://thirdqq.qlogo.cn/g?b=oidb&k=enQKDLXG2XzpRBSozRjNjA&s=100&t=1573625752",
    "created" : "2020-12-21 18:13:32",
    "wherefrom" : "",
    "address" : "",
    "is_comment_notice" : "0",
    "is_sleep" : "1",
    "updated" : "2020-12-21 18:13:32",
    "is_vip" : 1,
    "realname" : "",
    "version" : "",
    "vip_expire_time" : "2066-08-07 02:01:45",
    "is_red" : "0",
    "wx_union_id" : "",
    "name" : "...",
    "code" : "0A7FD2B1-A143-4327-BA71-CF6958AED54A",
    "system_version" : "",
    "is_reportreply" : "0",
    "city" : "",
    "avatar" : "0",
    "mi_uid" : "",
    "status" : "1",
    "mobile" : "",
    "invite" : "0",
    "province" : "",
    "deleted" : "0",
    "user_id" : "",
    "gender" : "0",
    "qq_id" : "0",
    "point" : "0",
    "password" : "",
    "ip" : "14.219.226.10",
    "is_broadcast" : "0",
    "apple_id" : "",
    "is_bc" : "0",
    "actived" : "2020-12-06 02:00:00"
  }
}
$done({body: JSON.stringify(obj)});
//By XIROU
