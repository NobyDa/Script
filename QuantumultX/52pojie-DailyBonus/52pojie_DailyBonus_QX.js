/*
52pojie forum daily bonus script

Update 2019.12.29 15:30

About the author:
If reproduced, indicate the source
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
Need to manually log in to the https://www.52pojie.cn/home.php?mod=space checkin to get cookie. if QX pops up to get a cookie success notification, you can disable this script.
Note that the following config is only a local script configuration, please put this script into Quantumult X/Script

script will be performed every day at 9 am. You can modify the execution time.

[task_local]
# 52pojie daily bonus script
0 9 * * * 52pojie_DailyBonus_QX.js

[rewrite_local]
# Get cookie. 【QX TF188+】:
https:\/\/www\.52pojie\.cn\/home\.php\?mod=space url script-request-header 52pojie_GetCookie_QX.js

# MITM = www.52pojie.cn
*/

var bonus = {
  url: 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&mobile=no',
  headers: {
    "Cookie": $prefs.valueForKey("CookieWA"),
  }
};
var date = new Date()
var week = ["Sunday","Monday","Tuseday","Wednesday","Thursday","Friday","Saturday"];
var month = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];

$task.fetch(bonus).then(response => {
      if (response.body.match(/\u606d\u559c\u60a8/)) {
      $notify("52pojie Daily bonus", "", week[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + "Daily bonus success！🎉")
    } else {
      if (response.body.match(/\u4e0b\u671f\u518d\u6765/)) {
        $notify("52pojie Daily bonus", "", week[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + "Repeat ⚠️")
      } else {
        if (response.body.match(/\u9700\u8981\u5148\u767b\u5f55/)) {
          $notify("52pojie Daily bonus. Error. Cookies expire", "", "Please reopen the script to get‼️")
        } else {
          $notify("52pojie Daily bonus", "", "Scripts need to be updated ‼️‼️")
        }
      }
    }
}, reason => {
    $notify("52pojie Daily bonus. Interface error‼️‼️‼️", "", reason.error)
});
