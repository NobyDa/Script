/*
iQIYI Daily bonus script

Update 2020.1.2 17:00

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

var bonus = {
  url: 'https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001=' + $prefs.valueForKey("CookieQY"),
};
$task.fetch(bonus).then(response => {
  var obj = JSON.parse(response.body);
  if (obj.msg == "成功") {
    if (obj.data.signInfo.code == "A00000") {
      console.log("success response: \n" + response.body);
      var status = obj.data.signInfo.msg;
      var AwardName = obj.data.signInfo.data.rewards[0].name;
      var quantity = obj.data.signInfo.data.rewards[0].value;
      var continued = obj.data.signInfo.data.continueSignDaysSum;
      $notify("爱奇艺签到", "", status + "！获得" + AwardName + quantity + ", 已连续签到" + continued + "天 🎉");
    } else {
      console.log("failure response: \n" + response.body);
      $notify("爱奇艺签到", "", "失败, " + obj.data.signInfo.msg + "⚠️");
    }
  } else {
    $notify("爱奇艺签到,Cookie无效‼️‼️", "", response.body);
  }
}, reason => {
  $notify("爱奇艺签到,请求失败‼️‼️‼", "", reason.error);
});