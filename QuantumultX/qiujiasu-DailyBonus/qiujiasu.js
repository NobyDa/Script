/*
; Update 2020.03.06 17:00, by Kai
; 球加速免费机场✈️注册：http://yaoqing03.com/auth/register?code=BNc9
; 球加速自动签到

[task_local]
6 9 * * * qiujiasu.js

*/

let Cookie = $prefs.valueForKey("qiujiasuCookie");

let Req = {
  url: "http://www.qiujiasu01.com/user/checkin",
  method: "POST",
  headers: {
    Cookie: Cookie,
    Origin: "http://www.qiujiasu01.com",
    Referer: "http://www.qiujiasu01.com/user",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
  }
};

$task.fetch(Req).then(response => {
  try {
    let doc = JSON.parse(response.body);
    if (doc["ret"] == 1) {
      $notify(
        "球加速✈️",
        "成功",
        `${doc["msg"]}\n已使用流量${doc["trafficInfo"]["lastUsedTraffic"]}\n剩余流量${doc["trafficInfo"]["unUsedTraffic"]}`
      );
    } else {
      $notify("球加速✈️", "成功", doc["msg"]);
    }
  } catch (error) {
    $notify("球加速✈️", "失败", error);
  }
});