/*
Bilibili Manga Daily Bonus

About the author:
If reproduced, indicate the source
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When Bilibili Manga app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

script will be performed every day at 9 am. You can modify the execution time.

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/Manga.js

# Get bilibili cookie.
http-request https:\/\/manga\.bilibili\.com\/.*\.User\/GetWallet max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/Manga.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
0 9 * * * Manga.js

[rewrite_local]
# Get bilibili cookie. QX 1.0.5(188+):
https:\/\/manga\.bilibili\.com\/.*\.User\/GetWallet url script-request-header Manga.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = manga.bilibili.com
~~~~~~~~~~~~~~~~


*/


const $nobyda = nobyda();

if ($nobyda.isRequest) {
  GetCookie()
  $nobyda.end()
} else {
  checkin()
  $nobyda.end()
}

function checkin() {
  const bilibili = {
    url: 'https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn',
    headers: {
      Cookie: $nobyda.read("CookieBM"),
    },
    body: "platform=ios"
  };
  $nobyda.post(bilibili, function(error, response, data) {
    if (!error) {
      if (response.status == 200) {
        console.log("bilibili success response : \n" + data)
        $nobyda.notify("哔哩哔哩漫画 - 签到成功！🎉", "", "")
      } else {
        console.log("bilibili failed response : \n" + data)
        if (data.match(/duplicate/)) {
          $nobyda.notify("哔哩哔哩漫画 - 今日已签过 ⚠️", "", "")
        } else if (data.match(/uid must/)) {
          $nobyda.notify("哔哩哔哩漫画 - Cookie无效 ‼️‼️", "", "")
        } else {
          $nobyda.notify("哔哩哔哩漫画 - 签到失败 ‼️", "", data)
        }
      }
    } else {
      $nobyda.notify("哔哩哔哩漫画 - 签到接口请求失败", "", error)
    }
  })
}

function GetCookie() {
  var CookieName = "B站漫画";
  var CookieKey = "CookieBM";
  var regex = /SESSDATA=.+?;/;
  if ($request.headers) {
    var header = $request.headers['Cookie'] ? $request.headers['Cookie'] : "";
    if (header.indexOf("SESSDATA=") != -1) {
      var CookieValue = regex.exec(header)[0];
      if ($nobyda.read(CookieKey)) {
        if ($nobyda.read(CookieKey) != CookieValue) {
          var cookie = $nobyda.write(CookieValue, CookieKey);
          if (!cookie) {
            $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
          } else {
            $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
          }
        }
      } else {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
        } else {
          $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
        }
      }
    } else {
      $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "Cookie关键值缺失");
    }
  } else {
    $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头,");
  }
}

function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
};