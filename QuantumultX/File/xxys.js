
const path1 = "/ucp/index";
const path2 = "/vod/reqplay/";
var body = $response.body;
var url = $request.url;
if (url.indexOf(path1) != -1){
	let obj = JSON.parse(body);
	obj.data.uinfo["down_daily_remainders"] = "666";
	obj.data.uinfo["play_daily_remainders"] = "666";
	obj.data.uinfo["goldcoin"] = "999";
	obj.data.uinfo["next_upgrade_need"] = "0";
	obj.data.uinfo.curr_group["gid"] = "5";
	obj.data.uinfo.curr_group["minup"] = "20";
	obj.data.uinfo.curr_group["gname"] = "尊贵VIP";
	obj.data.user["isvip"] = "1";
	obj.data.user["goldcicon"] = "666";
	obj.data.user["gicon"] = "V5";
	obj.data.user["gid"] = "5";
	body = JSON.stringify(obj);
}
if (url.indexOf(path2) != -1){
	let obj = JSON.parse(body);
	//console.log(obj);
	obj.retcode = "0";
	obj.data.lastplayindex = "1";
	if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
	body = JSON.stringify(obj);
}

$done({body});

//by Meeta
