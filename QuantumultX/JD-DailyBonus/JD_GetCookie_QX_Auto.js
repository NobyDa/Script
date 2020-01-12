/*
JingDong Check in Get Cookie. by NobyDa

Need to manually log in to the https://bean.m.jd.com checkin to get cookie. When QX pops up to get a successful notification, you can disable the script.
Note that the following config is only a local script configuration, please put this script into Quantumult X/Script

[rewrite_local]
# Get JingDong cookie. 【QX TF188+】:
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex url script-request-header JD_GetCookie_QX_Auto.js

MITM = api.m.jd.com
*/

if ($request.headers['Cookie']) {
    var headerJD = $request.headers['Cookie'];
    var cookie = $prefs.setValueForKey(headerJD, "CookieJD");
    if (!cookie){
      $notify("写入京东Cookie失败‼️‼️", "", "请重试")
    } else {
      $notify("写入京东Cookie成功🎉", "", "您可以手动禁用此脚本")
      //console.log("京东Cookie : \n" + $prefs.valueForKey("CookieJD"))
    }
  } else {
    $notify("写入京东Cookie失败‼️‼️", "", "请退出账号, 重复步骤")
  }
  $done({})