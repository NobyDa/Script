/*
iQIYI Daily bonus script

Update 2020.1.2 17:00

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
http-request https?:\/\/.*\.iqiyi\.com\/.*authcookie= script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/iQIYI-DailyBonus/iQIYI_GetCookie.js

# MITM = *.iqiyi.com
*/

$httpClient.get('https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001=' + $persistentStore.read("CookieQY"), function(error, response, data) {
  if (error) {
    $notification.post("爱奇艺签到,请求失败‼️‼️‼", "", error);
  } else {
    var obj = JSON.parse(data);
    if (obj.msg == "成功") {
      if (obj.data.signInfo.code == "A00000") {
        console.log("success response: \n" + data);
        var status = obj.data.signInfo.msg;
        var AwardName = obj.data.signInfo.data.rewards[0].name;
        var quantity = obj.data.signInfo.data.rewards[0].value;
        var continued = obj.data.signInfo.data.continueSignDaysSum;
        $notification.post("爱奇艺签到", "", status + "！获得" + AwardName + quantity + ", 已连续签到" + continued + "天 🎉");
      } else {
        console.log("failure response: \n" + data);
        $notification.post("爱奇艺签到", "", "失败, " + obj.data.signInfo.msg + "⚠️");
      }
    } else {
      $notification.post("爱奇艺签到,Cookie无效‼️‼️", "", data);
    }
  }
})
$done()