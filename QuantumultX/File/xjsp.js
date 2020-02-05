/*
Banana video unlock vip
app download link : http://tinyurl.com/y57j6hjg

QX 1.0.0:
^https?:\/\/.*\.(fuli|xiang(jiao|xiang))apps\.com\/(ucp\/index|getGlobalData|.+\/reqplay\/) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/xjsp.js

Surge 4.0：
http-response https?:\/\/.*\.(fuli|xiang(jiao|xiang))apps\.com\/(ucp\/index|getGlobalData|.+\/reqplay\/) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/xjsp.js

Surge & QX MITM = ios.fuliapps.com, apple.fuliapps.com, ios.xiangjiaoapps.com, apple.xiangjiaoapps.com, *.xiangxiangapps.com
*/

var obj = JSON.parse($response.body);
if ($request.url.indexOf("/ucp/index") != -1){
  obj.data.uinfo.down_daily_remainders = "666";
  obj.data.uinfo.play_daily_remainders = "666";
  obj.data.uinfo["next_upgrade_need"] = "0";
  obj.data.user.isvip = "1";
  obj.data.user.gicon = "V5";
  obj.data.user.gid = "5";
}
if ($request.url.indexOf("/getGlobalData") != -1){
  obj.data.app_launch_times_adshow = "0";
  obj.data.adgroups = "";
  obj.data.iOS_adgroups ="";
}
if ($request.url.indexOf("/reqplay/") != -1){
  obj.retcode = "0";
  if(obj.data.hasOwnProperty("httpurl_preview")){
  var playurl = obj.data["httpurl_preview"];
  obj.data["httpurl"] = playurl;
  };
}
$done({body: JSON.stringify(obj)});