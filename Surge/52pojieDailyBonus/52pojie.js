/*
52pojie Forum daily automatic bonus.

Description :
When using for the first time. Need to manually log in to the 52pojie forum to get cookie. When Surge pops up to get a successful notification, you can disable the HTTP request script.
Due to the validity of cookie, if the script pops up a notification of cookie invalidation in the future, you need to repeat the above steps.


Surge4.0 or Loon : 
[Script]

// Daily bonus Script. Will be performed every day at 8 am. You can modify the execution time.
cron "0 8 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/52pojieDailyBonus/52pojie.js

// Get Cookie Script :
http-request https:\/\/www\.52pojie\.cn\/home\.php\? script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/52pojieDailyBonus/Get-Cookie.js

// MITM = www.52pojie.cn
*/

var bonus = {
  url: 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&mobile=no',
  headers: {
    Cookie: $persistentStore.read("CookieWA"),
  }
};
var date = new Date()
var week = ["Sunday","Monday","Tuseday","Wednesday","Thursday","Friday","Saturday"];
var month = ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."];

$httpClient.get(bonus, function(error, response, data) {
  if (error) {
    console.log(error);
    $notification.post("52pojie Daily bonus. Interface error‼️‼️‼️", "", error)
    $done()
  } else {
    if (data.match(/(ÒÑÍê³É|\u606d\u559c\u60a8)/)) {
      $notification.post("52pojie Daily bonus", "", week[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + "Daily bonus success！🎉")
      $done()
    } else {
      if (data.match(/(ÄúÒÑ|\u4e0b\u671f\u518d\u6765)/)) {
        $notification.post("52pojie Daily bonus", "", week[date.getDay()] + ", " + month[date.getMonth()] + " " + date.getDate() + ", " + "Repeat ⚠️")
        $done()
      } else {
        if (data.match(/(ÏÈµÇÂ¼|\u9700\u8981\u5148\u767b\u5f55)/)) {
          $notification.post("52pojie Daily bonus. Error. Cookies expire", "", "Please reopen the script to get‼️")
          $done()
        } else {
          $notification.post("52pojie Daily bonus", "", "Scripts need to be updated ‼️‼️")
          $done()
        }
      }
    }
  }
})

// If reprinted, please indicate the source. My TG channel @NobyDa