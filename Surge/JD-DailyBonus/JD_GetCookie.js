/*
JingDong Check in Get Cookie.
The following URL check in once
https://bean.m.jd.com

http-request https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JD-DailyBonus/JD_GetCookie.js

MITM = api.m.jd.com
*/

if ($request.headers['Cookie']) {
    var headerJD = $request.headers['Cookie'];
    var cookie = $persistentStore.write(headerJD, "CookieJD");
    if (!cookie){
      $notification.post("写入京东Cookie失败‼️‼️", "", "请重试")
    } else {
      $notification.post("写入京东Cookie成功🎉", "", "您可以手动禁用此脚本")
    }
  } else {
    $notification.post("写入京东Cookie失败‼️‼️", "", "请退出账号, 重复步骤")
  }
  $done({})