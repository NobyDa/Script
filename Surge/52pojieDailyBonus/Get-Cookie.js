/*
52pojie Forum get cookie

Surge 4.0 : [Script]
http-request https:\/\/www\.52pojie\.cn\/home\.php\? script-path=https://raw.githubusercontent.com/NobyDa/Script/master/Surge/52pojieDailyBonus/Get-Cookie.js

MITM = www.52pojie.cn
*/
  
  if ($request.url.indexOf('home') != -1) {
    if ($request.headers['Cookie']) {
      var headerWA = $request.headers['Cookie'];
      $persistentStore.write(headerWA, "CookieWA");
      $notification.post("Get Cookie success！🎉", "", "You can disable the HTTP request script")
    }
  }
  $done({})