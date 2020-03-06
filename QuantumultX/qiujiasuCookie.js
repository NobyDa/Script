/*
; Update 2020.03.06 17:00, by Kai
; 球加速免费机场✈️注册：http://yaoqing03.com/auth/register?code=BNc9
; 球加速 Cookies 获取
; 球加速登入：http://www.qiujiasu01.com/user

[rewrite_local]
^http?:\/\/www\.qiujiasu01\.com\/user url script-request-header qiujiasuCookie.js
[mitm]
www.qiujiasu01.com

*/

let headerCookie = $request.headers["Cookie"];

if (headerCookie) {
  if ($prefs.valueForKey("qiujiasuCookie") != undefined) {
    if ($prefs.valueForKey("qiujiasuCookie") != headerCookie) {
      var cookie = $prefs.setValueForKey(headerCookie, "qiujiasuCookie");
      if (!cookie) {
        $notify("更新球加速✈️Cookie失败！", "", "");
      } else {
        $notify("更新球加速✈️Cookie成功！", "", "");
      }
    }
  } else {
    let cookie = $prefs.setValueForKey(headerCookie, "qiujiasuCookie");
    if (!cookie) {
      $notify("首次写入球加速✈️Cookie失败！", "", "");
    } else {
      $notify("首次写入球加速✈️Cookie成功！", "", "");
    }
  }
}
$done({});