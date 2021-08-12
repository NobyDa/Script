/*
爱美剧 解锁部分功能
官网: https://www.mjapp.cc
脚本原作者: 灰灰

可自行添加启动广告/弹窗规则, REGEX:
^https?://api.bjxkhc.com/index.php/app/ios/ads/index
^https?://api.bjxkhc.com/index.php/app/ios/ver/index_ios$
^https?://api.bjxkhc.com/index.php/app/ios/pay/ok$

***************************
QuantumultX:

[rewrite_local]
^https?:\/\/api.bjxkhc.com\/index\.php\/app\/ios\/(vod\/show|(user|vod|topic|type)\/index) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/aimeiju.js

[mitm]
hostname = api.bjxkhc.com

***************************
Surge4 or Loon:

[Script]
http-response ^https?:\/\/api.bjxkhc.com\/index\.php\/app\/ios\/(vod\/show|(user|vod|topic|type)\/index) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/aimeiju.js

[MITM]
hostname = api.bjxkhc.com

**************************/

var url = $request.url;
var obj = JSON.parse($response.body || '{}');
const user = "/index.php/app/ios/user/index"; //用户信息
const show = "/index.php/app/ios/vod/show"; //视频播放页面
const banner = "/index.php/app/ios/vod/index";//首页轮播广告
const topic = "/index.php/app/ios/topic/index";//豆瓣热榜中间广告
const type = "/index.php/app/ios/type/index"//综合专区，美剧专区中间广告

if (obj.data && obj.data.user && url.indexOf(user) != -1) {
    obj.data.user.viptime = "2088-08-08 08:08:08";
    obj.data.user.cion = "88888";
    obj.data.user.vip = "1";
}

if (obj.data && url.indexOf(show) != -1) {
    obj.data.looktime = -1;
    obj.data.vip = "4";
    delete obj.data.advertising;//视频下方轮播，删掉也不能清除广告占位
    obj.data.CT_App_Show_Pic1 = "";//联系客服图片
    obj.data.CT_App_Show_Url1 = "";//联系客服链接
    obj.data.CT_App_Show_Vod1 = "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1519044039,3175177225&fm=26&gp=0.jpg";//片头广告,留空的话不会自动播放
    obj.data.CT_App_Show_Vod_Time1 = "0";//片头广告显示时间(0秒也短暂显示)
    obj.data.CT_App_Show_Vod_Url1 = "";//片头广告链接
    obj.data.CT_App_Show_Vod_Type1 = "2";//片头广告显示类型，0一直显示,1暂停播放显示,2显示后自动播放
    obj.data.CT_App_Show_Vod_must_Time1 = "0";//片头联系客服图片显示时间，前面改VIP这里自动变0
    obj.data.CT_Pic_url1_pause = "";//暂停联系客服图片
    obj.data.CT_Pic_url1_pause_skip = "";//暂停联系客服链接
}

if (obj.data && url.indexOf(banner) != -1) {
    for (var i = obj.data.length - 1; i >= 0; i--) {
        if (obj.data[i].ad == 1) {
            obj.data.splice(i, 1)
        }
    }
}

if (obj.data && (url.indexOf(topic) != -1 || url.indexOf(type) != -1)) {
    for (var i = obj.data.length - 1; i >= 0; i--) {
        if (obj.data[i].ad == 1) {
            obj.data[i].ad = 0;
            obj.data[i].pic = "";
            delete obj.data[i].url
        }
    }
}
$done({ body: JSON.stringify(obj) });