hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com, mp.weixin.qq.com, api.bilibili.com, app.bilibili.com, *.zhihu.com, aweme*.snssdk.com, *.kuwo.cn, ios.xiaoxiaoapps.com, api*.tiktokv.com, *.musical.ly, *.amemv.com, mjappaz.yefu365.com, p.du.163.com, getuserinfo.321mh.com, getuserinfo-globalapi.zymk.cn, api-163.biliapi.net, ios.fuliapps.com, vsco.co, api.vnision.com, *.my10api.com, bd.4008109966.net, sp.kaola.com, r.inews.qq.com, apple.fuliapps.com, newdrugs.dxy.cn, bdapp.4008109966.net, app101.avictown.cc, api.hlo.xyz, api.ijo.xyz, www.luqijianggushi.com, account.wps.cn, u.kanghuayun.com, api.gyrosco.pe, api1.dobenge.cn, api.mvmtv.com, mitaoapp.yeduapp.com, origin-prod-phoenix.jibjab.com, www.3ivf.com, pay.guoing.com, p.doras.api.vcinema.cn, api.termius.com, mjappaz.yefu365.com, viva.v21xy.com, dida365.com, ticktick.com, biz.caiyunapp.com, 


# 去微博应用内广告 (By yichahucha)
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page) url script-response-body https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js

# 去微信公众号广告 (By Choler)
^https?:\/\/mp\.weixin\.qq\.com\/mp\/getappmsgad url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/Wechat.js

# 知乎去广告 (By onewayticket255)
^https://api.zhihu.com/topstory/follow url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20feed.js
^https://api.zhihu.com/topstory/recommend url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20recommend.js
^https://api.zhihu.com/.*/questions url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20answer.js
^https://api.zhihu.com/market/header url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20zhihu%20market.js

# 哔哩哔哩动画去广告 (By onewayticket255)
^https://app.bilibili.com/x/resource/show/tab\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliTab.js
^https://app.bilibili.com/x/v2/feed/index\?access_key url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20feed.js
^https://app.bilibili.com/x/v2/account/mine\?access_key url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilibiliAccount.js
^https://app.bilibili.com/x/v2/view\?access_key url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20view%20relate.js
^https://app.bilibili.com/x/v2/rank url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20rank.js
^https://api.bilibili.com/x/v2/reply/main\?access_key url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20reply.js
^https://app.bilibili.com/x/v2/show/popular/index\?access_key url script-response-body https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20hot.js

# 抖音去广告去水印 (By Choler)
^https://[\s\S]*\/aweme/v1/(feed|aweme/post|follow/feed)/ url script-response-body https://Choler.github.io/Surge/Script/Aweme.js
^https://aweme-eagle(.*)\.snssdk\.com/aweme/v2/ url 302 https://aweme-eagle$1.snssdk.com/aweme/v1/

# 酷我音乐SVIP (By yxiaocai)
^https?:\/\/vip1\.kuwo\.cn\/(vip\/v2\/user\/vip|vip\/spi/mservice) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Kuwo.js

# 小小影视Vip (By Meeta)
https:\/\/ios\.xiaoxiaoapps\.com\/(vod\/reqplay\/|ucp/index) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/xxys.js
# 启动广告
https:\/\/ios\.xiaoxiaoapps\.com\/getGlobalData url reject

# tiktok封区解锁
(.*video_id=\w{32})(.*watermark=)(.*) url 302 $1
(?<=(carrier|account|sys)_region=)CN url 307 JP

# 爱美剧Vip (原作 Meeta)（官网下载：app.meiju2018.com）
^https?:\/\/mjapp\.\w{1,9}\.com\/index\.php\/app\/ios\/(vod\/show|user\/index) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/aimeiju.js
# 广告
^https:\/\/www.3ivf\.com\/index\.php\/app\/android\/ads\/index url reject
^https:\/\/mjappaz\.yefu365\.com\/index\.php\/app\/ios\/ver\/index_ios url reject

# 网易蜗牛读书VIP (By yxiaocai and JO2EY)
^https?://p\.du\.163\.com/readtime/info.json url reject
^https?:\/\/p\.du\.163\.com\/gain\/readtime\/info\.json url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/wnyd.js

