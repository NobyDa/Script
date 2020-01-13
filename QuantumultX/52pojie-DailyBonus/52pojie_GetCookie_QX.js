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

var WAPJ = $request.headers["Cookie"];

if (WAPJ) {
  if ($prefs.valueForKey("CookieWA") != undefined) {
    if ($prefs.valueForKey("CookieWA") != WAPJ) {
      var cookie = $prefs.setValueForKey(WAPJ, "CookieWA");
      if (!cookie) {
        $notify("更新吾爱破解签到Cookie失败‼️", "", "")
      } else {
        $notify("更新吾爱破解签到Cookie成功 🎉", "", "")
      }
    }
  } else {
    var cookie = $prefs.setValueForKey(WAPJ, "CookieWA");
    if (!cookie) {
      $notify("首次写入吾爱破解Cookie失败‼️", "", "")
    } else {
      $notify("首次写入吾爱破解Cookie成功 🎉", "", "")
    }
  }
}
$done({})