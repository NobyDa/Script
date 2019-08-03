
var body = $response.body;
var url = $request.url;
const path1 = "/ucp/index";
const path2 = "/getGlobalData";
const path3 = "/vod/reqplay/"
if (url.indexOf(path1) != -1){
  let obj = JSON.parse(body);
  obj.data.uinfo.down_daily_remainders = "666";
  obj.data.uinfo.play_daily_remainders = "666";
  obj.data.uinfo["next_upgrade_need"] = "0";
  obj.data.user.isvip = "1";
  obj.data.user.nickname = "Meeta_share";
  obj.data.user.gicon = "V5";
  obj.data.user.gid = "5";
  obj.data.user.avatar = "https://s2.ax1x.com/2019/07/11/ZRNrbq.th.jpg";
  body = JSON.stringify(obj);
}

if (url.indexOf(path2) != -1){
  let obj = JSON.parse(body);
  obj.data.app_launch_times_adshow = "0";
  obj.data.adgroups = "";
  obj.data.iOS_adgroups ="";
  body = JSON.stringify(obj);
}
if (url.indexOf(path3) != -1){
  let obj = JSON.parse(body);
  obj.retcode = "0";
  if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
	body = JSON.stringify(obj);
}
$done({body});

//（Made by Meeta）