# 看漫画极速版vip (By HoGer)
^https?:\/\/getuserinfo\.321mh\.com\/app_api\/v5\/getuserinfo\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/kmh.js

# 知音漫客VIP (By mieqq)
^https://getuserinfo-globalapi.zymk.cn/app_api/v5/(getuserinfo|coin_account|getuserinfo_ticket|getcomicinfo)/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/Zymh.js

# 网易漫画去开屏广告
^https://api-163.biliapi.net/cover url reject-img

# 香蕉视频VIP (By Meeta)
^https?:\/\/ios\.fuliapps\.com\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/xjsp.js

# 哔哩哔哩番剧开启1080P+
^https?:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilifj.js

# VSCO滤镜VIP
^https?:\/\/vsco\.co\/api\/subscriptions\/2.1\/user-subscriptions\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/vsco.js

# 大片-视频编辑器 VIP
^https?:\/\/api\.vnision\.com\/v1\/(users\/|banners) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/dapian.js

# 91短视频
^https?:\/\/.+\.(my10api|(.*91.*))\.(com|tips|app|xyz)(:\d{2,5})?\/api.php$ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/91.js

# 布丁漫畫（蜜桃漫画）VIP
^https?:\/\/(bd|bdapp|mitaoapp)\.(4008109966|yeduapp)\.(net|com)\/\/index\.php\/api\/User\/userLogin url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bdmh.js

# 网易考拉 去广告 (By Choler)
^https://sp\.kaola\.com/api/openad$ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/wykaola.js

# 腾讯新闻 去广告 (By Choler)
^https://r\.inews\.qq.com\/get(QQNewsUnreadList|RecommendList) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/QQNews.js

# 商店版香蕉视频VIP (By Meeta)
^https?:\/\/apple\.fuliapps\.com url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/xjsp.js

# 用药助手解锁专业版 (By Primovist)
^https?:\/\/(i|newdrugs)\.dxy\.cn\/(snsapi\/username\/|app\/user\/(pro\/stat\?|init\?timestamp=)) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/yyzs.js

# 优乐美, 小米粒, 彩色直播三合一 解锁收费房
^https?:\/\/(.+)\.(\w{2,3})(:?\d*)\/(api\/public\/\?service=Live\.checkLive$|public\/\/\?service=Live\.roomCharge$|lg\/video\/loadVideoFees\.do$) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/zhibo.js

# 陆琪讲故事
^https:\/\/www\.luqijianggushi\.com\/api\/v2\/user\/get url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/luqi.js

# WPS (By eHpo)
^https://account.wps.cn/api/users/ url script-response-body https://raw.githubusercontent.com/eHpo1/Surge/master/wps.js

# 万象电视直播
#^https:\/\/u\.kanghuayun\.com\/api\/v2\/info url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/wxzb.js

# Gyroscope 解锁 pro (By Maasea)
^https:\/\/api\.gyrosco\.pe\/v1\/account\/$ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/gyroscope.js

# 水印精灵 vip (By Alex0510)
^https:\/\/api1\.dobenge\.cn\/api\/user\/getuserinfo url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/syjl.js

# 大千视界
^https:\/\/api\.mvmtv\.com\/index\.php.*(c=user.*a=info|a=addr.*vid=.*) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/dqsj.js

# JibJab解锁pro
^https:\/\/origin-prod-phoenix\.jibjab\.com\/v1\/user url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/jibjab.js

# 南瓜电影4.7.3版 解锁VIP
^https:\/\/(p\.doras\.api\.vcinema\.cn|pay\.guoing\.com)\/(v5\.0\/user\/\d+$|d\/user\/get_user_info) url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/ngdy.js

# Termius 解锁本地pro  (By Maasea)
https:\/\/api\.termius\.com\/api\/v3\/bulk\/account\/ url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/Termius.js

# 小影 解锁Vip (By @hiepkimcdtk55)
^https:\/\/viva\.v21xy\.com\/api\/rest\/u\/vip url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/Surge/JS/vivavideo.js

# 滴答清单 pro
^https:\/\/(ticktick|dida365)\.com\/api\/v2\/user\/status url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/DiDaQingDan.js

#彩云天气 Vip
^https:\/\/biz\.caiyunapp\.com\/v2\/user\?app_name\=weather url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/ColorWeather.js