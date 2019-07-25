# Script简介

## 整合脚本搬运工一枚,欢迎关注TG频道[@NobyDa](https://t.me/NobyDa)
 
**QuantumultX的可用脚本比较少,手动修改了surge脚本格式,对接部分兼容QuantumultX的脚本 已实测全部可用**

**订阅所有QuanX脚本**: [点此查看订阅链接](https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/Js.conf)
 
-------
 
**去微博应用内与启动页广告** 
;注: 国际版使用会有不显示头像的问题

^https?:\/\/(api|mapi)\.weibo\.(cn|com)\/2(\/groups\/timeline|\/statuses\/unread|\/statuses\/extend|\/comments\/build_comments|\/photo\/recommend_list|\/stories\/video_stream|\/statuses\/positives\/get|\/stories\/home_list|\/profile\/statuses|\/statuses\/friends\/timeline|\/service\/picfeed) url script-response-body https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js

^https?:\/\/(sdk|wb)app\.uve\.weibo\.com(\/interface\/sdk\/sdkad.php|\/wbapplua\/wbpullad.lua) url script-response-body https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js

hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com, 

来源作者: [yichahucha](https://github.com/yichahucha)
 
 ------------
  
**去微信公众号底部广告** 

^https?:\/\/mp\.weixin\.qq\.com\/mp\/getappmsgad url script-response-body https://Choler.github.io/Surge/Script/WeChat.js

hostname = mp.weixin.qq.com,

来源作者: [Choler](https://github.com/Choler)
 
 ---------------
   
**知乎去广告** 

^https://api.zhihu.com/topstory/follow url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20feed.js

^https://api.zhihu.com/topstory/recommend url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20recommend.js

^https://api.zhihu.com/.*/questions url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20answer.js

^https://api.zhihu.com/market/header url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20market.js

hostname = *.zhihu.com,

来源作者: [onewayticket255](https://github.com/onewayticket255)
 
 ---------------
 
 **哔哩哔哩动画去广告** 

^https://app.bilibili.com/x/resource/show/tab url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20tab.js

^https://app.bilibili.com/x/v2/feed url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20feed.js

^https://app.bilibili.com/x/v2/account/mine url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20account.js

^https://app.bilibili.com/x/v2/view\?access_key url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20view%20relate.js

^https://app.bilibili.com/x/v2/rank url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20rank.js

hostname = api.bilibili.com, app.bilibili.com, 

来源作者: [onewayticket255](https://github.com/onewayticket255)

--------

**抖音 去广告 去水印** 

^https://aweme(-eagle)?.snssdk.com/aweme/v\d/(.*/)?(feed|post)/ url script-response-body https://Choler.github.io/Surge/Script/Aweme.js

hostname = aweme*.snssdk.com, 

来源作者: [Choler](https://github.com/Choler)

-----------


**南瓜电影Vip**

^https?:\/\/p\.doras\.api\.vcinema\.cn\/v5.0\/user/ url script-response-body https://meetagit.github.io/MeetaRules/Surge/Scripting/cushawmovie.js

hostname = *.api.vcinema.cn,

来源作者: [Meeta](https://github.com/MeetaGit)

-------------

**西瓜视频Vip**

^https?:\/\/api2\.gkaorlz\.com\:8080\/api\/user\/ url script-response-body https://meetagit.github.io/MeetaRules/Surge/Scripting/watermelonvideo.js

hostname = api2.gkaorlz.com,

来源作者: [Meeta](https://github.com/MeetaGit)

--------------

**酷我音乐SVIP**

^https?:\/\/.*\.kuwo\.cn url script-response-body https://meetagit.github.io/MeetaRules/Surge/Scripting/kuwovip.js

hostname = *.kuwo.cn,

来源作者: [Meeta](https://github.com/MeetaGit)

-------------

**小小影视Vip**官网(http://tinyurl.com/y4thsp99)

;^https?:\/\/ios\.xiaoxiaoapps\.com\/ url script-response-body https://meetagit.github.io/MeetaRules/Surge/Scripting/smallvideo.js

hostname = ios.xiaoxiaoapps.com,

来源作者: [Meeta](https://github.com/MeetaGit)

--------

**爱美剧Vip**（官网：app.meiju2018.com）

^https?://mjappaz.yefu365.com/index.php/app/ios/ url script-response-body https://meetagit.github.io/MeetaRules/Surge/Scripting/aimeiju.js

hostname = mjappaz.yefu365.com,

来源作者: [Meeta](https://github.com/MeetaGit)

--------

**115离线下载** 

;该脚本无破解离线功能,使用方法:115首页的签到按钮跳转到离线下载页面

^http:\/\/115\.com\/lx.*$  url script-response-body https://raw.githubusercontent.com/ikanam/Surge-Scripts/master/115lx.js
^http:\/\/115\.com\/\?ct=sign url 302 http://115.com/lx?taskdg=1
hostname = *.115.com

来源作者: [ikanam](https://github.com/ikanam)


## 注:所有脚本均已注明来源 如有问题联系[@nubida](https://t.me/nubida)
