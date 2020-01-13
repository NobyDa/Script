/*

TieBa Checkin Get Cookie.

About the author:
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When TieBa app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

Note that the following config is only a local script configuration, please put this scripts into Quantumult X/Script, and the cookie script only works for TieBa apps in china apple store

[rewrite_local] 
# Get TieBa cookie. 【QX TF188+】:
https?:\/\/c\.tieba\.baidu\.com\/c\/s\/login url script-request-header TieBa_GetCookie_QX.js

# MITM = c.tieba.baidu.com

*/

var headerCookie = $request.headers["Cookie"];

if (headerCookie) {
  if ($prefs.valueForKey("CookieTB") != undefined) {
    if ($prefs.valueForKey("CookieTB") != headerCookie) {
      if (headerCookie.indexOf("BDUSS") != -1) {
        var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
        if (!cookie) {
          $notify("更新贴吧Cookie失败‼️", "", "");
        } else {
          $notify("更新贴吧Cookie成功 🎉", "", "");
        }
      }
    }
  } else {
    if (headerCookie.indexOf("BDUSS") != -1) {
      var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
      if (!cookie) {
        $notify("首次写入贴吧Cookie失败‼️", "", "");
      } else {
        $notify("首次写入贴吧Cookie成功 🎉", "", "");
      }
    }
  }
}
$done({})