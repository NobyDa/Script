/*
WPS Office 解锁部分功能

***************************
QuantumultX:

[rewrite_local]
^https?:\/\/[a-z-]*account\.wps\.c(n|om)(:\d+|)\/api\/users url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Wps.js

[mitm]
hostname = *account.wps.cn, *account.wps.com

***************************
Surge4 or Loon:

[Script]
http-response ^https?:\/\/[a-z-]*account\.wps\.c(n|om)(:\d+|)\/api\/users requires-body=1,max-size=-1,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Wps.js

[MITM]
hostname = *account.wps.cn, *account.wps.com

**************************/

var body = JSON.parse($response.body);
var obj = {
  exp: 0,
  level: 3,
  privilege: [
    { spid: "data_recover", times: 0, expire_time: 1846256142 },
    { spid: "ocr", times: 0, expire_time: 1846256142 },
    { spid: "pdf2doc", times: 0, expire_time: 1846256142 },
    { spid: "pdf_merge", times: 0, expire_time: 1846256142 },
    { spid: "pdf_sign", times: 0, expire_time: 1846256142 },
    { spid: "pdf_split", times: 0, expire_time: 1846256142 }
  ],
  result: "ok",
  total_buy: 0,
  total_cost: -30,
  userid: body.userid,
  vip: {
    name: "超级会员",
    has_ad: 0,
    memberid: 40,
    expire_time: 1846256142,
    enabled: [
      { memberid: 40, name: "超级会员", expire_time: 1846256142 },
      { memberid: 20, name: "WPS会员", expire_time: 1846256142 },
      { memberid: 12, name: "稻壳会员", expire_time: 1846256142 }
    ]
  },
  wealth: 0,
  expire_time: 1846256142
};

$done({ body: JSON.stringify(obj) });