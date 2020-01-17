/*
iQIYI Checkin Get Cookie.

Update 2019.12.31 0:30

About the author:
If reproduced, indicate the source
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When iQiyi app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

script will be performed every day at 9 am. You can modify the execution time.
Note that the following config is only a local script configuration, please put both scripts into Quantumult X/Script, and the cookie script only works for iQIYI apps in china apple store

[rewrite_local]
# Get iQIYI cookie. 【QX TF188+】:
https?:\/\/.*\.iqiyi\.com\/.*authcookie= url script-request-header iQIYI_GetCookie_QX.js

# MITM = *.iqiyi.com

[task_local]
0 9 * * * iQIYI_DailyBonus_QX.js

*/

var regex = /authcookie=([A-Za-z0-9]+)/;
var iQIYI = regex.exec($request.url)[1];

if ($prefs.valueForKey("CookieQY") != undefined) {
  if ($prefs.valueForKey("CookieQY") != iQIYI) {
    var cookie = $prefs.setValueForKey(iQIYI, "CookieQY");
    if (!cookie) {
      $notify("更新爱奇艺签到Cookie失败‼️", "", "")
    } else {
      $notify("更新爱奇艺签到Cookie成功 🎉", "", "")
    }
  }
} else {
  var cookie = $prefs.setValueForKey(iQIYI, "CookieQY");
  if (!cookie) {
    $notify("首次写入爱奇艺Cookie失败‼️", "", "")
  } else {
    $notify("首次写入爱奇艺Cookie成功 🎉", "", "")
  }
}
$done({})