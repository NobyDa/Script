/*
iQIYI Daily bonus script

Update 2019.12.29 15:30

About the author:
If reproduced, indicate the source
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When iQiyi app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

script will be performed every day at 9 am. You can modify the execution time. and the cookie script only works for iQIYI apps in china apple store

[Script]
# iQIYI Daily bonus script
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/iQIYI-DailyBonus/iQIYI_DailyBonus.js

# Get Cookie
http-request https:\/\/passport\.iqiyi\.com\/apis\/user\/info\.action.*authcookie script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/iQIYI-DailyBonus/iQIYI_GetCookie.js

# MITM = passport.iqiyi.com
*/

var regex = /authcookie=([A-Za-z0-9]+)/;
var iQIYI = regex.exec($request.url)[1];

if ($persistentStore.read("CookieQY") != null) {
  if ($persistentStore.read("CookieQY") != iQIYI) {
    var cookie = $persistentStore.write(iQIYI, "CookieQY");
    if (!cookie) {
      $notification.post("更新爱奇艺签到Cookie失败‼️", "", "")
    } else {
      $notification.post("更新爱奇艺签到Cookie成功 🎉", "", "")
    }
  }
} else {
  var cookie = $persistentStore.write(iQIYI, "CookieQY");
  if (!cookie) {
    $notification.post("首次写入爱奇艺Cookie失败‼️", "", "")
  } else {
    $notification.post("首次写入爱奇艺Cookie成功 🎉", "", "")
  }
}
$done({})